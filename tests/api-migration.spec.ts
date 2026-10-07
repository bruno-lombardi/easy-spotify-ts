import assert from 'node:assert/strict'
import { createServer, Server } from 'node:http'
import { once } from 'node:events'
import { AddressInfo } from 'node:net'
import {
  Album,
  Artist,
  EasySpotify,
  EasySpotifyConfig,
  SpotifyError,
  SpotifyUnsupportedEndpointError
} from '../src'

describe('Current Spotify API', () => {
  let spotify: EasySpotify
  let requests: {
    method?: string
    url?: string
    data?: unknown
    params?: unknown
  }[]
  let payload: unknown

  beforeEach(() => {
    spotify = new EasySpotify(new EasySpotifyConfig('token'))
    requests = []
    payload = { snapshot_id: 'snapshot' }
    spotify.httpClient.defaults.adapter = async config => {
      requests.push({
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params
      })
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: payload
      }
    }
  })

  it('uses Development Mode by default', () => {
    assert.equal(spotify.config.quotaMode, 'development')
    assert.equal(
      new EasySpotifyConfig('token', { quotaMode: 'extended' }).quotaMode,
      'extended'
    )
    assert.equal(
      new EasySpotifyConfig('token', 'https://example.com/v1').apiURL,
      'https://example.com/v1'
    )
  })

  const unavailable: [string, (client: EasySpotify) => Promise<unknown>][] = [
    ['top tracks', client => client.getArtistTopTracks('id')],
    ['related artists', client => client.getArtistRelatedArtists('id')],
    ['new releases', client => client.getBrowseNewReleases({})],
    ['featured playlists', client => client.getBrowseFeaturedPlaylists({})],
    ['categories', client => client.getBrowseListOfCategories({})],
    ['category', client => client.getBrowseCategory('id')],
    [
      'category playlists',
      client => client.getBrowseCategoryPlaylists('id', {})
    ],
    [
      'recommendations',
      client => client.getBrowseRecommendations({ seed_tracks: ['id'] })
    ],
    ['genre seeds', client => client.getBrowseRecommendationGenres()],
    ['other user playlists', client => client.getUserPlaylists('id')],
    ['other user profile', client => client.getUserProfile('id')],
    [
      'legacy playlist creation',
      client => client.createPlaylist('id', { name: 'Playlist' })
    ]
  ]
  for (const [name, call] of unavailable) {
    it(`rejects ${name} before HTTP in Development Mode`, async () => {
      await assert.rejects(call(spotify), SpotifyUnsupportedEndpointError)
      assert.equal(requests.length, 0)
    })
  }

  it('creates a playlist for the current user without a user ID', async () => {
    payload = { id: 'playlist', items: { items: [], total: 0 } }
    const result = await spotify.createPlaylist({
      name: 'Playlist',
      public: false
    })
    assert.equal(result.id, 'playlist')
    assert.equal(requests[0].url, 'https://api.spotify.com/v1/me/playlists')
    assert.equal(requests[0].method, 'post')
    assert.deepEqual(JSON.parse(requests[0].data as string), {
      name: 'Playlist',
      public: false
    })
  })

  it('gets the current profile with account_id and no removed fields', async () => {
    payload = { id: 'user', account_id: 'stable', display_name: null }
    const current = await spotify.getCurrentUserProfile()
    assert.equal(current.account_id, 'stable')
    assert.equal(current.followers, undefined)
    assert.deepEqual(await spotify.getUserProfile(), current)
    assert.ok(
      requests.every(request => request.url === 'https://api.spotify.com/v1/me')
    )
  })

  it('adds track and episode URIs using /items', async () => {
    const params = Object.freeze({
      uris: ['spotify:track:id', 'spotify:episode:id'],
      position: 0
    })
    assert.deepEqual(await spotify.addPlaylistItems('id', params), {
      snapshot_id: 'snapshot'
    })
    assert.equal(
      requests[0].url,
      'https://api.spotify.com/v1/playlists/id/items'
    )
    assert.deepEqual(JSON.parse(requests[0].data as string), params)
  })

  it('clears and reorders playlist items without requiring replacement URIs', async () => {
    await spotify.updatePlaylistItems('id', { uris: [] })
    await spotify.updatePlaylistItems('id', {
      range_start: 0,
      insert_before: 3,
      snapshot_id: 'snapshot'
    })
    assert.deepEqual(
      requests.map(request => JSON.parse(request.data as string)),
      [
        { uris: [] },
        { range_start: 0, insert_before: 3, snapshot_id: 'snapshot' }
      ]
    )
    assert.ok(requests.every(request => request.method === 'put'))
  })

  it('removes items and converts the deprecated URI-only alias', async () => {
    await spotify.removePlaylistItems('id', {
      items: [{ uri: 'spotify:episode:id' }],
      snapshot_id: 'snapshot'
    })
    await spotify.removeTracksFromPlaylist('id', {
      uris: ['spotify:episode:id'],
      snapshot_id: 'snapshot'
    })
    assert.deepEqual(requests[0], requests[1])
    assert.equal(requests[0].method, 'delete')
    assert.deepEqual(JSON.parse(requests[0].data as string), {
      items: [{ uri: 'spotify:episode:id' }],
      snapshot_id: 'snapshot'
    })
  })

  it('rejects invalid playlist operations without making HTTP calls', async () => {
    await assert.rejects(
      spotify.addPlaylistItems('id', { uris: [] }),
      RangeError
    )
    await assert.rejects(
      spotify.addPlaylistItems('id', { uris: Array(101).fill('uri') }),
      RangeError
    )
    await assert.rejects(
      spotify.addPlaylistItems('id', { uris: ['uri'], position: -1 }),
      RangeError
    )
    await assert.rejects(
      spotify.removePlaylistItems('id', {
        items: Array(101).fill({ uri: 'uri' })
      }),
      RangeError
    )
    await assert.rejects(
      spotify.updatePlaylistItems('id', { range_start: -1, insert_before: 0 }),
      RangeError
    )
    await assert.rejects(
      spotify.updatePlaylistItems('id', {
        range_start: 0,
        insert_before: 1,
        range_length: 0
      }),
      RangeError
    )
    await assert.rejects(spotify.replacePlaylistTracks('id', {}), RangeError)
    await assert.rejects(
      spotify.replacePlaylistTracks('id', {
        uris: ['uri'],
        range_start: 0,
        insert_before: 1
      }),
      TypeError
    )
    assert.equal(requests.length, 0)
  })

  it('preserves track, episode and null items, and supports page options', async () => {
    payload = {
      items: [
        { item: { type: 'track', id: 'track' } },
        { item: { type: 'episode', id: 'episode' } },
        { item: null }
      ],
      next: null,
      previous: null
    }
    const result = await spotify.getPlaylistItems('id', {
      limit: 50,
      offset: 5,
      market: 'BR',
      additional_types: 'episode'
    })
    assert.deepEqual(result, payload)
    assert.equal(
      requests[0].url,
      'https://api.spotify.com/v1/playlists/id/items'
    )
    assert.deepEqual(requests[0].params, {
      limit: 50,
      offset: 5,
      market: 'BR',
      additional_types: 'episode'
    })
    await assert.rejects(
      spotify.getPlaylistItems('id', { limit: 51 }),
      RangeError
    )
  })

  it('normalizes legacy playlist fields while preserving explicit null items', async () => {
    payload = {
      id: 'id',
      tracks: {
        items: [
          { track: { type: 'track', id: 'track' } },
          { track: null },
          { item: null, track: { id: 'must-not-be-used' } }
        ]
      }
    }
    const legacy = await spotify.getPlaylist('id')
    assert.equal(legacy.items?.items[0]?.item?.id, 'track')
    assert.equal(legacy.items?.items[1]?.item, null)
    assert.equal(legacy.items?.items[2]?.item, null)
    assert.equal((payload as { items?: unknown }).items, undefined)
    payload = { id: 'id', name: 'Metadata only' }
    assert.equal((await spotify.getPlaylist('id')).items, undefined)
  })

  it('supports field selections that omit page entries', async () => {
    payload = { total: 5 }
    assert.deepEqual(
      await spotify.getPlaylistItems('id', { fields: 'total' }),
      { total: 5 }
    )
  })

  it('passes through a valid 10-result search and optional response sections', async () => {
    payload = {
      tracks: { items: [{ album: { id: 'album' }, id: 'track' }], next: null }
    }
    const result = await spotify.search('music', {
      type: 'track',
      limit: 10,
      offset: 1000
    })
    assert.equal(result.albums, undefined)
    assert.equal(result.tracks?.items[0].album.id, 'album')
    assert.deepEqual(requests[0].params, {
      q: 'music',
      type: 'track',
      limit: 10,
      offset: 1000
    })
  })

  for (const limit of [-1, 11, 1.5, NaN]) {
    it(`rejects search limit ${limit} in every search helper`, async () => {
      for (const method of [
        'searchAlbums',
        'searchArtists',
        'searchTracks',
        'searchPlaylists'
      ] as const) {
        await assert.rejects(spotify[method]('music', { limit }), RangeError)
      }
      await assert.rejects(
        spotify.search('music', { type: 'track', limit }),
        RangeError
      )
      assert.equal(requests.length, 0)
    })
  }

  it('retains the larger search limit only in Extended Quota mode', async () => {
    spotify.config.quotaMode = 'extended'
    payload = { artists: { items: [] } }
    await spotify.searchArtists('music', { limit: 50 })
    await assert.rejects(
      spotify.searchArtists('music', { limit: 51 }),
      RangeError
    )
    await assert.rejects(
      spotify.searchArtists('music', { offset: 1001 }),
      RangeError
    )
    assert.equal(requests.length, 1)
  })

  it('sends library URIs in query parameters, including unfollowPlaylist', async () => {
    await spotify.saveLibraryItems(['spotify:track:id', 'spotify:album:id'])
    await spotify.removeLibraryItems(['spotify:playlist:id'])
    await spotify.unfollowPlaylist('id')
    assert.equal(requests[0].method, 'put')
    assert.deepEqual(requests[0].params, {
      uris: 'spotify:track:id,spotify:album:id'
    })
    assert.deepEqual(requests[1], requests[2])
    assert.ok(
      requests.every(
        request =>
          request.url === 'https://api.spotify.com/v1/me/library' &&
          request.data === undefined
      )
    )
    payload = [false, true]
    assert.deepEqual(
      await spotify.checkLibraryItems([
        'spotify:track:id',
        'spotify:artist:id'
      ]),
      [false, true]
    )
    assert.equal(
      requests[3].url,
      'https://api.spotify.com/v1/me/library/contains'
    )
  })

  it('validates the 40-URI library request limit', async () => {
    await assert.rejects(
      spotify.saveLibraryItems(Array(41).fill('uri')),
      RangeError
    )
    await assert.rejects(spotify.removeLibraryItems([]), RangeError)
    await assert.rejects(
      spotify.checkLibraryItems(Array(41).fill('uri')),
      RangeError
    )
    assert.equal(requests.length, 0)
  })

  it('exposes quota exhaustion and does not retry it', async () => {
    let calls = 0
    spotify.httpClient.defaults.adapter = async config => {
      calls += 1
      return {
        config,
        status: 429,
        statusText: '',
        headers: { 'retry-after': '0' },
        data: {
          error: { message: 'Too many requests', reason: 'QUOTA_EXCEEDED' }
        }
      }
    }
    await assert.rejects(
      spotify.getCurrentUserProfile(),
      error =>
        error instanceof SpotifyError &&
        error.status === 429 &&
        error.reason === 'QUOTA_EXCEEDED'
    )
    assert.equal(calls, 1)
  })

  for (const method of ['getAlbums', 'getArtists'] as const) {
    it(`${method} bounds concurrency and keeps input order and duplicates`, async () => {
      let active = 0
      let maximum = 0
      const pending: (() => void)[] = []
      spotify.httpClient.defaults.adapter = config =>
        new Promise(resolve => {
          active += 1
          maximum = Math.max(maximum, active)
          pending.push(() => {
            active -= 1
            resolve({
              config,
              status: 200,
              statusText: 'OK',
              headers: {},
              data: { id: config.url?.split('/').pop() }
            })
          })
        })
      const ids = ['a', 'b', 'c', 'd', 'a']
      const result = spotify[method](ids)
      while (pending.length > 0) {
        pending.pop()?.()
        await new Promise<void>(resolve => setImmediate(resolve))
      }
      assert.deepEqual(
        (await result).map(item => item.id),
        ids
      )
      assert.equal(maximum, 3)
      assert.deepEqual(await spotify[method]([]), [])
    })
  }

  it('keeps restored external IDs and allows absent legacy metadata', () => {
    const album = new Album({ external_ids: { upc: 'upc' }, total_tracks: 10 })
    assert.equal(album.external_ids.upc, 'upc')
    assert.equal(album.available_markets, undefined)
    assert.equal(album.total_tracks, 10)
    assert.equal(new Artist({}).followers, undefined)
  })
})

describe('Playlist migration over HTTP', () => {
  let server: Server

  afterEach(async () => {
    if (server)
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      )
  })

  it('sends the current routes, encoded queries, JSON bodies and authorization', async () => {
    const received: {
      method?: string
      pathname: string
      uris: string | null
      body: string
      authorization?: string
    }[] = []
    server = createServer(async (request, response) => {
      let body = ''
      for await (const chunk of request) body += chunk.toString()
      const url = new URL(request.url ?? '', 'http://127.0.0.1')
      received.push({
        method: request.method,
        pathname: url.pathname,
        uris: url.searchParams.get('uris'),
        body,
        authorization: request.headers.authorization
      })
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ snapshot_id: 'snapshot', id: 'created' }))
    })
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const port = (server.address() as AddressInfo).port
    const client = new EasySpotify(
      new EasySpotifyConfig('token', `http://127.0.0.1:${port}/v1`)
    )
    client.httpClient.defaults.proxy = false
    await client.createPlaylist({ name: 'Playlist' })
    await client.addPlaylistTracks('id', { uris: ['spotify:track:id'] })
    await client.removeTracksFromPlaylist('id', {
      uris: ['spotify:episode:id']
    })
    await client.unfollowPlaylist('id')
    assert.deepEqual(
      received.map(request => [request.method, request.pathname]),
      [
        ['POST', '/v1/me/playlists'],
        ['POST', '/v1/playlists/id/items'],
        ['DELETE', '/v1/playlists/id/items'],
        ['DELETE', '/v1/me/library']
      ]
    )
    assert.deepEqual(JSON.parse(received[2].body), {
      items: [{ uri: 'spotify:episode:id' }]
    })
    assert.equal(received[3].uris, 'spotify:playlist:id')
    assert.equal(received[3].body, '')
    assert.ok(
      received.every(request => request.authorization === 'Bearer token')
    )
  })
})

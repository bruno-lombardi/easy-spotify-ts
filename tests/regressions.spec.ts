import assert from 'node:assert/strict'
import { AxiosError, AxiosHeaders } from 'axios'
import { useFakeTimers } from 'sinon'
import {
  Album,
  Artist,
  EasySpotify,
  EasySpotifyConfig,
  SpotifyError
} from '../src'
import { handleResponse } from '../src/utils'

describe('Regression checks', () => {
  it('preserves album copyrights, restrictions and artist URI', () => {
    const copyrights = [{ text: 'Copyright', type: 'C' }]
    const restrictions = { reason: 'market' }
    const album = new Album({
      copyrights,
      restrictions,
      available_markets: ['BR']
    })
    assert.deepEqual(album.copyrights, copyrights)
    assert.deepEqual(album.restrictions, restrictions)
    assert.equal(
      new Artist({ uri: 'spotify:artist:123', type: 'artist' }).uri,
      'spotify:artist:123'
    )
  })

  it('serializes browse options without mutating the caller', async () => {
    const spotify = new EasySpotify(
      new EasySpotifyConfig('token', undefined, { quotaMode: 'extended' })
    )
    const requests: unknown[] = []
    spotify.httpClient.defaults.adapter = async config => {
      requests.push(config.params)
      return { config, status: 200, statusText: 'OK', headers: {}, data: {} }
    }
    const date = new Date('2026-01-01T00:00:00Z')
    const options = Object.freeze({ timestamp: date })
    const query = Object.freeze({ seed_artists: ['123'] })
    await spotify.getBrowseFeaturedPlaylists(options)
    await spotify.getBrowseRecommendations(query)
    await spotify.getBrowseRecommendations(query)
    assert.equal(options.timestamp, date)
    assert.deepEqual(query.seed_artists, ['123'])
    assert.deepEqual(requests, [
      { timestamp: date.toISOString() },
      { seed_artists: '123' },
      { seed_artists: '123' }
    ])
  })

  for (const rejected of [false, true]) {
    it(`retries a ${rejected ? 'rejected' : 'resolved'} 429 using seconds and preserves image headers`, async () => {
      const timer = useFakeTimers()
      try {
        const spotify = new EasySpotify(
          new EasySpotifyConfig('token', undefined, { quotaMode: 'extended' })
        )
        let calls = 0
        spotify.httpClient.defaults.adapter = async config => {
          calls += 1
          assert.equal(config.headers.get('Content-Type'), 'image/jpeg')
          assert.equal(config.data, 'base64')
          const response = {
            config,
            status: calls === 1 ? 429 : 202,
            statusText: '',
            headers: new AxiosHeaders({ 'retry-after': '1' }),
            data: {}
          }
          if (rejected && calls === 1) {
            throw new AxiosError(
              'Rate limited',
              'ERR_BAD_REQUEST',
              config,
              undefined,
              response
            )
          }
          return response
        }
        const request = spotify.uploadCustomPlaylistCoverImage('123', 'base64')
        await timer.tickAsync(999)
        assert.equal(calls, 1)
        await timer.tickAsync(1)
        await request
        assert.equal(calls, 2)
      } finally {
        timer.restore()
      }
    })
  }

  it('stops after two retries and returns a SpotifyError', async () => {
    const spotify = new EasySpotify(
      new EasySpotifyConfig('token', undefined, { quotaMode: 'extended' })
    )
    let calls = 0
    spotify.httpClient.defaults.adapter = async config => {
      calls += 1
      return {
        config,
        status: 429,
        statusText: '',
        headers: { 'retry-after': '0' },
        data: {}
      }
    }
    await assert.rejects(
      spotify.getUserProfile(),
      error => error instanceof SpotifyError && error.status === 429
    )
    assert.equal(calls, 3)
  })

  it('accepts all 2xx responses and handles non-JSON errors', () => {
    const config = { headers: new AxiosHeaders() }
    assert.equal(
      handleResponse({
        config,
        status: 206,
        statusText: '',
        headers: {},
        data: 'ok'
      }),
      'ok'
    )
    assert.throws(
      () =>
        handleResponse({
          config,
          status: 403,
          statusText: '',
          headers: {},
          data: 'Forbidden'
        }),
      error => error instanceof SpotifyError && error.status === 403
    )
  })
})

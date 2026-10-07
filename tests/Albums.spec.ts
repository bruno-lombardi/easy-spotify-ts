import assert from 'node:assert/strict'
import { SinonStub, stub } from 'sinon'
import 'mocha'
import { expect, use } from 'chai'
import sinonChai from 'sinon-chai'
import EasySpotify from '../src/EasySpotify'
import EasySpotifyConfig from '../src/EasySpotifyConfig'
import { Album, PagingTracks } from '../src/models'

use(sinonChai)
const baseHttpClientConfig = {
  headers: {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json'
  },
  method: 'GET'
}
describe('Albums', () => {
  let spotify: EasySpotify
  let httpClientStub: SinonStub

  beforeEach(() => {
    spotify = new EasySpotify(new EasySpotifyConfig('token'))
    httpClientStub = stub(spotify, 'httpClient')
  })

  afterEach(() => {
    httpClientStub.restore()
  })

  describe('getAlbum', () => {
    let id = '4aawyAB9vmqN3uQ7FjRGTy'

    beforeEach(() => {
      httpClientStub.resolves({
        data: { id, name: 'Cyndi Lauper' },
        status: 200
      })
    })

    it('should call httpClient with correct config', async () => {
      await spotify.getAlbum(id, { market: 'ES' })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { market: 'ES' },
        url: 'https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy'
      })
    })

    it('should get an album if valid id', async () => {
      const album: Album = await spotify.getAlbum(id)
      expect(album).to.be.instanceOf(Album)
      expect(album.id).to.eq(id)
      expect(album.name).to.not.be.empty
    })

    it('should not get a album if invalid id', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      id = 'invalidId'
      await assert.rejects(async () => spotify.getAlbum(id))
    })
  })

  describe('getAlbums', () => {
    let ids: string[] = [
      '41MnTivkwTO3UUJ8DrqEJJ',
      '6JWc4iAiJ9FjyK0B59ABb4',
      '6UXCm6bOO4gFlDQZV5yL37'
    ]

    beforeEach(() => {
      httpClientStub.callsFake(async (request: { url: string }) => ({
        data: { id: request.url.split('/').pop(), name: 'Album' },
        status: 200
      }))
    })

    it('should call httpClient with correct config', async () => {
      await spotify.getAlbums(ids, { market: 'ES' })
      for (const id of ids) {
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { market: 'ES' },
          url: `https://api.spotify.com/v1/albums/${id}`
        })
      }
      assert.equal(httpClientStub.callCount, ids.length)
    })

    it('should get albums if valid ids', async () => {
      const albums: Album[] = await spotify.getAlbums(ids)
      expect(albums.length).to.eql(3)
      expect(albums[0].id).to.eql(ids[0])
      expect(albums[2].id).to.eql(ids[2])
    })

    it('should throw error if invalid ids', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      ids = ['invalid', 'id']
      await assert.rejects(async () => spotify.getAlbums(ids))
    })
  })

  describe('getAlbumTracks', () => {
    let id = '4aawyAB9vmqN3uQ7FjRGTy'

    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          href: 'https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks?offset=0&limit=3',
          items: [
            { id: '41MnTivkwTO3UUJ8DrqEJJ', name: 'Cyndi Lauper' },
            { id: '6JWc4iAiJ9FjyK0B59ABb4', name: 'Rock is Good' },
            { id: '6UXCm6bOO4gFlDQZV5yL37', name: 'Just a Fake Name' }
          ]
        },
        status: 200
      })
    })

    it('should call httpClient method with correct config', async () => {
      await spotify.getAlbumTracks('4aawyAB9vmqN3uQ7FjRGTy', {
        limit: 3,
        offset: 0
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { limit: 3, offset: 0 },
        url: 'https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks'
      })
    })

    it('should get tracks for valid album', async () => {
      const tracks: PagingTracks = await spotify.getAlbumTracks(
        '4aawyAB9vmqN3uQ7FjRGTy',
        { offset: 0, limit: 3 }
      )
      expect(tracks.items.length).to.eq(3)
      expect(tracks.items[0].id).to.eq('41MnTivkwTO3UUJ8DrqEJJ')
      expect(tracks.items[1].name).to.exist
    })

    it('should not get tracks for invalid album', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      id = 'invalid'
      await assert.rejects(async () => spotify.getAlbumTracks(id))
    })
  })
})

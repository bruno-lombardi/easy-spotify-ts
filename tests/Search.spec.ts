import { SinonStub, stub } from 'sinon'
import 'mocha'
import { expect, use } from 'chai'
import sinonChai = require('sinon-chai')
import EasySpotify from '../src/EasySpotify'
import EasySpotifyConfig from '../src/EasySpotifyConfig'
import {
  PagingAlbums,
  PagingArtists,
  PagingPlaylists,
  PagingSearch,
  PagingTracks
} from '../src/models'

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

  describe('searchAlbums', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          albums: {
            items: [
              {
                album_type: 'album',
                id: '6YkkoAG1rnLqET8SgT6ngp'
              },
              {
                album_type: 'album',
                id: '1ZH5g1RDq3GY1OvyD0w0s2'
              }
            ],
            total: 40000
          }
        },
        status: 200
      })
    })

    it('should call httpClient method with correct settings', async () => {
      await spotify.searchAlbums('Rock', {
        limit: 2
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { limit: 2, type: 'album', q: 'Rock' },
        url: 'https://api.spotify.com/v1/search'
      })
    })

    it('should get albums for valid search', async () => {
      const albums: PagingAlbums = await spotify.searchAlbums('Rock', {
        limit: 2
      })
      expect(albums.items).to.not.be.empty
      expect(albums.items[0].id).to.eq('6YkkoAG1rnLqET8SgT6ngp')
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.searchAlbums('Rock', {
          limit: 2
        })
      ).to.throw
    })
  })

  describe('searchArtists', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          artists: {
            items: [
              {
                name: 'Elvis Presley',
                type: 'artist',
                uri: 'spotify:artist:43ZHCT0cAZBISjO8DG9PnE'
              },
              {
                name: 'Edi Rock',
                type: 'artist',
                uri: 'spotify:artist:2fYAyTS2erZgqEHKHYqgi2'
              }
            ],
            offset: 2,
            total: 4442
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.searchArtists('Elvis', {
        limit: 2
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { type: 'artist', limit: 2, q: 'Elvis' },
        url: 'https://api.spotify.com/v1/search'
      })
    })

    it('should get artists for valid search', async () => {
      const artists: PagingArtists = await spotify.searchArtists('Elvis', {
        limit: 2
      })
      expect(artists.items).to.not.be.empty
      expect(artists.items[0].name).to.eq('Elvis Presley')
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.searchArtists('invalid_search')).to.throw
    })
  })

  describe('searchPlaylists', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          playlists: {
            items: [
              {
                id: '37i9dQZF1DX3D78h6FPBPC',
                name: 'This Is ABBA'
              },
              {
                id: '3AGOiaoRXMSjswCLtuNqv5',
                name: 'ABBA Best Of'
              }
            ],
            limit: 2,
            offset: 0,
            total: 21654
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.searchPlaylists('abba', { limit: 2, market: 'US' })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { type: 'playlist', limit: 2, q: 'abba', market: 'US' },
        url: 'https://api.spotify.com/v1/search'
      })
    })

    it('should get playlists for valid search', async () => {
      const playlists: PagingPlaylists = await spotify.searchPlaylists('abba', {
        limit: 2,
        market: 'US'
      })
      expect(playlists.items).to.not.be.empty
      expect(playlists.limit).to.eq(2)
      expect(playlists.items.length).to.eq(2)
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.searchPlaylists('abba')).to.throw
    })
  })

  describe('searchTracks', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          tracks: {
            items: [
              {
                id: '4HpiwfnQvs867JNWeLy1vr',
                name: 'Todos Os Cantos (Ao Vivo)'
              },
              {
                id: '0aUGXSCmdJz9I9kdY9e9kk',
                name: 'Love a Queima Roupa - Ao Vivo'
              }
            ],
            limit: 2,
            offset: 0,
            total: 21654
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.searchTracks('love', {
        limit: 2
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { type: 'track', limit: 2, q: 'love' },
        url: 'https://api.spotify.com/v1/search'
      })
    })

    it('should get playlists for valid search', async () => {
      const tracks: PagingTracks = await spotify.searchTracks('love', {
        limit: 2
      })
      expect(tracks.items).to.not.be.empty
      expect(tracks.limit).to.eq(2)
      expect(tracks.items.length).to.eq(2)
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.searchTracks('abba')).to.throw
    })
  })

  describe('search', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          artists: { total: 0, items: [] },
          playlists: {
            items: [
              {
                id: '37i9dQZF1DX50QitC6Oqtn',
                name: 'Love Pop'
              }
            ],
            total: 1
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.search('love', {
        type: 'artist,playlist',
        limit: 2
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { type: 'artist,playlist', q: 'love', limit: 2 },
        url: 'https://api.spotify.com/v1/search'
      })
    })

    it('should get response with valid search', async () => {
      const response: PagingSearch = await spotify.search('love', {
        type: 'artist,playlist',
        limit: 2
      })
      expect(response.artists).to.exist
      expect(response.playlists).to.exist
      expect(response.playlists.items).to.not.be.empty
      expect(response.playlists.items[0].id).to.eq('37i9dQZF1DX50QitC6Oqtn')
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.search('abba', { type: 'artist' })).to.throw
    })
  })
})

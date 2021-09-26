import { SinonStub, stub } from 'sinon'
import 'mocha'
import { expect, use } from 'chai'
import sinonChai = require('sinon-chai')
import EasySpotify from '../src/EasySpotify'
import EasySpotifyConfig from '../src/EasySpotifyConfig'

use(sinonChai)
const baseHttpClientConfig = {
  headers: {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json'
  },
  method: 'GET'
}
describe('Playlists', () => {
  let spotify: EasySpotify
  let httpClientStub: SinonStub

  beforeEach(() => {
    spotify = new EasySpotify(new EasySpotifyConfig('token'))
    httpClientStub = stub(spotify, 'httpClient')
  })

  afterEach(() => {
    httpClientStub.restore()
  })

  describe('getCurrentUserPlaylists', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          href: 'https://api.spotify.com/v1/users/wizzler/playlists',
          items: [
            {
              collaborative: false,
              external_urls: {
                spotify:
                  'http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c'
              },
              href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c',
              id: '53Y8wT46QIMz5H4WQ8O22c',
              images: [],
              name: 'Wizzlers Big Playlist',
              owner: {
                external_urls: {
                  spotify: 'http://open.spotify.com/user/wizzler'
                },
                href: 'https://api.spotify.com/v1/users/wizzler',
                id: 'wizzler',
                type: 'user',
                uri: 'spotify:user:wizzler'
              },
              public: true,
              snapshot_id:
                'bNLWdmhh+HDsbHzhckXeDC0uyKyg4FjPI/KEsKjAE526usnz2LxwgyBoMShVL+z+',
              tracks: {
                href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks',
                total: 30
              },
              type: 'playlist',
              uri: 'spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c'
            },
            {
              collaborative: false,
              external_urls: {
                spotify:
                  'http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju'
              },
              href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju',
              id: '1AVZz0mBuGbCEoNRQdYQju',
              images: [],
              name: 'Another Playlist',
              owner: {
                external_urls: {
                  spotify: 'http://open.spotify.com/user/wizzlersmate'
                },
                href: 'https://api.spotify.com/v1/users/wizzlersmate',
                id: 'wizzlersmate',
                type: 'user',
                uri: 'spotify:user:wizzlersmate'
              },
              public: true,
              snapshot_id:
                'Y0qg/IT5T02DKpw4uQKc/9RUrqQJ07hbTKyEeDRPOo9LU0g0icBrIXwVkHfQZ/aD',
              tracks: {
                href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks',
                total: 58
              },
              type: 'playlist',
              uri: 'spotify:user:wizzlersmate:playlist:1AVZz0mBuGbCEoNRQdYQju'
            }
          ],
          limit: 9,
          next: null,
          offset: 0,
          previous: null,
          total: 9
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getCurrentUserPlaylists({
        limit: 9,
        offset: 0
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { limit: 9, offset: 0 },
        url: 'https://api.spotify.com/v1/me/playlists'
      })
    })

    it('should get playlists', async () => {
      const playlists = await spotify.getCurrentUserPlaylists({
        limit: 9,
        offset: 0
      })
      expect(playlists).to.not.be.empty
      expect(playlists.items).to.eql([
        {
          collaborative: false,
          external_urls: {
            spotify:
              'http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c'
          },
          href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c',
          id: '53Y8wT46QIMz5H4WQ8O22c',
          images: [],
          name: 'Wizzlers Big Playlist',
          owner: {
            external_urls: {
              spotify: 'http://open.spotify.com/user/wizzler'
            },
            href: 'https://api.spotify.com/v1/users/wizzler',
            id: 'wizzler',
            type: 'user',
            uri: 'spotify:user:wizzler'
          },
          public: true,
          snapshot_id:
            'bNLWdmhh+HDsbHzhckXeDC0uyKyg4FjPI/KEsKjAE526usnz2LxwgyBoMShVL+z+',
          tracks: {
            href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks',
            total: 30
          },
          type: 'playlist',
          uri: 'spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c'
        },
        {
          collaborative: false,
          external_urls: {
            spotify:
              'http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju'
          },
          href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju',
          id: '1AVZz0mBuGbCEoNRQdYQju',
          images: [],
          name: 'Another Playlist',
          owner: {
            external_urls: {
              spotify: 'http://open.spotify.com/user/wizzlersmate'
            },
            href: 'https://api.spotify.com/v1/users/wizzlersmate',
            id: 'wizzlersmate',
            type: 'user',
            uri: 'spotify:user:wizzlersmate'
          },
          public: true,
          snapshot_id:
            'Y0qg/IT5T02DKpw4uQKc/9RUrqQJ07hbTKyEeDRPOo9LU0g0icBrIXwVkHfQZ/aD',
          tracks: {
            href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks',
            total: 58
          },
          type: 'playlist',
          uri: 'spotify:user:wizzlersmate:playlist:1AVZz0mBuGbCEoNRQdYQju'
        }
      ])
      expect(playlists.limit).to.eq(9)
      expect(playlists.offset).to.eq(0)
      expect(playlists.total).to.eq(9)
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.getCurrentUserPlaylists({
          limit: 9,
          offset: 0
        })
      ).to.throw
    })
  })
  describe('getUserPlaylists', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists',
          items: [
            {
              collaborative: false,
              external_urls: {
                spotify:
                  'http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c'
              },
              href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c',
              id: '53Y8wT46QIMz5H4WQ8O22c',
              images: [],
              name: 'Wizzlers Big Playlist',
              owner: {
                external_urls: {
                  spotify: 'http://open.spotify.com/user/wizzler'
                },
                href: 'https://api.spotify.com/v1/users/wizzler',
                id: 'wizzler',
                type: 'user',
                uri: 'spotify:user:wizzler'
              },
              public: true,
              snapshot_id:
                'bNLWdmhh+HDsbHzhckXeDC0uyKyg4FjPI/KEsKjAE526usnz2LxwgyBoMShVL+z+',
              tracks: {
                href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks',
                total: 30
              },
              type: 'playlist',
              uri: 'spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c'
            },
            {
              collaborative: false,
              external_urls: {
                spotify:
                  'http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju'
              },
              href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju',
              id: '1AVZz0mBuGbCEoNRQdYQju',
              images: [],
              name: 'Another Playlist',
              owner: {
                external_urls: {
                  spotify: 'http://open.spotify.com/user/wizzlersmate'
                },
                href: 'https://api.spotify.com/v1/users/wizzlersmate',
                id: 'wizzlersmate',
                type: 'user',
                uri: 'spotify:user:wizzlersmate'
              },
              public: true,
              snapshot_id:
                'Y0qg/IT5T02DKpw4uQKc/9RUrqQJ07hbTKyEeDRPOo9LU0g0icBrIXwVkHfQZ/aD',
              tracks: {
                href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks',
                total: 58
              },
              type: 'playlist',
              uri: 'spotify:user:wizzlersmate:playlist:1AVZz0mBuGbCEoNRQdYQju'
            }
          ],
          limit: 9,
          next: null,
          offset: 0,
          previous: null,
          total: 9
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getUserPlaylists('wizzlersmate', {
        limit: 9,
        offset: 0
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { limit: 9, offset: 0 },
        url: 'https://api.spotify.com/v1/users/wizzlersmate/playlists'
      })
    })

    it('should get playlists', async () => {
      const playlists = await spotify.getUserPlaylists('wizzlersmate', {
        limit: 9,
        offset: 0
      })
      expect(playlists).to.not.be.empty
      expect(playlists.items).to.eql([
        {
          collaborative: false,
          external_urls: {
            spotify:
              'http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c'
          },
          href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c',
          id: '53Y8wT46QIMz5H4WQ8O22c',
          images: [],
          name: 'Wizzlers Big Playlist',
          owner: {
            external_urls: {
              spotify: 'http://open.spotify.com/user/wizzler'
            },
            href: 'https://api.spotify.com/v1/users/wizzler',
            id: 'wizzler',
            type: 'user',
            uri: 'spotify:user:wizzler'
          },
          public: true,
          snapshot_id:
            'bNLWdmhh+HDsbHzhckXeDC0uyKyg4FjPI/KEsKjAE526usnz2LxwgyBoMShVL+z+',
          tracks: {
            href: 'https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks',
            total: 30
          },
          type: 'playlist',
          uri: 'spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c'
        },
        {
          collaborative: false,
          external_urls: {
            spotify:
              'http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju'
          },
          href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju',
          id: '1AVZz0mBuGbCEoNRQdYQju',
          images: [],
          name: 'Another Playlist',
          owner: {
            external_urls: {
              spotify: 'http://open.spotify.com/user/wizzlersmate'
            },
            href: 'https://api.spotify.com/v1/users/wizzlersmate',
            id: 'wizzlersmate',
            type: 'user',
            uri: 'spotify:user:wizzlersmate'
          },
          public: true,
          snapshot_id:
            'Y0qg/IT5T02DKpw4uQKc/9RUrqQJ07hbTKyEeDRPOo9LU0g0icBrIXwVkHfQZ/aD',
          tracks: {
            href: 'https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks',
            total: 58
          },
          type: 'playlist',
          uri: 'spotify:user:wizzlersmate:playlist:1AVZz0mBuGbCEoNRQdYQju'
        }
      ])
      expect(playlists.limit).to.eq(9)
      expect(playlists.offset).to.eq(0)
      expect(playlists.total).to.eq(9)
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.getUserPlaylists('wizzlersmate', {
          limit: 9,
          offset: 0
        })
      ).to.throw
    })
  })

  describe('createPlaylist', () => {
    beforeEach(() => {
      httpClientStub.resolves({ data: 'response', status: 200 })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.createPlaylist('wizzlersmate', {
        name: 'Playlist',
        description: 'Desc',
        collaborative: false,
        public: true
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'POST',
        data: {
          collaborative: false,
          description: 'Desc',
          name: 'Playlist',
          public: true
        },
        url: 'https://api.spotify.com/v1/users/wizzlersmate/playlists'
      })
    })

    it('should create playlist', async () => {
      const playlist = await spotify.createPlaylist('wizzlersmate', {
        name: 'Playlist',
        description: 'Desc',
        collaborative: false,
        public: true
      })
      expect(playlist).to.eql('response')
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.createPlaylist('wizzlersmate', {
          name: 'Playlist',
          description: 'Desc',
          collaborative: false,
          public: true
        })
      ).to.throw
    })
  })
  describe('getPlaylist', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: { id: '59ZbFPES4DQwEjBpWHzrtC' },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getPlaylist('59ZbFPES4DQwEjBpWHzrtC')
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'GET',
        url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC'
      })
    })

    it('should create playlist', async () => {
      const playlist = await spotify.getPlaylist('59ZbFPES4DQwEjBpWHzrtC')
      expect(playlist).to.eql({ id: '59ZbFPES4DQwEjBpWHzrtC' })
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.getPlaylist('59ZbFPES4DQwEjBpWHzrtC')).to.throw
    })
  })

  describe('updatePlaylistDetails', () => {
    beforeEach(() => {
      httpClientStub.resolves({ status: 200 })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.updatePlaylistDetails('playlistid', {
        name: 'New Playlist',
        description: 'New Desc',
        collaborative: true,
        public: false
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'PUT',
        data: {
          collaborative: true,
          description: 'New Desc',
          name: 'New Playlist',
          public: false
        },
        url: 'https://api.spotify.com/v1/playlists/playlistid'
      })
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.updatePlaylistDetails('playlistid', {
          name: 'New Playlist',
          description: 'New Desc',
          collaborative: true,
          public: false
        })
      ).to.throw
    })
  })

  describe('addPlaylistTracks', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        status: 200,
        data: {
          snapshot_id:
            'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
        }
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.addPlaylistTracks('playlistid', { uris: ['uri1', 'url2'] })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'POST',
        data: { uris: ['uri1', 'url2'] },
        url: 'https://api.spotify.com/v1/playlists/playlistid/tracks'
      })
    })
    it('should call httpClient with position when passing position', async () => {
      await spotify.addPlaylistTracks('playlistid', {
        uris: ['uri1', 'url2'],
        position: 2
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'POST',
        data: { uris: ['uri1', 'url2'], position: 2 },
        url: 'https://api.spotify.com/v1/playlists/playlistid/tracks'
      })
    })

    it('should return snapshot id when success', async () => {
      const response = await spotify.addPlaylistTracks('playlistid', {
        uris: ['uri1', 'url2']
      })
      expect(response).to.not.be.undefined
      expect(response.snapshot_id).to.eql(
        'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
      )
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.addPlaylistTracks('playlistid', { uris: ['uri1', 'url2'] })
      ).to.throw
    })
  })

  describe('replacePlaylistTracks', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        status: 200,
        data: {
          snapshot_id:
            'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
        }
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.replacePlaylistTracks('playlistid', {
        uris: ['uri1', 'url2']
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'PUT',
        data: { uris: ['uri1', 'url2'] },
        url: 'https://api.spotify.com/v1/playlists/playlistid/tracks'
      })
    })

    it('should call httpClient with range params', async () => {
      await spotify.replacePlaylistTracks('playlistid', {
        uris: ['uri1', 'url2'],
        insert_before: 2,
        range_length: 2,
        range_start: 0
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'PUT',
        data: {
          uris: ['uri1', 'url2'],
          insert_before: 2,
          range_length: 2,
          range_start: 0
        },
        url: 'https://api.spotify.com/v1/playlists/playlistid/tracks'
      })
    })

    it('should return snapshot id when success', async () => {
      const response = await spotify.replacePlaylistTracks('playlistid', {
        uris: ['uri1', 'url2']
      })
      expect(response).to.not.be.undefined
      expect(response.snapshot_id).to.eql(
        'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
      )
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.replacePlaylistTracks('playlistid', { uris: ['uri1', 'url2'] })
      ).to.throw
    })
  })
  describe('removeTracksFromPlaylist', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        status: 200,
        data: {
          snapshot_id:
            'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
        }
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.removeTracksFromPlaylist('playlistid', {
        uris: ['uri1', 'url2']
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'DELETE',
        data: { tracks: [{ uri: 'uri1' }, { uri: 'url2' }] },
        url: 'https://api.spotify.com/v1/playlists/playlistid/tracks'
      })
    })

    it('should call httpClient with snapshot id', async () => {
      await spotify.removeTracksFromPlaylist('playlistid', {
        uris: ['uri1', 'url2'],
        snapshot_id: 'snapshot_id'
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'DELETE',
        data: {
          tracks: [{ uri: 'uri1' }, { uri: 'url2' }],
          snapshot_id: 'snapshot_id'
        },
        url: 'https://api.spotify.com/v1/playlists/playlistid/tracks'
      })
    })

    it('should return snapshot id when success', async () => {
      const response = await spotify.removeTracksFromPlaylist('playlistid', {
        uris: ['uri1', 'url2']
      })
      expect(response).to.not.be.undefined
      expect(response.snapshot_id).to.eql(
        'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
      )
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.removeTracksFromPlaylist('playlistid', {
          uris: ['uri1', 'url2']
        })
      ).to.throw
    })
  })
  describe('uploadCustomPlaylistCoverImage', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        status: 202
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.uploadCustomPlaylistCoverImage('playlistid', 'base64')
      expect(httpClientStub).to.have.been.calledWith({
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'image/jpeg'
        },
        method: 'PUT',
        data: 'base64',
        url: 'https://api.spotify.com/v1/playlists/playlistid/images'
      })
    })

    it('should not throw when success and status is 202', async () => {
      expect(() =>
        spotify.uploadCustomPlaylistCoverImage('playlistid', 'base64')
      ).not.to.throw
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.uploadCustomPlaylistCoverImage('playlistid', 'base64')
      ).to.throw
    })
  })

  describe('unfollowPlaylist', () => {
    beforeEach(() => {
      httpClientStub.resolves({ status: 200 })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.unfollowPlaylist('playlistid')
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        method: 'DELETE',
        url: 'https://api.spotify.com/v1/playlists/playlistid/followers'
      })
    })

    it('should throw error when error', async () => {
      httpClientStub.resolves({
        status: 400,
        data: { error: { status: 400, message: 'error' } }
      })
      expect(() => spotify.unfollowPlaylist('playlistid')).to.throw
    })
  })
})

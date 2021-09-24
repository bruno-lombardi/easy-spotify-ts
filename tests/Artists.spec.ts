import { SinonStub, stub } from 'sinon'
import 'mocha'
import { expect, use } from 'chai'
import sinonChai = require('sinon-chai')
import EasySpotify from '../src/EasySpotify'
import EasySpotifyConfig from '../src/EasySpotifyConfig'
import { Artist, PagingAlbums, Track } from '../src/models'

use(sinonChai)
const baseHttpClientConfig = {
  headers: {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json'
  },
  method: 'GET'
}
describe('Artists', () => {
  let spotify: EasySpotify
  let httpClientStub: SinonStub

  beforeEach(() => {
    spotify = new EasySpotify(new EasySpotifyConfig('token'))
    httpClientStub = stub(spotify, 'httpClient')
  })

  afterEach(() => {
    httpClientStub.restore()
  })

  describe('getArtist', () => {
    let id = '4aawyAB9vmqN3uQ7FjRGTy'

    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          id: '0OdUWJ0sBjDrqHygGUXeCF',
          name: 'Band of Horses',
          popularity: 100
        },
        status: 200
      })
    })

    it('should call httpClient method with correct config', async () => {
      await spotify.getArtist('0OdUWJ0sBjDrqHygGUXeCF')
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF'
      })
    })

    it('should get an artist for valid id', async () => {
      const artist: Artist = await spotify.getArtist('0OdUWJ0sBjDrqHygGUXeCF')
      expect(artist.id).to.eq('0OdUWJ0sBjDrqHygGUXeCF')
      expect(artist.popularity).to.eq(100)
      expect(artist.name).to.exist
    })

    it('should not get artist if invalid id', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      id = 'invalid'
      expect(() => spotify.getArtist(id)).to.throw
    })
  })

  describe('getArtists', () => {
    let ids = [
      '0OdUWJ0sBjDrqHygGUXeCF',
      '3dBVyJ7JuOMt4GE9607Qin',
      '0oSGxfWSnnOXhD2fKuz2Gy'
    ]

    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          artists: [
            {
              id: '0OdUWJ0sBjDrqHygGUXeCF',
              name: 'Band of Horses',
              popularity: 14
            },
            {
              id: '3dBVyJ7JuOMt4GE9607Qin',
              name: 'T. Rex',
              popularity: 62
            },
            {
              id: '0oSGxfWSnnOXhD2fKuz2Gy',
              name: 'David Bowie',
              popularity: 82
            }
          ]
        },
        status: 200
      })
    })

    it('should call httpClient with correct config', async () => {
      await spotify.getArtists(ids)
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          ids: '0OdUWJ0sBjDrqHygGUXeCF,3dBVyJ7JuOMt4GE9607Qin,0oSGxfWSnnOXhD2fKuz2Gy'
        },
        url: 'https://api.spotify.com/v1/artists'
      })
    })

    it('should get artists if valid ids', async () => {
      const artists: Artist[] = await spotify.getArtists(ids)
      expect(artists).to.not.be.empty
      expect(artists.length).to.eq(3)
      expect(artists[0].id).to.eq('0OdUWJ0sBjDrqHygGUXeCF')
      expect(artists[2].name).to.exist
    })

    it('should not get artists if invalid ids', async () => {
      ids = ['invalid', 'id']
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.getArtists(ids)).to.throw
    })
  })

  describe('getArtistAlbums', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          href: 'https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6/albums?offset=0&limit=3market=ES&include_groups=appears_on',
          items: [
            {
              id: '43977e0YlJeMXG77uCCSMX',
              name: 'Shut Up Lets Dance (Vol. II)',
              album_group: 'appears_on'
            },
            {
              id: '189ngoT3WxR5mZSYkAGOLF',
              name: 'Classic Club Monsters',
              album_group: 'appears_on'
            }
          ]
        },
        status: 200
      })
    })

    it('should call httpClient method with correct settings', async () => {
      await spotify.getArtistAlbums('4aawyAB9vmqN3uQ7FjRGTy', {
        include_groups: 'appears_on',
        limit: 3,
        offset: 0,
        market: 'ES'
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          include_groups: 'appears_on',
          limit: 3,
          market: 'ES',
          offset: 0
        },
        url: 'https://api.spotify.com/v1/artists/4aawyAB9vmqN3uQ7FjRGTy/albums'
      })
    })

    it('should get albums for artist if valid id', async () => {
      const artistAlbums: PagingAlbums = await spotify.getArtistAlbums(
        '4aawyAB9vmqN3uQ7FjRGTy',
        { include_groups: 'appears_on', limit: 3, offset: 0, market: 'ES' }
      )
      expect(artistAlbums).to.not.be.empty
      expect(artistAlbums.items.length).to.eq(2)
      expect(artistAlbums.items[0].id).to.eq('43977e0YlJeMXG77uCCSMX')
      expect(artistAlbums.href).to.exist
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.getArtistAlbums('invalid_id')).to.throw
    })
  })

  describe('getArtistTopTracks', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          tracks: [
            {
              id: '44AyOl4qVkzS48vBsbNXaC',
              name: "Can't Help Falling in Love",
              uri: 'spotify:track:44AyOl4qVkzS48vBsbNXaC'
            },
            {
              id: '44AyOl4qVkzS48vBsbNXaC',
              name: "Can't Help Falling in Love",
              uri: 'spotify:track:44AyOl4qVkzS48vBsbNXaC'
            }
          ]
        },
        status: 200
      })
    })

    it('should call httpClient method with correct settings', async () => {
      await spotify.getArtistTopTracks('4aawyAB9vmqN3uQ7FjRGTy', {
        market: 'ES'
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { market: 'ES' },
        url: 'https://api.spotify.com/v1/artists/4aawyAB9vmqN3uQ7FjRGTy/top-tracks'
      })
    })

    it('should get albums for artist if valid id', async () => {
      const artistTopTracks: Track[] = await spotify.getArtistTopTracks(
        '4aawyAB9vmqN3uQ7FjRGTy',
        { market: 'ES' }
      )
      expect(artistTopTracks).to.not.be.empty
      expect(artistTopTracks.length).to.eq(2)
      expect(artistTopTracks[0].id).to.eq('44AyOl4qVkzS48vBsbNXaC')
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.getArtistTopTracks('invalid_id')).to.throw
    })
  })

  describe('getArtistRelatedArtists', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          artists: [
            {
              external_urls: {
                spotify:
                  'https://open.spotify.com/artist/5ZKMPRDHc7qElVJFh3uRqB'
              },
              followers: {
                href: null,
                total: 18108
              },
              genres: ['rockabilly'],
              href: 'https://api.spotify.com/v1/artists/5ZKMPRDHc7qElVJFh3uRqB',
              id: '5ZKMPRDHc7qElVJFh3uRqB'
            },
            {
              external_urls: {
                spotify:
                  'https://open.spotify.com/artist/5ZKMPRDHc7qElVJFh3uRqB'
              },
              followers: {
                href: null,
                total: 18108
              },
              genres: ['rockabilly'],
              href: 'https://api.spotify.com/v1/artists/5ZKMPRDHc7qElVJFh3uRqB',
              id: '5ZKMPRDHc7qElVJFh3uRqB'
            }
          ]
        },
        status: 200
      })
    })

    it('should call httpClient method with correct settings', async () => {
      await spotify.getArtistRelatedArtists('43ZHCT0cAZBISjO8DG9PnE')
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        url: 'https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/related-artists'
      })
    })

    it('should get related artists if valid id', async () => {
      const artists: Artist[] = await spotify.getArtistRelatedArtists(
        '43ZHCT0cAZBISjO8DG9PnE'
      )
      expect(artists).to.not.be.empty
      expect(artists.length).to.eq(2)
      expect(artists[0].id).to.eq('5ZKMPRDHc7qElVJFh3uRqB')
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.getArtistRelatedArtists('invalid_id')).to.throw
    })
  })
})

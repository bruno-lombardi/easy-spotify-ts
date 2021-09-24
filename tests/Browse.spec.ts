import { SinonStub, stub } from 'sinon'
import 'mocha'
import { expect, use } from 'chai'
import sinonChai = require('sinon-chai')
import EasySpotify from '../src/EasySpotify'
import EasySpotifyConfig from '../src/EasySpotifyConfig'
import {
  Category,
  FeaturedAlbums,
  FeaturedPlaylists,
  PagingCategories,
  PagingPlaylists
} from '../src/models'

use(sinonChai)
const baseHttpClientConfig = {
  headers: {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json'
  },
  method: 'GET'
}
describe('Browse', () => {
  let spotify: EasySpotify
  let httpClientStub: SinonStub

  beforeEach(() => {
    spotify = new EasySpotify(new EasySpotifyConfig('token'))
    httpClientStub = stub(spotify, 'httpClient')
  })

  afterEach(() => {
    httpClientStub.restore()
  })

  describe('getBrowseCategory', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          href: 'https://api.spotify.com/v1/browse/categories/party',
          icons: [
            {
              height: 274,
              url: 'https://datsnxq1rwndn.cloudfront.net/media/derived/party-274x274_73d1907a7371c3bb96a288390a96ee27_0_0_274_274.jpg',
              width: 274
            }
          ],
          id: 'party',
          name: 'Party'
        },
        status: 200
      })
    })

    it('should get response with a category', async () => {
      const category: Category = await spotify.getBrowseCategory('party', {
        country: 'US'
      })
      expect(category.href).to.exist
      expect(category.icons).to.exist
      expect(category.icons).to.not.be.empty
      expect(category.icons[0].height).to.eq(274)
      expect(category.id).to.exist
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getBrowseCategory('party', {
        country: 'BR'
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { country: 'BR' },
        url: 'https://api.spotify.com/v1/browse/categories/party'
      })
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.getBrowseCategory('party', {
          country: 'US'
        })
      ).to.throw
    })
  })

  describe('getBrowseCategoryPlaylists', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          playlists: {
            items: [
              {
                id: '37i9dQZF1DX8mBRYewE6or',
                name: 'Sexta'
              },
              {
                id: '3AGOiaoRXMSjswCLtuNqv5',
                name: 'Segue o Baile'
              }
            ],
            limit: 20,
            offset: 0,
            total: 21654
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getBrowseCategoryPlaylists('party', {
        country: 'BR',
        limit: 20
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { country: 'BR', limit: 20 },
        url: 'https://api.spotify.com/v1/browse/categories/party/playlists'
      })
    })

    it('should get response with playlists', async () => {
      const playlists: PagingPlaylists =
        await spotify.getBrowseCategoryPlaylists('party', {
          country: 'BR',
          limit: 20
        })
      expect(playlists.items).to.exist
      expect(playlists.items).to.not.be.empty
      expect(playlists.limit).to.eq(20)
      expect(playlists.total).to.exist
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.getBrowseCategoryPlaylists('party', {
          country: 'BR',
          limit: 20
        })
      ).to.throw
    })
  })

  describe('getBrowseListOfCategories', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          categories: {
            href: 'https://api.spotify.com/v1/browse/categories?offset=0&limit=20',
            items: [
              {
                id: 'toplists',
                name: 'Top Lists'
              },
              {
                id: 'mood',
                name: 'Mood'
              }
            ],
            limit: 10,
            offset: 0,
            total: 31
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getBrowseListOfCategories({ offset: 0, limit: 10 })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { offset: 0, limit: 10 },
        url: 'https://api.spotify.com/v1/browse/categories'
      })
    })

    it('should get list of categories', async () => {
      const categories: PagingCategories =
        await spotify.getBrowseListOfCategories({ offset: 0, limit: 10 })
      expect(categories.items).to.exist
      expect(categories.items).to.not.be.empty
      expect(categories.total).to.exist
      expect(categories.limit).to.exist
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.getBrowseListOfCategories({ offset: 0, limit: 10 }))
        .to.throw
    })
  })

  describe('getBrowseFeaturedPlaylists', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          message: 'Monday morning music, coming right up!',
          playlists: {
            items: [
              {
                description:
                  'Relaxed deep house to slowly help you get back on your feet and ready yourself for a productive week.',
                id: '6ftJBzU2LLQcaKefMi7ee7',
                name: 'Monday Morning Mood'
              },
              {
                description:
                  'Du kommer studsa ur sängen med den här spellistan.',
                id: '4uOEx4OUrkoGNZoIlWMUbO',
                name: 'Upp och hoppa!'
              }
            ],
            limit: 5,
            offset: 1,
            total: 20
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getBrowseFeaturedPlaylists({
        offset: 0,
        limit: 10
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          offset: 0,
          limit: 10
        },
        url: 'https://api.spotify.com/v1/browse/featured-playlists'
      })
    })

    it('should call httpClient with timestamp in ISO format if it is passed', async () => {
      await spotify.getBrowseFeaturedPlaylists({
        offset: 0,
        limit: 10,
        timestamp: new Date('2020-01-01')
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          offset: 0,
          limit: 10,
          timestamp: '2020-01-01T00:00:00.000Z'
        },
        url: 'https://api.spotify.com/v1/browse/featured-playlists'
      })
    })

    it('should get featured playlists', async () => {
      const featured: FeaturedPlaylists =
        await spotify.getBrowseFeaturedPlaylists({
          offset: 0,
          limit: 10,
          timestamp: new Date('2020-01-01')
        })
      expect(featured.message).to.exist
      expect(featured.playlists.items).to.not.be.empty
      expect(featured.playlists.items[0].id).to.exist
      expect(featured.playlists.total).to.exist
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.getBrowseFeaturedPlaylists({
          offset: 0,
          limit: 10,
          timestamp: new Date('2020-01-01')
        })
      ).to.throw
    })
  })

  describe('getBrowseNewReleases', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          message: 'Some cool message here',
          albums: {
            items: [
              {
                id: '5ZX4m5aVSmWQ5iHAPQpT71',
                name: "Runnin'"
              },
              {
                id: '0geTzdk2InlqIoB16fW9Nd',
                name: 'Sneakin'
              }
            ],
            limit: 10,
            offset: 0,
            total: 300
          }
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getBrowseNewReleases({
        offset: 0,
        limit: 10
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: { offset: 0, limit: 10 },
        url: 'https://api.spotify.com/v1/browse/new-releases'
      })
    })

    it('should get albums', async () => {
      const featured: FeaturedAlbums = await spotify.getBrowseNewReleases({
        offset: 0,
        limit: 10
      })
      expect(featured.message).to.exist
      expect(featured.albums.items).to.not.be.empty
      expect(featured.albums.limit).to.exist
      expect(featured.albums.offset).to.exist
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.getBrowseNewReleases({
          offset: 0,
          limit: 10
        })
      ).to.throw
    })
  })

  describe('getBrowseRecommendations', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          tracks: [
            {
              id: '1TKYPzH66GwsqyJFKFkBHQ',
              is_playable: true,
              name: 'Music Is Life'
            },
            {
              id: '15iosIuxC3C53BgsM5Uggs',
              is_playable: true,
              name: 'All Night'
            }
          ],
          seeds: [
            {
              initialPoolSize: 500,
              afterFilteringSize: 380,
              afterRelinkingSize: 365,
              id: '4NHQUGzhtTLFvgF5SZesLK'
            }
          ]
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getBrowseRecommendations({
        target_loudness: 0.2
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          target_loudness: 0.2
        },
        url: 'https://api.spotify.com/v1/recommendations'
      })
    })
    it('should call httpClient with seed_artists', async () => {
      await spotify.getBrowseRecommendations({
        seed_artists: ['4NHQUGzhtTLFvgF5SZesLK']
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          seed_artists: '4NHQUGzhtTLFvgF5SZesLK'
        },
        url: 'https://api.spotify.com/v1/recommendations'
      })
    })

    it('should call httpClient with seed_genres', async () => {
      await spotify.getBrowseRecommendations({
        seed_genres: ['4NHQUGzhtTLFvgF5SZesLK']
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          seed_genres: '4NHQUGzhtTLFvgF5SZesLK'
        },
        url: 'https://api.spotify.com/v1/recommendations'
      })
    })
    it('should call httpClient with seed_tracks', async () => {
      await spotify.getBrowseRecommendations({
        seed_tracks: ['4NHQUGzhtTLFvgF5SZesLK']
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          seed_tracks: '4NHQUGzhtTLFvgF5SZesLK'
        },
        url: 'https://api.spotify.com/v1/recommendations'
      })
    })
    it('should call httpClient with seeds', async () => {
      await spotify.getBrowseRecommendations({
        seed_tracks: ['4NHQUGzhtTLFvgF5SZesLK'],
        seed_artists: ['seed1', 'seed2'],
        seed_genres: ['seed1', 'seed2']
      })
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        params: {
          seed_tracks: '4NHQUGzhtTLFvgF5SZesLK',
          seed_artists: 'seed1,seed2',
          seed_genres: 'seed1,seed2'
        },
        url: 'https://api.spotify.com/v1/recommendations'
      })
    })

    it('should get recomendations', async () => {
      const recommendations = await spotify.getBrowseRecommendations({
        seed_tracks: ['4NHQUGzhtTLFvgF5SZesLK', '1VBflYyxBhnDc9uVib98rw'],
        target_loudness: 0.2
      })
      expect(recommendations.seeds).to.not.be.empty
      expect(recommendations.tracks).to.not.be.empty
      expect(recommendations.tracks.length).to.eq(2)
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() =>
        spotify.getBrowseRecommendations({
          seed_tracks: ['4NHQUGzhtTLFvgF5SZesLK', '1VBflYyxBhnDc9uVib98rw'],
          target_loudness: 0.2
        })
      ).to.throw
    })
  })

  describe('getBrowseRecommendationGenres', () => {
    beforeEach(() => {
      httpClientStub.resolves({
        data: {
          genres: ['bluegrass', 'country']
        },
        status: 200
      })
    })

    it('should call httpClient with correct settings', async () => {
      await spotify.getBrowseRecommendationGenres()
      expect(httpClientStub).to.have.been.calledWith({
        ...baseHttpClientConfig,
        url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds'
      })
    })

    it('should get recomendations genres', async () => {
      const recommendations = await spotify.getBrowseRecommendationGenres()
      expect(recommendations).to.not.be.empty
      expect(recommendations[0]).to.eq('bluegrass')
      expect(recommendations[1]).to.eq('country')
    })

    it('should throw err if response fails', async () => {
      httpClientStub.rejects({ response: { status: 400 } })
      expect(() => spotify.getBrowseRecommendationGenres()).to.throw
    })
  })
})

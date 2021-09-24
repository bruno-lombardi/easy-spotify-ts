import { expect, use } from 'chai'
import 'mocha'
import { SinonStub, stub } from 'sinon'
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

describe('EasySpotify', () => {
  let spotify: EasySpotify
  let httpClientStub: SinonStub

  beforeEach(() => {
    spotify = new EasySpotify(new EasySpotifyConfig('token'))
    httpClientStub = stub(spotify, 'httpClient')
  })

  afterEach(() => {
    httpClientStub.restore()
  })

  it('should pass smoke test', () => {
    expect(spotify.getAlbum).to.exist
    expect(spotify.getAlbums).to.exist
    expect(spotify.getAlbumTracks).to.exist

    expect(spotify.getArtist).to.exist
    expect(spotify.getArtists).to.exist
    expect(spotify.getArtistTopTracks).to.exist
    expect(spotify.getArtistRelatedArtists).to.exist
    expect(spotify.getArtistAlbums).to.exist

    expect(spotify.searchAlbums).to.exist
    expect(spotify.searchArtists).to.exist
    expect(spotify.searchPlaylists).to.exist
    expect(spotify.searchTracks).to.exist

    expect(spotify.getBrowseCategory).to.exist
    expect(spotify.getBrowseCategoryPlaylists).to.exist
    expect(spotify.getBrowseListOfCategories).to.exist
    expect(spotify.getBrowseFeaturedPlaylists).to.exist
    expect(spotify.getBrowseNewReleases).to.exist
    expect(spotify.getBrowseRecommendationGenres).to.exist

    expect(spotify.getCurrentUserPlaylists).to.exist
    expect(spotify.getUserPlaylists).to.exist
    expect(spotify.createPlaylist).to.exist
    expect(spotify.updatePlaylistDetails).to.exist
    expect(spotify.addPlaylistTracks).to.exist
    expect(spotify.replacePlaylistTracks).to.exist
    expect(spotify.unfollowPlaylist).to.exist

    expect(spotify.getUserProfile).to.exist
  })

  it('should create an instance of EasySpotify', () => {
    expect(spotify).to.be.instanceof(EasySpotify)
    expect(spotify.config.token).to.not.be.empty
    expect(spotify.config.apiURL).to.not.be.empty
  })

  it('should not set token if empty', () => {
    expect(() => spotify.setToken('')).to.throw('Cannot set an empty token')
  })

  it('should not set apiURL if empty', () => {
    expect(() => spotify.setApiUrl('')).to.throw('Cannot set an empty API Url')
  })

  it('should correctly set the token', () => {
    spotify.setToken('new token')
    expect(spotify.getToken()).to.eq('new token')
  })

  it('should correctly set the Api Url', () => {
    // TODO: Add validation to check it"s a valid URL
    spotify.setApiUrl('new apiURL')
    expect(spotify.getApiUrl()).to.eq('new apiURL')
  })

  describe('Methods', () => {
    describe('getUserProfile', () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            country: 'SE',
            display_name: 'JM Wizzler',
            email: 'email@example.com',
            external_urls: {
              spotify: 'https://open.spotify.com/user/wizzler'
            },
            followers: {
              href: null,
              total: 3829
            },
            href: 'https://api.spotify.com/v1/users/wizzler',
            id: 'wizzler',
            images: [
              {
                height: null,
                url: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/t1.0-1/1970403_10152215092574354_1798272330_n.jpg',
                width: null
              }
            ],
            product: 'premium',
            type: 'user',
            uri: 'spotify:user:wizzler'
          },
          status: 200
        })
      })

      it('should call httpClient with correct settings', async () => {
        await spotify.getUserProfile('wizzler')
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          method: 'GET',
          url: 'https://api.spotify.com/v1/users/wizzler'
        })
      })

      it('should throw error when error', async () => {
        httpClientStub.resolves({
          status: 400,
          data: { error: { status: 400, message: 'error' } }
        })
        expect(() => spotify.getUserProfile('playlistid')).to.throw
      })

      it('should return user profile when success', async () => {
        const profile = await spotify.getUserProfile('wizzler')
        expect(profile).to.not.be.undefined
        expect(profile.id).to.eql('wizzler')
      })
    })
  })
})

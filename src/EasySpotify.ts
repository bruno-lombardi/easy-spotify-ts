import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method
} from 'axios'
import EasySpotifyConfig from './EasySpotifyConfig'
import {
  Album,
  Artist,
  FeaturedAlbums,
  FeaturedPlaylists,
  PagingAlbums,
  PagingArtists,
  PagingCategories,
  PagingPlaylists,
  PagingSearch,
  PagingTracks,
  Recommendations,
  RecommendationsQuery,
  SimplifiedPlaylist,
  Track,
  User
} from './models'
import { GetAlbumOptions } from './models/Album'
import { GetArtistAlbumsOptions } from './models/Artist'
import { PagingRequestParams } from './models/Paging'
import { CreatePlaylistParams, UpdatePlaylistParams } from './models/Playlist'
import { OptionalRequestParams, SearchRequestParams } from './models/Request'
import { handleResponse } from './utils'

export default class EasySpotify {
  public config: EasySpotifyConfig

  public httpClient: AxiosInstance

  constructor(config: EasySpotifyConfig) {
    this.config = config
    this.httpClient = axios.create({
      validateStatus: status => status < 500
    })
  }

  public setToken(token: string): void {
    if (token.trim() === '') {
      throw new Error('Cannot set an empty token')
    }
    this.config.token = token
  }

  public setApiUrl(apiURL: string): void {
    if (apiURL.trim() === '') {
      throw new Error('Cannot set an empty API Url')
    }
    this.config.apiURL = apiURL
  }

  public getToken(): string {
    return this.config.token
  }

  public getApiUrl(): string {
    return this.config.apiURL
  }

  public async getAlbum(id: string, options?: GetAlbumOptions): Promise<Album> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `albums/${id}`,
      options
    )
    const data = handleResponse(response)
    return new Album(data)
  }

  public async getAlbums(
    ids: string[],
    options?: GetAlbumOptions
  ): Promise<Album[]> {
    const response: AxiosResponse<any> = await this.buildRequest('albums', {
      ids: `${ids}`,
      ...options
    })
    const data = handleResponse(response)
    return data.albums.map((album: any) => new Album(album))
  }

  public async getAlbumTracks(
    id: string,
    options?: OptionalRequestParams
  ): Promise<PagingTracks> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `albums/${id}/tracks`,
      options
    )
    return handleResponse(response)
  }

  public async getArtist(id: string): Promise<Artist> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}`
    )
    const data = handleResponse(response)
    return new Artist(data)
  }

  public async getArtists(ids: string[]): Promise<Artist[]> {
    const response: AxiosResponse<any> = await this.buildRequest('artists', {
      ids: `${ids}`
    })
    const data = handleResponse(response)
    return data.artists.map((artist: any) => new Artist(artist))
  }

  public async getArtistAlbums(
    id: string,
    options?: GetArtistAlbumsOptions
  ): Promise<PagingAlbums> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}/albums`,
      options
    )
    return handleResponse(response)
  }

  public async getArtistTopTracks(
    id: string,
    options?: GetAlbumOptions
  ): Promise<Track[]> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}/top-tracks`,
      options
    )
    const data = handleResponse(response)
    return data.tracks.map((track: any) => new Track(track))
  }

  public async getArtistRelatedArtists(id: string): Promise<Artist[]> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}/related-artists`
    )
    const data = handleResponse(response)
    return data.artists.map((artist: any) => new Artist(artist))
  }

  public async searchAlbums(
    query: string,
    options?: OptionalRequestParams
  ): Promise<PagingAlbums> {
    const params = {
      ...options,
      q: query,
      type: 'album'
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'search',
      params
    )
    const data = handleResponse(response)
    return data.albums
  }

  public async searchArtists(
    query: string,
    options?: OptionalRequestParams
  ): Promise<PagingArtists> {
    const params = {
      ...options,
      q: query,
      type: 'artist'
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'search',
      params
    )
    const data = handleResponse(response)
    return data.artists
  }

  public async searchPlaylists(
    query: string,
    options?: OptionalRequestParams
  ): Promise<PagingPlaylists> {
    const params = {
      ...options,
      q: query,
      type: 'playlist'
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'search',
      params
    )
    const data = handleResponse(response)
    return data.playlists
  }

  public async searchTracks(
    query: string,
    options?: OptionalRequestParams
  ): Promise<PagingTracks> {
    const params = {
      ...options,
      q: query,
      type: 'track'
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'search',
      params
    )
    const data = handleResponse(response)
    return data.tracks
  }

  public async search(
    query: string,
    options: SearchRequestParams
  ): Promise<PagingSearch> {
    const response: AxiosResponse<any> = await this.buildRequest('search', {
      ...options,
      q: query
    })
    return handleResponse(response)
  }

  public async getBrowseCategory(
    id: string,
    options?: { country?: string; locale?: string }
  ) {
    const response: AxiosResponse<any> = await this.buildRequest(
      `browse/categories/${id}`,
      options
    )
    return handleResponse(response)
  }

  public async getBrowseCategoryPlaylists(
    id: string,
    options: { country?: string } & PagingRequestParams
  ): Promise<PagingPlaylists> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `browse/categories/${id}/playlists`,
      options
    )
    const data = handleResponse(response)
    return data.playlists
  }

  public async getBrowseListOfCategories(
    options: { locale?: string; country?: string } & PagingRequestParams
  ): Promise<PagingCategories> {
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/categories',
      options
    )
    const data = handleResponse(response)
    return data.categories
  }

  public async getBrowseFeaturedPlaylists(
    options: {
      locale?: string
      country?: string
      timestamp?: Date
    } & PagingRequestParams
  ): Promise<FeaturedPlaylists> {
    if (options.timestamp) {
      Object.assign(options, { timestamp: options.timestamp.toISOString() })
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/featured-playlists',
      options
    )
    return handleResponse(response)
  }

  public async getBrowseNewReleases(
    options: { country?: string } & PagingRequestParams
  ): Promise<FeaturedAlbums> {
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/new-releases',
      options
    )
    return handleResponse(response)
  }

  public async getBrowseRecommendations(
    query: RecommendationsQuery
  ): Promise<Recommendations> {
    if (query.seed_artists && query.seed_artists.length) {
      Object.assign(query, {
        seed_artists: query.seed_artists.join(',')
      })
    }
    if (query.seed_genres && query.seed_genres.length) {
      Object.assign(query, {
        seed_genres: query.seed_genres.join(',')
      })
    }
    if (query.seed_tracks && query.seed_tracks.length) {
      Object.assign(query, {
        seed_tracks: query.seed_tracks.join(',')
      })
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'recommendations',
      query
    )
    return handleResponse(response)
  }

  public async getPlaylists(
    userId?: string,
    options?: PagingRequestParams
  ): Promise<PagingPlaylists> {
    const endpoint = userId ? `users/${userId}/playlists` : 'me/playlists'
    const response: AxiosResponse<any> = await this.buildRequest(
      endpoint,
      options
    )
    return handleResponse(response)
  }

  public async createPlaylist(
    userId: string,
    params: CreatePlaylistParams
  ): Promise<SimplifiedPlaylist> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `users/${userId}/playlists`,
      params,
      'POST'
    )
    return handleResponse(response)
  }

  public async updatePlaylistDetails(
    playlistId: string,
    params: UpdatePlaylistParams
  ): Promise<void> {
    const response = await this.buildRequest(
      `playlists/${playlistId}`,
      params,
      'PUT'
    )
    return handleResponse(response)
  }

  public async addPlaylistTracks(
    playlistId: string,
    uris: string[]
  ): Promise<void> {
    const response = await this.buildRequest(
      `playlists/${playlistId}/tracks`,
      { uris },
      'POST'
    )
    return handleResponse(response)
  }

  public async replacePlaylistTracks(
    playlistId: string,
    uris: string[]
  ): Promise<void> {
    const response = await this.buildRequest(
      `playlists/${playlistId}/tracks`,
      { uris },
      'PUT'
    )
    return handleResponse(response)
  }

  public async unfollowPlaylist(playlistId: string): Promise<void> {
    const response = await this.buildRequest(
      `playlists/${playlistId}/followers`,
      undefined,
      'DELETE'
    )
    return handleResponse(response)
  }

  public async getUserProfile(userId?: string): Promise<User> {
    const endpoint = userId ? `users/${userId}` : 'me'
    const response = await this.buildRequest(endpoint)
    return handleResponse(response)
  }

  public buildRequest(
    endpoint: string,
    params?: AxiosRequestConfig['params'],
    method: Method = 'GET'
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        const payloadKey = ['PUT', 'POST', 'PATCH'].some(m => m === method)
          ? 'data'
          : 'params'

        this.httpClient({
          headers: this.buildHeaders(),
          method,
          [payloadKey]: params,
          url: `${this.getApiUrl()}/${endpoint}`
        }).then(resolve, e => {
          const retryAfter = e.response?.headers
            ? e.response?.headers['retry-after']
            : null
          if (retryAfter) {
            setTimeout(() => {
              this.buildRequest(endpoint, params, method).then(resolve, reject)
            }, (retryAfter + 1) * 1000)
          } else {
            reject(e)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  private buildHeaders(): Record<string, any> {
    return {
      Authorization: `Bearer ${this.config.token}`,
      'Content-Type': 'application/json'
    }
  }
}

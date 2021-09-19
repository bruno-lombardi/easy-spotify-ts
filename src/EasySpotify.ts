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
  Category,
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

export default class EasySpotify {
  public config: EasySpotifyConfig

  public httpClient: AxiosInstance

  constructor(config: EasySpotifyConfig) {
    this.config = config
    this.httpClient = axios
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
    if (response.data) {
      return new Album(response.data)
    }
    throw new Error('Could not find any album with that id')
  }

  public async getAlbums(
    ids: string[],
    options?: GetAlbumOptions
  ): Promise<Album[]> {
    const response: AxiosResponse<any> = await this.buildRequest('albums', {
      ids: `${ids}`,
      ...options
    })
    if (response.data.albums) {
      const albums: Album[] = response.data.albums.map(
        (album: any) => new Album(album)
      )
      return albums
    }
    throw new Error('Could not find any albums with provided ids')
  }

  public async getAlbumTracks(
    id: string,
    options?: OptionalRequestParams
  ): Promise<PagingTracks> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `albums/${id}/tracks`,
      options
    )
    if (response.data) {
      return response.data
    }
    throw new Error('Could not find any tracks for provided id')
  }

  public async getArtist(id: string): Promise<Artist> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}`
    )
    if (response.data) {
      return response.data
    }
    throw new Error('Could not find any artist for provided id')
  }

  public async getArtists(ids: string[]): Promise<Artist[]> {
    const response: AxiosResponse<any> = await this.buildRequest('artists', {
      ids: `${ids}`
    })
    if (response.data.artists) {
      const artists: Artist[] = response.data.artists.map(
        (artist: any) => new Artist(artist)
      )
      return artists
    }
    throw new Error('No artists found')
  }

  public async getArtistAlbums(
    id: string,
    options?: GetArtistAlbumsOptions
  ): Promise<PagingAlbums> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}/albums`,
      options
    )
    if (response.data) {
      return response.data
    }
    throw new Error('Could not find any tracks for provided id')
  }

  public async getArtistTopTracks(
    id: string,
    options?: GetAlbumOptions
  ): Promise<Track[]> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}/top-tracks`,
      options
    )
    if (response.data.tracks) {
      const tracks: Track[] = response.data.tracks.map(
        (track: any) => new Track(track)
      )
      return tracks
    }
    throw new Error('Could not find any tracks for provided id')
  }

  public async getArtistRelatedArtists(id: string): Promise<Artist[]> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}/related-artists`
    )
    if (response.data.artists) {
      const artists: Artist[] = response.data.artists.map(
        (artist: any) => new Artist(artist)
      )
      return artists
    }
    throw new Error('Could not find related artists for provided id')
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
    if (response.data.albums) {
      return response.data.albums
    }
    throw new Error('Could not find any albums for this query')
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
    if (response.data.artists) {
      return response.data.artists
    }
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
    if (response.data.playlists) {
      return response.data.playlists
    }
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
    if (response.data.tracks) {
      return response.data.tracks
    }
  }

  public async search(
    query: string,
    options: SearchRequestParams
  ): Promise<PagingSearch> {
    const response: AxiosResponse<any> = await this.buildRequest('search', {
      ...options,
      q: query
    })
    if (response.data) {
      return response.data
    }
  }

  public async getBrowseCategory(
    id: string,
    options?: { country?: string; locale?: string }
  ) {
    const response: AxiosResponse<any> = await this.buildRequest(
      `browse/categories/${id}`,
      options
    )
    if (response.data) {
      return new Category(response.data)
    }
    throw new Error('Could not find any category with that id')
  }

  public async getBrowseCategoryPlaylists(
    id: string,
    options: { country?: string } & PagingRequestParams
  ): Promise<PagingPlaylists> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `browse/categories/${id}/playlists`,
      options
    )
    if (response.data) {
      return response.data.playlists
    }
    throw new Error('Could not find any playlist from that category id')
  }

  public async getBrowseListOfCategories(
    options: { locale?: string; country?: string } & PagingRequestParams
  ): Promise<PagingCategories> {
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/categories',
      options
    )
    if (response.data) {
      return response.data.categories
    }
    throw new Error('Could not get any categories')
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
    if (response.data) {
      return response.data
    }
    throw new Error('Could not get any featured playlists')
  }

  public async getBrowseNewReleases(
    options: { country?: string } & PagingRequestParams
  ): Promise<FeaturedAlbums> {
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/new-releases',
      options
    )
    if (response.data) {
      return response.data
    }
    throw new Error('Could not get any albums')
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
    if (response.data) {
      return response.data
    }
    throw new Error('Could not get any recommendations')
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
    if (response.data) {
      return response.data
    }
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
    if (response.data) {
      return response.data
    }
  }

  public async updatePlaylistDetails(
    playlistId: string,
    params: UpdatePlaylistParams
  ): Promise<void> {
    await this.buildRequest(`playlists/${playlistId}`, params, 'PUT')
  }

  public async addPlaylistTracks(
    playlistId: string,
    uris: string[]
  ): Promise<void> {
    await this.buildRequest(`playlists/${playlistId}/tracks`, { uris }, 'POST')
  }

  public async replacePlaylistTracks(
    playlistId: string,
    uris: string[]
  ): Promise<void> {
    await this.buildRequest(`playlists/${playlistId}/tracks`, { uris }, 'PUT')
  }

  public async unfollowPlaylist(playlistId: string): Promise<void> {
    await this.buildRequest(
      `playlists/${playlistId}/followers`,
      undefined,
      'DELETE'
    )
  }

  public async getUserProfile(userId?: string): Promise<User> {
    const endpoint = userId ? `users/${userId}` : 'me'
    const response: AxiosResponse<any> = await this.buildRequest(endpoint)
    if (response.data) {
      return response.data
    }
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

  private buildHeaders(): any {
    return {
      Authorization: `Bearer ${this.config.token}`,
      'Content-Type': 'application/json'
    }
  }
}

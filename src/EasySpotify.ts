import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method
} from 'axios'
import EasySpotifyConfig from './EasySpotifyConfig'
import { PlaylistSync } from './PlaylistSync'
import { SpotifyUnsupportedEndpointError } from './SpotifyError'
import {
  Album,
  Artist,
  Category,
  FeaturedAlbums,
  FeaturedPlaylists,
  Image,
  PagingAlbums,
  PagingArtists,
  PagingCategories,
  PagingPlaylists,
  PagingSearch,
  PagingTracks,
  Recommendations,
  RecommendationsQuery,
  Track,
  User
} from './models'
import { GetAlbumOptions } from './models/Album'
import { GetArtistAlbumsOptions } from './models/Artist'
import { PagingRequestParams } from './models/Paging'
import { PagingFullTracks } from './models/Paging'
import {
  AddPlaylistTracksParams,
  CreatePlaylistParams,
  Playlist,
  RemovePlaylistTracksParams,
  ReplacePlaylistTracksParams,
  UpdatePlaylistParams
} from './models/Playlist'
import {
  AddPlaylistItemsParams,
  UpdatePlaylistItemsParams,
  RemovePlaylistItemsParams,
  GetPlaylistOptions,
  GetPlaylistItemsOptions,
  PagingPlaylistItems
} from './models/Playlist'
import { OptionalRequestParams, SearchRequestParams } from './models/Request'
import Snapshot from './models/Snapshot'
import { handleResponse } from './utils'

export default class EasySpotify {
  public readonly playlists = new PlaylistSync(this)

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
    return this.getMany(ids, id => this.getAlbum(id, options))
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
    return this.getMany(ids, id => this.getArtist(id))
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

  /** @deprecated Unavailable in Development Mode; no replacement. */
  public async getArtistTopTracks(
    id: string,
    options?: GetAlbumOptions
  ): Promise<Track[]> {
    this.requireExtended('artists/{id}/top-tracks')
    const response: AxiosResponse<any> = await this.buildRequest(
      `artists/${id}/top-tracks`,
      options
    )
    const data = handleResponse(response)
    return data.tracks.map((track: any) => new Track(track))
  }

  /** @deprecated Requires an app with legacy related-artists access. */
  public async getArtistRelatedArtists(id: string): Promise<Artist[]> {
    this.requireExtended('artists/{id}/related-artists')
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
    this.validateSearchOptions(options)
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
    this.validateSearchOptions(options)
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
    this.validateSearchOptions(options)
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
  ): Promise<PagingFullTracks> {
    this.validateSearchOptions(options)
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
    this.validateSearchOptions(options)
    const response: AxiosResponse<any> = await this.buildRequest('search', {
      ...options,
      q: query
    })
    return handleResponse(response)
  }

  /** @deprecated Unavailable in Development Mode; no replacement. */
  public async getBrowseNewReleases(
    options: { country?: string } & PagingRequestParams
  ): Promise<FeaturedAlbums> {
    this.requireExtended('browse/new-releases')
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/new-releases',
      options
    )
    return handleResponse(response)
  }

  /** @deprecated Requires an app with legacy featured-playlists access. */
  public async getBrowseFeaturedPlaylists(
    options: {
      locale?: string
      country?: string
      timestamp?: Date
    } & PagingRequestParams
  ): Promise<FeaturedPlaylists> {
    this.requireExtended('browse/featured-playlists')
    const params = {
      ...options,
      ...(options.timestamp && { timestamp: options.timestamp.toISOString() })
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/featured-playlists',
      params
    )
    return handleResponse(response)
  }

  /** @deprecated Unavailable in Development Mode; no replacement. */
  public async getBrowseListOfCategories(
    options: { locale?: string; country?: string } & PagingRequestParams
  ): Promise<PagingCategories> {
    this.requireExtended('browse/categories')
    const response: AxiosResponse<any> = await this.buildRequest(
      'browse/categories',
      options
    )
    const data = handleResponse(response)
    return data.categories
  }

  /** @deprecated Unavailable in Development Mode; no replacement. */
  public async getBrowseCategory(
    id: string,
    options?: { country?: string; locale?: string }
  ): Promise<Category> {
    this.requireExtended('browse/categories/{id}')
    const response: AxiosResponse<any> = await this.buildRequest(
      `browse/categories/${id}`,
      options
    )
    return handleResponse(response)
  }

  /** @deprecated Requires an app with legacy category-playlists access. */
  public async getBrowseCategoryPlaylists(
    id: string,
    options: { country?: string } & PagingRequestParams
  ): Promise<PagingPlaylists> {
    this.requireExtended('browse/categories/{id}/playlists')
    const response: AxiosResponse<any> = await this.buildRequest(
      `browse/categories/${id}/playlists`,
      options
    )
    const data = handleResponse(response)
    return data.playlists
  }

  /** @deprecated Requires an app with legacy recommendations access. */
  public async getBrowseRecommendations(
    query: RecommendationsQuery
  ): Promise<Recommendations> {
    this.requireExtended('recommendations')
    const params: Record<string, any> = { ...query }
    for (const key of ['seed_artists', 'seed_genres', 'seed_tracks'] as const) {
      if (query[key]?.length) {
        params[key] = query[key].join(',')
      }
    }
    const response: AxiosResponse<any> = await this.buildRequest(
      'recommendations',
      params
    )
    return handleResponse(response)
  }

  /** @deprecated Requires an app with legacy recommendation-genres access. */
  public async getBrowseRecommendationGenres(): Promise<string[]> {
    this.requireExtended('recommendations/available-genre-seeds')
    const response: AxiosResponse<any> = await this.buildRequest(
      'recommendations/available-genre-seeds'
    )
    const data = handleResponse(response)
    return data.genres
  }

  public async getCurrentUserPlaylists(
    options?: PagingRequestParams
  ): Promise<PagingPlaylists> {
    const response: AxiosResponse<any> = await this.buildRequest(
      'me/playlists',
      options
    )
    return handleResponse(response)
  }

  /** @deprecated In Development Mode use getCurrentUserPlaylists(). */
  public async getUserPlaylists(
    userId: string,
    options?: PagingRequestParams
  ): Promise<PagingPlaylists> {
    this.requireExtended('users/{id}/playlists')
    const response: AxiosResponse<any> = await this.buildRequest(
      `users/${userId}/playlists`,
      options
    )
    return handleResponse(response)
  }

  public async createPlaylist(params: CreatePlaylistParams): Promise<Playlist>
  /** @deprecated Use createPlaylist(params). This overload requires Extended Quota. */
  public async createPlaylist(
    userId: string,
    params: CreatePlaylistParams
  ): Promise<Playlist>
  public async createPlaylist(
    paramsOrUserId: CreatePlaylistParams | string,
    legacyParams?: CreatePlaylistParams
  ): Promise<Playlist> {
    const legacy = typeof paramsOrUserId === 'string'
    if (legacy)
      this.requireExtended('users/{id}/playlists (use createPlaylist(params))')
    const params = legacy ? legacyParams : paramsOrUserId
    if (!params) throw new TypeError('Playlist parameters are required')
    const response: AxiosResponse<any> = await this.buildRequest(
      legacy ? `users/${paramsOrUserId}/playlists` : 'me/playlists',
      params,
      'POST'
    )
    return this.normalizePlaylist(handleResponse(response))
  }

  public async getPlaylist(
    playlistId: string,
    options?: GetPlaylistOptions
  ): Promise<Playlist> {
    const response: AxiosResponse<any> = await this.buildRequest(
      `playlists/${playlistId}`,
      options
    )
    return this.normalizePlaylist(handleResponse(response))
  }

  public async getPlaylistItems(
    playlistId: string,
    options?: GetPlaylistItemsOptions
  ): Promise<PagingPlaylistItems> {
    if (options?.limit !== undefined)
      this.validateInteger(options.limit, 'limit', 1, 50)
    if (options?.offset !== undefined)
      this.validateInteger(options.offset, 'offset', 0)
    const response = await this.buildRequest(
      `playlists/${playlistId}/items`,
      options
    )
    return this.normalizePlaylistItems(handleResponse(response))
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

  /** @deprecated Use addPlaylistItems(); this alias uses the current /items endpoint. */
  public async addPlaylistTracks(
    playlistId: string,
    params: AddPlaylistTracksParams
  ): Promise<Snapshot> {
    return this.addPlaylistItems(playlistId, params)
  }

  public async addPlaylistItems(
    playlistId: string,
    params: AddPlaylistItemsParams
  ): Promise<Snapshot> {
    this.validateCount(params.uris, 'uris', 1, 100)
    if (params.position !== undefined)
      this.validateInteger(params.position, 'position', 0)
    const response = await this.buildRequest(
      `playlists/${playlistId}/items`,
      params,
      'POST'
    )
    return handleResponse(response)
  }

  /** @deprecated Use updatePlaylistItems(); this alias uses the current /items endpoint. */
  public async replacePlaylistTracks(
    playlistId: string,
    params: ReplacePlaylistTracksParams
  ): Promise<Snapshot> {
    return this.updatePlaylistItems(
      playlistId,
      params as UpdatePlaylistItemsParams
    )
  }

  public async updatePlaylistItems(
    playlistId: string,
    params: UpdatePlaylistItemsParams
  ): Promise<Snapshot> {
    if ('uris' in params && params.uris !== undefined) {
      this.validateCount(params.uris, 'uris', 0, 100)
      if ('range_start' in params || 'insert_before' in params) {
        throw new TypeError(
          'Choose either replacement URIs or reorder parameters'
        )
      }
    } else {
      const reorder = params as {
        range_start: number
        insert_before: number
        range_length?: number
      }
      this.validateInteger(reorder.range_start, 'range_start', 0)
      this.validateInteger(reorder.insert_before, 'insert_before', 0)
      if (reorder.range_length !== undefined)
        this.validateInteger(reorder.range_length, 'range_length', 1)
    }
    const response = await this.buildRequest(
      `playlists/${playlistId}/items`,
      params,
      'PUT'
    )
    return handleResponse(response)
  }

  /** @deprecated Use removePlaylistItems(); this alias converts uris to items. */
  public async removeTracksFromPlaylist(
    playlistId: string,
    params: RemovePlaylistTracksParams
  ): Promise<Snapshot> {
    return this.removePlaylistItems(playlistId, {
      items: params.uris.map(uri => ({ uri })),
      ...(params.snapshot_id !== undefined && {
        snapshot_id: params.snapshot_id
      })
    })
  }

  public async removePlaylistItems(
    playlistId: string,
    params: RemovePlaylistItemsParams
  ): Promise<Snapshot> {
    this.validateCount(params.items, 'items', 1, 100)
    const response = await this.buildRequest(
      `playlists/${playlistId}/items`,
      params,
      'DELETE'
    )
    return handleResponse(response)
  }

  public async getPlaylistCoverImage(playlistId: string): Promise<Image[]> {
    const response = await this.buildRequest(`playlists/${playlistId}/images`)
    return handleResponse(response)
  }

  public async uploadCustomPlaylistCoverImage(
    playlistId: string,
    imageBase64: string
  ): Promise<void> {
    const response = await this.buildRequest(
      `playlists/${playlistId}/images`,
      imageBase64,
      'PUT',
      { 'Content-Type': 'image/jpeg' }
    )
    return handleResponse(response)
  }

  public async unfollowPlaylist(playlistId: string): Promise<void> {
    await this.removeLibraryItems([`spotify:playlist:${playlistId}`])
  }

  public async saveLibraryItems(uris: string[]): Promise<void> {
    await this.libraryRequest(uris, 'PUT')
  }

  public async removeLibraryItems(uris: string[]): Promise<void> {
    await this.libraryRequest(uris, 'DELETE')
  }

  public async checkLibraryItems(uris: string[]): Promise<boolean[]> {
    this.validateCount(uris, 'uris', 1, 40)
    const response = await this.buildRequest('me/library/contains', {
      uris: uris.join(',')
    })
    return handleResponse(response)
  }

  public async getCurrentUserProfile(): Promise<User> {
    const response = await this.buildRequest('me')
    return handleResponse(response)
  }

  public async getUserProfile(userId?: string): Promise<User> {
    if (userId === undefined) return this.getCurrentUserProfile()
    this.requireExtended('users/{id} (use getCurrentUserProfile())')
    const response = await this.buildRequest(`users/${userId}`)
    return handleResponse(response)
  }

  public async buildRequest(
    endpoint: string,
    params?: AxiosRequestConfig['params'],
    method: Method = 'GET',
    headers?: Record<string, any>,
    query?: AxiosRequestConfig['params']
  ): Promise<AxiosResponse<any>> {
    const payloadKey = ['PUT', 'POST', 'PATCH', 'DELETE'].includes(
      method.toUpperCase()
    )
      ? 'data'
      : 'params'

    // Spotify returns 429 through validateStatus, so retry resolved responses too.
    // Limit retries to avoid an unbounded request loop.
    for (let attempt = 0; ; attempt += 1) {
      const request: AxiosRequestConfig = {
        headers: { ...this.buildHeaders(), ...headers },
        method,
        url: `${this.getApiUrl()}/${endpoint}`,
        ...(params !== undefined && { [payloadKey]: params }),
        ...(query !== undefined && { params: query })
      }
      let response: AxiosResponse<any>
      try {
        response = await this.httpClient(request)
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 429) {
          throw error
        }
        response = error.response
      }
      const retryAfter = response.headers?.['retry-after']
      const seconds = Number(retryAfter)
      if (
        response.status !== 429 ||
        response.data?.error?.reason === 'QUOTA_EXCEEDED' ||
        attempt >= 2 ||
        retryAfter == null ||
        !Number.isFinite(seconds) ||
        seconds < 0 ||
        seconds > 2147483
      ) {
        return response
      }
      await new Promise(resolve => setTimeout(resolve, seconds * 1000))
    }
  }

  private requireExtended(endpoint: string): void {
    if (this.config.quotaMode !== 'extended') {
      throw new SpotifyUnsupportedEndpointError(endpoint)
    }
  }

  private validateInteger(
    value: number,
    name: string,
    min: number,
    max = Number.MAX_SAFE_INTEGER
  ): void {
    if (!Number.isSafeInteger(value) || value < min || value > max) {
      throw new RangeError(
        `${name} must be an integer between ${min} and ${max}`
      )
    }
  }

  private validateCount(
    values: readonly unknown[],
    name: string,
    min: number,
    max: number
  ): void {
    if (!Array.isArray(values) || values.length < min || values.length > max) {
      throw new RangeError(
        `${name} must contain between ${min} and ${max} items`
      )
    }
  }

  private validateSearchOptions(options?: OptionalRequestParams): void {
    if (options?.limit !== undefined) {
      this.validateInteger(
        options.limit,
        'limit',
        0,
        this.config.quotaMode === 'extended' ? 50 : 10
      )
    }
    if (options?.offset !== undefined)
      this.validateInteger(options.offset, 'offset', 0, 1000)
  }

  private async getMany<T>(
    ids: string[],
    fetch: (id: string) => Promise<T>
  ): Promise<T[]> {
    const results: T[] = new Array(ids.length)
    let next = 0
    let failed = false
    await Promise.all(
      Array.from({ length: Math.min(3, ids.length) }, async () => {
        while (!failed && next < ids.length) {
          const index = next++
          try {
            results[index] = await fetch(ids[index])
          } catch (error) {
            failed = true
            throw error
          }
        }
      })
    )
    return results
  }

  private normalizePlaylistItems(page: any): PagingPlaylistItems {
    // A fields filter can omit the entries entirely.
    if (!Array.isArray(page.items)) return page
    return {
      ...page,
      items: page.items.map((entry: any) =>
        entry == null
          ? entry
          : {
              ...entry,
              item:
                entry.item !== undefined ? entry.item : (entry.track ?? null)
            }
      )
    }
  }

  private normalizePlaylist(playlist: any): Playlist {
    const page = playlist.items ?? playlist.tracks
    if (!page || !Array.isArray(page.items)) return playlist
    return { ...playlist, items: this.normalizePlaylistItems(page) }
  }

  private async libraryRequest(
    uris: string[],
    method: 'PUT' | 'DELETE'
  ): Promise<void> {
    this.validateCount(uris, 'uris', 1, 40)
    const response = await this.buildRequest(
      'me/library',
      undefined,
      method,
      undefined,
      { uris: uris.join(',') }
    )
    handleResponse(response)
  }

  private buildHeaders(): Record<string, any> {
    return {
      Authorization: `Bearer ${this.config.token}`,
      'Content-Type': 'application/json'
    }
  }
}

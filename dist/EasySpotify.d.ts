import { AxiosInstance, AxiosRequestConfig } from 'axios';
import EasySpotifyConfig from './EasySpotifyConfig';
import { Album, Artist, Category, FeaturedAlbums, FeaturedPlaylists, PagingAlbums, PagingArtists, PagingCategories, PagingPlaylists, PagingSearch, PagingTracks, Recommendations, RecommendationsQuery, SimplifiedPlaylist, Track, User } from './models';
export interface PagingRequestParams {
    limit?: number;
    offset?: number;
}
export interface OptionalRequestParams extends PagingRequestParams {
    market?: string;
}
export interface SearchRequestParams extends OptionalRequestParams {
    type: string;
    include_external?: string;
}
export interface GetAlbumOptions {
    market: string;
}
export interface GetArtistAlbumsOptions extends OptionalRequestParams {
    include_groups?: string;
}
export interface CreatePlaylistParams {
    name: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
}
export interface UpdatePlaylistParams {
    name?: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
}
export default class EasySpotify {
    config: EasySpotifyConfig;
    httpClient: AxiosInstance;
    constructor(config: EasySpotifyConfig);
    setToken(token: string): void;
    setApiUrl(apiURL: string): void;
    getToken(): string;
    getApiUrl(): string;
    getAlbum(id: string, options?: GetAlbumOptions): Promise<Album>;
    getAlbums(ids: string[], options?: GetAlbumOptions): Promise<Album[]>;
    getAlbumTracks(id: string, options?: OptionalRequestParams): Promise<PagingTracks>;
    getArtist(id: string): Promise<Artist>;
    getArtists(ids: string[]): Promise<Artist[]>;
    getArtistAlbums(id: string, options?: GetArtistAlbumsOptions): Promise<PagingAlbums>;
    getArtistTopTracks(id: string, options?: GetAlbumOptions): Promise<Track[]>;
    getArtistRelatedArtists(id: string): Promise<Artist[]>;
    searchAlbums(query: string, options?: OptionalRequestParams): Promise<PagingAlbums>;
    searchArtists(query: string, options?: OptionalRequestParams): Promise<PagingArtists>;
    searchPlaylists(query: string, options?: OptionalRequestParams): Promise<PagingPlaylists>;
    searchTracks(query: string, options?: OptionalRequestParams): Promise<PagingTracks>;
    search(query: string, options: SearchRequestParams): Promise<PagingSearch>;
    getBrowseCategory(id: string, options?: {
        country?: string;
        locale?: string;
    }): Promise<Category>;
    getBrowseCategoryPlaylists(id: string, options: {
        country?: string;
    } & PagingRequestParams): Promise<PagingPlaylists>;
    getBrowseListOfCategories(options: {
        locale?: string;
        country?: string;
    } & PagingRequestParams): Promise<PagingCategories>;
    getBrowseFeaturedPlaylists(options: {
        locale?: string;
        country?: string;
        timestamp?: Date;
    } & PagingRequestParams): Promise<FeaturedPlaylists>;
    getBrowseNewReleases(options: {
        country?: string;
    } & PagingRequestParams): Promise<FeaturedAlbums>;
    getBrowseRecommendations(query: RecommendationsQuery): Promise<Recommendations>;
    getPlaylists(userId?: string, options?: PagingRequestParams): Promise<PagingPlaylists>;
    createPlaylist(userId: string, params: CreatePlaylistParams): Promise<SimplifiedPlaylist>;
    updatePlaylistDetails(playlistId: string, params: UpdatePlaylistParams): Promise<void>;
    addPlaylistTracks(playlistId: string, uris: string[]): Promise<void>;
    replacePlaylistTracks(playlistId: string, uris: string[]): Promise<void>;
    unfollowPlaylist(playlistId: string): Promise<void>;
    getUserProfile(userId?: string): Promise<User>;
    buildRequest(endpoint: string, params?: AxiosRequestConfig['params'], method?: string): Promise<any>;
    private buildHeaders;
}

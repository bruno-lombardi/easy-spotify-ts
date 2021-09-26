import { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import EasySpotifyConfig from './EasySpotifyConfig';
import { Album, Artist, FeaturedAlbums, FeaturedPlaylists, Image, PagingAlbums, PagingArtists, PagingCategories, PagingPlaylists, PagingSearch, PagingTracks, Recommendations, RecommendationsQuery, SimplifiedPlaylist, Track, User } from './models';
import { GetAlbumOptions } from './models/Album';
import { GetArtistAlbumsOptions } from './models/Artist';
import { PagingRequestParams } from './models/Paging';
import { AddPlaylistTracksParams, CreatePlaylistParams, Playlist, RemovePlaylistTracksParams, ReplacePlaylistTracksParams, UpdatePlaylistParams } from './models/Playlist';
import { OptionalRequestParams, SearchRequestParams } from './models/Request';
import Snapshot from './models/Snapshot';
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
    getBrowseNewReleases(options: {
        country?: string;
    } & PagingRequestParams): Promise<FeaturedAlbums>;
    getBrowseFeaturedPlaylists(options: {
        locale?: string;
        country?: string;
        timestamp?: Date;
    } & PagingRequestParams): Promise<FeaturedPlaylists>;
    getBrowseListOfCategories(options: {
        locale?: string;
        country?: string;
    } & PagingRequestParams): Promise<PagingCategories>;
    getBrowseCategory(id: string, options?: {
        country?: string;
        locale?: string;
    }): Promise<any>;
    getBrowseCategoryPlaylists(id: string, options: {
        country?: string;
    } & PagingRequestParams): Promise<PagingPlaylists>;
    getBrowseRecommendations(query: RecommendationsQuery): Promise<Recommendations>;
    getBrowseRecommendationGenres(): Promise<string[]>;
    getCurrentUserPlaylists(options?: PagingRequestParams): Promise<PagingPlaylists>;
    getUserPlaylists(userId: string, options?: PagingRequestParams): Promise<PagingPlaylists>;
    createPlaylist(userId: string, params: CreatePlaylistParams): Promise<SimplifiedPlaylist>;
    getPlaylist(playlistId: string): Promise<Playlist>;
    updatePlaylistDetails(playlistId: string, params: UpdatePlaylistParams): Promise<void>;
    addPlaylistTracks(playlistId: string, params: AddPlaylistTracksParams): Promise<Snapshot>;
    replacePlaylistTracks(playlistId: string, params: ReplacePlaylistTracksParams): Promise<Snapshot>;
    removeTracksFromPlaylist(playlistId: string, params: RemovePlaylistTracksParams): Promise<Snapshot>;
    getPlaylistCoverImage(playlistId: string): Promise<Image[]>;
    uploadCustomPlaylistCoverImage(playlistId: string, imageBase64: string): Promise<void>;
    unfollowPlaylist(playlistId: string): Promise<void>;
    getUserProfile(userId?: string): Promise<User>;
    buildRequest(endpoint: string, params?: AxiosRequestConfig['params'], method?: Method, headers?: Record<string, any>): Promise<any>;
    private buildHeaders;
}

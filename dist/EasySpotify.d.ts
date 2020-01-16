import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import EasySpotifyConfig from "./EasySpotifyConfig";
import { Album, FeaturedAlbums } from "./models/Album";
import { Artist } from "./models/Artist";
import { PagingAlbums, PagingArtists, PagingPlaylists, PagingTracks, PagingSearch, PagingCategories } from "./models/Paging";
import { Track } from "./models/Track";
import { Category } from './models/Category';
import { FeaturedPlaylists } from "./models/Playlist";
import { RecommendationsQuery, Recommendations } from "./models/Recomendations";
export interface OptionalRequestParams {
    limit?: number;
    offset?: number;
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
        limit?: number;
        offset?: number;
    }): Promise<PagingPlaylists>;
    getBrowseListOfCategories(options: {
        locale?: string;
        country?: string;
        offset?: number;
        limit?: number;
    }): Promise<PagingCategories>;
    getBrowseFeaturedPlaylists(options: {
        locale?: string;
        country?: string;
        timestamp?: Date;
        limit?: number;
        offset?: number;
    }): Promise<FeaturedPlaylists>;
    getBrowseNewReleases(options: {
        country?: string;
        limit?: number;
        offset?: number;
    }): Promise<FeaturedAlbums>;
    getBrowseRecommendations(query: RecommendationsQuery): Promise<Recommendations>;
    buildRequest(endpoint: string, params?: AxiosRequestConfig["params"], method?: string): AxiosPromise<any>;
    private buildHeaders;
}

import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import EasySpotifyConfig from "./EasySpotifyConfig";
import { Album } from "./models/Album";
import { PagingTracks } from "./models/Paging";
export interface GetAlbumTracksOptions {
    limit?: number;
    offset?: number;
    market?: string;
}
export interface GetAlbumOptions {
    market: string;
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
    getAlbumTracks(id: string, options?: GetAlbumTracksOptions): Promise<PagingTracks>;
    buildRequest(endpoint: string, params?: AxiosRequestConfig["params"], method?: string): AxiosPromise<any>;
    private buildHeaders;
}

import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import EasySpotifyConfig from "./EasySpotifyConfig";
import { Album } from "./models/Album";
import { Artist } from "./models/Artist";
import { PagingTracks, PagingAlbums } from "./models/Paging";
import { Tracks } from './models/Track';

export interface GetAlbumTracksOptions {
  limit?: number;
  offset?: number;
  market?: string;
}

export interface GetAlbumOptions {
  market: string;
}

export interface GetArtistAlbumsOptions extends GetAlbumTracksOptions {
  include_groups?: string;
}

export default class EasySpotify {
  public config: EasySpotifyConfig;
  public httpClient: AxiosInstance;

  constructor(config: EasySpotifyConfig) {
    this.config = config;
    this.httpClient = axios;
  }

  public setToken(token: string): void {
    if (token.trim() === "") {
      throw new Error("Cannot set an empty token");
    }
    this.config.token = token;
  }

  public setApiUrl(apiURL: string): void {
    if (apiURL.trim() === "") {
      throw new Error("Cannot set an empty API Url");
    }
    this.config.apiURL = apiURL;
  }

  public getToken(): string {
    return this.config.token;
  }

  public getApiUrl(): string {
    return this.config.apiURL;
  }

  public async getAlbum(id: string, options?: GetAlbumOptions): Promise<Album> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(
        `albums/${id}`,
        options,
      );
      if (response.data) {
        return new Album(response.data);
      } else {
        throw new Error("Could not find any album with that id");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAlbums(
    ids: string[],
    options?: GetAlbumOptions,
  ): Promise<Album[]> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(`albums`, {
        ids: `${ids}`,
        ...options,
      });
      if (response.data.albums) {
        const albums: Album[] = response.data.albums.map((album: any) => {
          return new Album(album);
        });
        return albums;
      } else {
        throw new Error("Could not find any albums with provided ids");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAlbumTracks(
    id: string,
    options?: GetAlbumTracksOptions,
  ): Promise<PagingTracks> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(
        `albums/${id}/tracks`,
        options,
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Could not find any tracks for provided id");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getArtist(id: string): Promise<Artist> {
    try {
        const response: AxiosResponse<any> = await this.buildRequest(`artists/${id}`);
        if (response.data) {
            return response.data;
        }
    } catch (err) {
      throw err;
    }
  }

  public async getArtists(ids: string[]): Promise<Artist[]> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(`artists`, { ids: `${ids}` });
      if (response.data.artists) {
        const artists: Artist[] = response.data.artists.map((artist: any) => {
          return new Artist(artist);
        });
        return artists;
      } else {
        throw new Error("No artists found");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getArtistAlbums(id: string, options?: GetArtistAlbumsOptions): Promise<PagingAlbums> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(`artists/${id}/albums`, options);
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Could not find any tracks for provided id");
      }
    } catch (err) {
      throw  err;
    }
  }

  public async getArtistTopTracks(id: string, options?: GetAlbumOptions): Promise<Tracks> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(`artists/${id}/top-tracks`, options);
      if(response.data) {
        return response.data;
      } else {
        throw new Error("Could not find any tracks for provided id");
      }
    } catch (err) {
      throw err;
    }
  }

  public buildRequest(
    endpoint: string,
    params?: AxiosRequestConfig["params"],
    method: string = "get",
  ): AxiosPromise<any> {
    return this.httpClient({
      headers: this.buildHeaders(),
      method,
      params,
      url: `${this.getApiUrl()}/${endpoint}`,
    });
  }

  private buildHeaders(): any {
    return { Authorization: `Bearer ${this.config.token}` };
  }
}

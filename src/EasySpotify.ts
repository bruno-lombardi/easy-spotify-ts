import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import EasySpotifyConfig from "./EasySpotifyConfig";
import { Album, SimplifiedAlbum, FeaturedAlbums } from "./models/Album";
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
    options?: OptionalRequestParams,
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
      throw err;
    }
  }

  public async getArtistTopTracks(id: string, options?: GetAlbumOptions): Promise<Track[]> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(`artists/${id}/top-tracks`, options);
      if (response.data.tracks) {
        const tracks: Track[] = response.data.tracks.map((track: any) => {
          return new Track(track);
        });
        return tracks;
      } else {
        throw new Error("Could not find any tracks for provided id");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getArtistRelatedArtists(id: string): Promise<Artist[]> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(`artists/${id}/related-artists`);
      if (response.data.artists) {
        const artists: Artist[] = response.data.artists.map((artist: any) => {
          return new Artist(artist);
        });
        return artists;
      }
    } catch (err) {
      throw err;
    }
  }

  public async searchAlbums(query: string, options?: OptionalRequestParams): Promise<PagingAlbums> {
    try {
      const params = {
        ...options,
        q: query,
        type: "album",
      };
      const response: AxiosResponse<any> = await this.buildRequest("search", params);
      if (response.data.albums) {
        return response.data.albums;
      }
    } catch (err) {
      throw err;
    }
  }

  public async searchArtists(query: string, options?: OptionalRequestParams): Promise<PagingArtists> {
    try {
      const params = {
        ...options,
        q: query,
        type: "artist",
      };
      const response: AxiosResponse<any> = await this.buildRequest("search", params);
      if (response.data.artists) {
        return response.data.artists;
      }
    } catch (err) {
      throw err;
    }
  }

  public async searchPlaylists(query: string, options?: OptionalRequestParams): Promise<PagingPlaylists> {
    try {
      const params = {
        ...options,
        q: query,
        type: "playlist",
      };
      const response: AxiosResponse<any> = await this.buildRequest("search", params);
      if (response.data.playlists) {
        return response.data.playlists;
      }
    } catch (err) {
      throw err;
    }
  }

  public async searchTracks(query: string, options?: OptionalRequestParams): Promise<PagingTracks> {
    try {
      const params = {
        ...options,
        q: query,
        type: "track",
      };
      const response: AxiosResponse<any> = await this.buildRequest("search", params);
      if (response.data.tracks) {
        return response.data.tracks;
      }
    } catch (err) {
      throw err;
    }
  }

  public async search(query: string, options: SearchRequestParams): Promise<PagingSearch> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest("search", { ...options, q: query });
      if (response.data) {
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBrowseCategory(id: string, options?: { country?: string, locale?: string }) {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(
        `browse/categories/${id}`,
        options,
      );
      if (response.data) {
        return new Category(response.data);
      } else {
        throw new Error("Could not find any category with that id");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBrowseCategoryPlaylists(id: string, options: { country?: string, limit?: number, offset?: number }): Promise<PagingPlaylists> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(
        `browse/categories/${id}/playlists`,
        options,
      );
      if (response.data) {
        return response.data.playlists;
      } else {
        throw new Error("Could not find any playlist from that category id");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBrowseListOfCategories(options: {locale?: string, country?: string, offset?: number, limit?: number}): Promise<PagingCategories> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(
        `browse/categories`,
        options,
      );
      if (response.data) {
        return response.data.categories;
      } else {
        throw new Error("Could not get any categories");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBrowseFeaturedPlaylists(options: {locale?: string, country?: string, timestamp?: Date, limit?: number, offset?: number}): Promise<FeaturedPlaylists> {
    try {
      if (options.timestamp) {
        Object.assign(options, {timestamp: options.timestamp.toISOString()});
      }
      const response: AxiosResponse<any> = await this.buildRequest(
        `browse/featured-playlists`,
        options,
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Could not get any featured playlists");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBrowseNewReleases(options: {country?: string, limit?: number, offset?: number}): Promise<FeaturedAlbums> {
    try {
      const response: AxiosResponse<any> = await this.buildRequest(
        `browse/new-releases`,
        options,
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Could not get any albums");
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBrowseRecommendations(query: RecommendationsQuery): Promise<Recommendations> {
    try {
      if (query.seed_artists && query.seed_artists.length) {
        Object.assign(query, {
          seed_artists: query.seed_artists.join(","),
        });
      }
      if (query.seed_genres && query.seed_genres.length) {
        Object.assign(query, {
          seed_genres: query.seed_genres.join(","),
        });
      }
      if (query.seed_tracks && query.seed_tracks.length) {
        Object.assign(query, {
          seed_tracks: query.seed_tracks.join(","),
        });
      }
      const response: AxiosResponse<any> = await this.buildRequest(
        `recommendations`,
        query,
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Could not get any recommendations");
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

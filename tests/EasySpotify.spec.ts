import { expect, use } from "chai";
import "mocha";
import { SinonStub, stub } from "sinon";
import sinonChai = require("sinon-chai");
use(sinonChai);

import EasySpotify from "../src/EasySpotify";
import EasySpotifyConfig from "../src/EasySpotifyConfig";
import { Album, FeaturedAlbums } from "../src/models";
import { Artist } from "../src/models";
import { Category } from "../src/models";
import { PagingAlbums, PagingArtists, PagingCategories, PagingPlaylists, PagingSearch, PagingTracks } from "../src/models";
import { FeaturedPlaylists } from "../src/models";
import { Track } from "../src/models";

const baseHttpClientConfig = {
  headers: { "Authorization": "Bearer token", "Content-Type": "application/json" },
  method: "get",
};

describe("EasySpotify", () => {
  let spotify: EasySpotify;
  let httpClientStub: SinonStub;

  beforeEach(() => {
    spotify = new EasySpotify(new EasySpotifyConfig("token"));
    httpClientStub = stub(spotify, "httpClient");
  });

  afterEach(() => {
    httpClientStub.restore();
  });

  it("should pass smoke test", () => {
    expect(spotify.getAlbum).to.exist;
    expect(spotify.getAlbums).to.exist;
    expect(spotify.getAlbumTracks).to.exist;

    expect(spotify.getArtist).to.exist;
    expect(spotify.getArtists).to.exist;
    expect(spotify.getArtistTopTracks).to.exist;
    expect(spotify.getArtistRelatedArtists).to.exist;
    expect(spotify.getArtistAlbums).to.exist;

    expect(spotify.searchAlbums).to.exist;
    expect(spotify.searchArtists).to.exist;
    expect(spotify.searchPlaylists).to.exist;
    expect(spotify.searchTracks).to.exist;

    expect(spotify.getBrowseCategory).to.exist;
    expect(spotify.getBrowseCategoryPlaylists).to.exist;
    expect(spotify.getBrowseListOfCategories).to.exist;
    expect(spotify.getBrowseFeaturedPlaylists).to.exist;
    expect(spotify.getBrowseNewReleases).to.exist;

    expect(spotify.getPlaylists).to.exist;
    expect(spotify.createPlaylist).to.exist;
    expect(spotify.updatePlaylistDetails).to.exist;
    expect(spotify.addPlaylistTracks).to.exist;
    expect(spotify.replacePlaylistTracks).to.exist;
    expect(spotify.unfollowPlaylist).to.exist;

    expect(spotify.getUserProfile).to.exist;
  });

  it("should create an instance of EasySpotify", () => {
    expect(spotify).to.be.instanceof(EasySpotify);
    expect(spotify.config.token).to.not.be.empty;
    expect(spotify.config.apiURL).to.not.be.empty;
  });

  it("should not set token if empty", () => {
    expect(() => spotify.setToken("")).to.throw("Cannot set an empty token");
  });

  it("should not set apiURL if empty", () => {
    expect(() => spotify.setApiUrl("")).to.throw("Cannot set an empty API Url");
  });

  it("should correctly set the token", () => {
    spotify.setToken("new token");
    expect(spotify.getToken()).to.eq("new token");
  });

  it("should correctly set the Api Url", () => {
    // TODO: Add validation to check it"s a valid URL
    spotify.setApiUrl("new apiURL");
    expect(spotify.getApiUrl()).to.eq("new apiURL");
  });

  describe("Methods", () => {

    describe("getAlbum", () => {
      let id = "4aawyAB9vmqN3uQ7FjRGTy";

      beforeEach(() => {
        httpClientStub.resolves({ data: { id, name: "Cyndi Lauper" } });
      });

      it("should call httpClient method", async () => {
        const album: Album = await spotify.getAlbum(id);
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient with correct config", async () => {
        const album: Album = await spotify.getAlbum(id, { market: "ES" });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { market: "ES" },
          url: "https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy",
        });
      });

      it("should get an album if valid id", async () => {
        const album: Album = await spotify.getAlbum(id);
        expect(album).to.be.instanceOf(Album);
        expect(album.id).to.eq(id);
        expect(album.name).to.not.be.empty;
      });

      it("should not get a album if invalid id", async () => {
        httpClientStub.rejects({ response: { status: 400 } });
        id = "invalidId";
        try {
          await spotify.getAlbum(id);
        } catch (err) {
          expect(err.response.status).to.eq(400);
        }
      });
    });

    describe("getAlbums", () => {
      let ids: string[] = ["41MnTivkwTO3UUJ8DrqEJJ", "6JWc4iAiJ9FjyK0B59ABb4", "6UXCm6bOO4gFlDQZV5yL37"];

      beforeEach(() => {
        // Fake response with reduced payload as you would get from Spotify Web API
        // Check https://developer.spotify.com/documentation/web-api/reference/albums/get-several-albums/
        httpClientStub.resolves({
          data: {
            albums: [
              { id: "41MnTivkwTO3UUJ8DrqEJJ", name: "Cyndi Lauper" },
              { id: "6JWc4iAiJ9FjyK0B59ABb4", name: "Rock is Good" },
              { id: "6UXCm6bOO4gFlDQZV5yL37", name: "Just a Fake Name" },
            ],
          },
        });
      });

      it("should call httpClient method", async () => {
        const albums: Album[] = await spotify.getAlbums(ids);
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient with correct config", async () => {
        const albums: Album[] = await spotify.getAlbums(ids, { market: "ES" });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          // tslint:disable-next-line:max-line-length
          params: { ids: `${ids}`, market: "ES" },
          url: "https://api.spotify.com/v1/albums",
        });
      });

      it("should get albums if valid ids", async () => {
        const albums: Album[] = await spotify.getAlbums(ids);
        expect(albums.length).to.eql(3);
        expect(albums[0].id).to.eql(ids[0]);
        expect(albums[2].id).to.eql(ids[2]);
      });

      it("should throw error if invalid ids", async () => {
        httpClientStub.rejects({ response: { status: 400 } });
        ids = ["invalid", "id"];
        try {
          await await spotify.getAlbums(ids);
        } catch (err) {
          expect(err.response.status).to.eq(400);
        }
      });

    });

    describe("getAlbumTracks", () => {
      let id = "4aawyAB9vmqN3uQ7FjRGTy";

      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            href: "https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks?offset=0&limit=3",
            items: [
              { id: "41MnTivkwTO3UUJ8DrqEJJ", name: "Cyndi Lauper" },
              { id: "6JWc4iAiJ9FjyK0B59ABb4", name: "Rock is Good" },
              { id: "6UXCm6bOO4gFlDQZV5yL37", name: "Just a Fake Name" },
            ],
          },
        });
      });

      it("should call httpClient method", async () => {
        const albumTracks: PagingTracks = await spotify.getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy");
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient method with correct config", async () => {
        const albumTracks: PagingTracks = await spotify.getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy", { limit: 3, offset: 0 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { limit: 3, offset: 0 },
          url: "https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks",
        });
      });

      it("should get tracks for valid album", async () => {
        const tracks: PagingTracks = await spotify.getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy", { offset: 0, limit: 3 });
        expect(tracks.items.length).to.eq(3);
        expect(tracks.items[0].id).to.eq("41MnTivkwTO3UUJ8DrqEJJ");
        expect(tracks.items[1].name).to.exist;
      });

      it("should not get tracks for invalid album", async () => {
        httpClientStub.rejects({ response: { status: 400 } });
        id = "invalid";
        try {
          await await spotify.getAlbumTracks(id);
        } catch (err) {
          expect(err.response.status).to.eq(400);
        }
      });
    });

    describe("getArtist", () => {
      let id = "4aawyAB9vmqN3uQ7FjRGTy";

      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            id: "0OdUWJ0sBjDrqHygGUXeCF",
            name: "Band of Horses",
            popularity: 100,
          },
        });
      });

      it("should call httpClient method", async () => {
        const artist = await spotify.getArtist("0OdUWJ0sBjDrqHygGUXeCF");
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient method with correct config", async () => {
        const artist = await spotify.getArtist("0OdUWJ0sBjDrqHygGUXeCF");
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: undefined,
          url: "https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF",
        });
      });

      it("should get an artist for valid id", async () => {
        const artist: Artist = await spotify.getArtist("0OdUWJ0sBjDrqHygGUXeCF");
        expect(artist.id).to.eq("0OdUWJ0sBjDrqHygGUXeCF");
        expect(artist.popularity).to.eq(100);
        expect(artist.name).to.exist;
      });

      it("should not get artist if invalid id", async () => {
        httpClientStub.rejects({ response: { status: 400 } });
        id = "invalid";
        try {
          await await spotify.getArtist(id);
        } catch (err) {
          expect(err.response.status).to.eq(400);
        }
      });
    });

    describe("getArtists", () => {
      let ids = ["0OdUWJ0sBjDrqHygGUXeCF", "3dBVyJ7JuOMt4GE9607Qin", "0oSGxfWSnnOXhD2fKuz2Gy"];

      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            artists: [{
              id: "0OdUWJ0sBjDrqHygGUXeCF",
              name: "Band of Horses",
              popularity: 14,
            }, {
              id: "3dBVyJ7JuOMt4GE9607Qin",
              name: "T. Rex",
              popularity: 62,
            }, {
              id: "0oSGxfWSnnOXhD2fKuz2Gy",
              name: "David Bowie",
              popularity: 82,
            }],
          },
        });
      });

      it("should call httpClient method", async () => {
        const artists: Artist[] = await spotify.getArtists(ids);
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient with correct config", async () => {
        const artists: Artist[] = await spotify.getArtists(ids);
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { ids: "0OdUWJ0sBjDrqHygGUXeCF,3dBVyJ7JuOMt4GE9607Qin,0oSGxfWSnnOXhD2fKuz2Gy" },
          url: "https://api.spotify.com/v1/artists",
        });
      });

      it("should get artists if valid ids", async () => {
        const artists: Artist[] = await spotify.getArtists(ids);
        expect(artists).to.not.be.empty;
        expect(artists.length).to.eq(3);
        expect(artists[0].id).to.eq("0OdUWJ0sBjDrqHygGUXeCF");
        expect(artists[2].name).to.exist;
      });

      it("should not get artists if invalid ids", async () => {
        ids = ["invalid", "id"];
        httpClientStub.rejects({ response: { status: 400 } });
        try {
          const artists: Artist[] = await spotify.getArtists(ids);
        } catch (err) {
          expect(err.response.status).to.eq(400);
        }
      });
    });

    describe("getArtistAlbums", () => {
      const id = "1vCWHaC5f2uS3yhpwWbIA6";

      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            // tslint:disable-next-line:max-line-length
            href: "https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6/albums?offset=0&limit=3market=ES&include_groups=appears_on",
            items: [
              { id: "43977e0YlJeMXG77uCCSMX", name: "Shut Up Lets Dance (Vol. II)", album_group: "appears_on" },
              { id: "189ngoT3WxR5mZSYkAGOLF", name: "Classic Club Monsters", album_group: "appears_on" },
            ],
          },
        });
      });

      it("should call httpClient method", async () => {
        const artistAlbums: PagingAlbums =
          await spotify.getArtistAlbums("4aawyAB9vmqN3uQ7FjRGTy",
            { include_groups: "appears_on", limit: 3, offset: 0, market: "ES" });
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient method with correct settings", async () => {
        const artistAlbums: PagingAlbums =
          await spotify.getArtistAlbums("4aawyAB9vmqN3uQ7FjRGTy",
            { include_groups: "appears_on", limit: 3, offset: 0, market: "ES" });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { include_groups: "appears_on", limit: 3, market: "ES", offset: 0 },
          url: "https://api.spotify.com/v1/artists/4aawyAB9vmqN3uQ7FjRGTy/albums",
        });
      });

      it("should get albums for artist if valid id", async () => {
        const artistAlbums: PagingAlbums =
          await spotify.getArtistAlbums("4aawyAB9vmqN3uQ7FjRGTy",
            { include_groups: "appears_on", limit: 3, offset: 0, market: "ES" });
        expect(artistAlbums).to.not.be.empty;
        expect(artistAlbums.items.length).to.eq(2);
        expect(artistAlbums.items[0].id).to.eq("43977e0YlJeMXG77uCCSMX");
        expect(artistAlbums.href).to.exist;
      });
    });

    describe("getArtistTopTracks", () => {
      const id = "1vCWHaC5f2uS3yhpwWbIA6";

      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            tracks: [
              {
                id: "44AyOl4qVkzS48vBsbNXaC",
                name: "Can\'t Help Falling in Love",
                uri: "spotify:track:44AyOl4qVkzS48vBsbNXaC",
              },
              {
                id: "44AyOl4qVkzS48vBsbNXaC",
                name: "Can\'t Help Falling in Love",
                uri: "spotify:track:44AyOl4qVkzS48vBsbNXaC",
              },
            ],
          },
        });
      });

      it("should call httpClient method with correct settings", async () => {
        const artistTopTracks: Track[] =
          await spotify.getArtistTopTracks("4aawyAB9vmqN3uQ7FjRGTy", { market: "ES" });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { market: "ES" },
          url: "https://api.spotify.com/v1/artists/4aawyAB9vmqN3uQ7FjRGTy/top-tracks",
        });
      });

      it("should get albums for artist if valid id", async () => {
        const artistTopTracks: Track[] =
          await spotify.getArtistTopTracks("4aawyAB9vmqN3uQ7FjRGTy", { market: "ES" });
        expect(artistTopTracks).to.not.be.empty;
        expect(artistTopTracks.length).to.eq(2);
        expect(artistTopTracks[0].id).to.eq("44AyOl4qVkzS48vBsbNXaC");
      });

    });

    describe("getArtistRelatedArtists", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            artists: [
              {
                external_urls: {
                  spotify: "https://open.spotify.com/artist/5ZKMPRDHc7qElVJFh3uRqB",
                },
                followers: {
                  href: null,
                  total: 18108,
                },
                genres: ["rockabilly"],
                href: "https://api.spotify.com/v1/artists/5ZKMPRDHc7qElVJFh3uRqB",
                id: "5ZKMPRDHc7qElVJFh3uRqB",
              },
              {
                external_urls: {
                  spotify: "https://open.spotify.com/artist/5ZKMPRDHc7qElVJFh3uRqB",
                },
                followers: {
                  href: null,
                  total: 18108,
                },
                genres: ["rockabilly"],
                href: "https://api.spotify.com/v1/artists/5ZKMPRDHc7qElVJFh3uRqB",
                id: "5ZKMPRDHc7qElVJFh3uRqB",
              },
            ],
          },
        });
      });

      it("should call httpClient method with correct settings", async () => {
        const artists: Artist[] = await spotify.getArtistRelatedArtists("43ZHCT0cAZBISjO8DG9PnE");
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: undefined,
          url: "https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/related-artists",
        });
      });

      it("should get related artists if valid id", async () => {
        const artists: Artist[] = await spotify.getArtistRelatedArtists("43ZHCT0cAZBISjO8DG9PnE");
        expect(artists).to.not.be.empty;
        expect(artists.length).to.eq(2);
        expect(artists[0].id).to.eq("5ZKMPRDHc7qElVJFh3uRqB");
      });
    });

    describe("searchAlbums", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            albums: {
              items: [
                {
                  album_type: "album",
                  id: "6YkkoAG1rnLqET8SgT6ngp",
                },
                {
                  album_type: "album",
                  id: "1ZH5g1RDq3GY1OvyD0w0s2",
                },
              ],
              total: 40000,
            },
          },
        });
      });

      it("should call httpClient method with correct settings", async () => {
        const albums: PagingAlbums = await spotify.searchAlbums("Rock", { limit: 2 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { limit: 2, type: "album", q: "Rock" },
          url: "https://api.spotify.com/v1/search",
        });
      });

      it("should get albums for valid search", async () => {
        const albums: PagingAlbums = await spotify.searchAlbums("Rock", { limit: 2 });
        expect(albums.items).to.not.be.empty;
        expect(albums.items[0].id).to.eq("6YkkoAG1rnLqET8SgT6ngp");
      });
    });

    describe("searchArtists", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            artists: {
              items: [
                {
                  name: "Elvis Presley",
                  type: "artist",
                  uri: "spotify:artist:43ZHCT0cAZBISjO8DG9PnE",
                },
                {
                  name: "Edi Rock",
                  type: "artist",
                  uri: "spotify:artist:2fYAyTS2erZgqEHKHYqgi2",
                },
              ],
              offset: 2,
              total: 4442,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const artists: PagingArtists = await spotify.searchArtists("Elvis", { limit: 2 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { type: "artist", limit: 2, q: "Elvis" },
          url: "https://api.spotify.com/v1/search",
        });
      });

      it("should get artists for valid search", async () => {
        const artists: PagingArtists = await spotify.searchArtists("Elvis", { limit: 2 });
        expect(artists.items).to.not.be.empty;
        expect(artists.items[0].name).to.eq("Elvis Presley");
      });
    });

    describe("searchPlaylists", () => {

      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            playlists: {
              items: [
                {
                  id: "37i9dQZF1DX3D78h6FPBPC",
                  name: "This Is ABBA",
                },
                {
                  id: "3AGOiaoRXMSjswCLtuNqv5",
                  name: "ABBA Best Of",
                },
              ],
              limit: 2,
              offset: 0,
              total: 21654,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const playlists: PagingPlaylists = await spotify.searchPlaylists("abba", { limit: 2, market: "US" });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { type: "playlist", limit: 2, q: "abba", market: "US" },
          url: "https://api.spotify.com/v1/search",
        });
      });

      it("should get playlists for valid search", async () => {
        const playlists: PagingPlaylists = await spotify.searchPlaylists("abba", { limit: 2, market: "US" });
        expect(playlists.items).to.not.be.empty;
        expect(playlists.limit).to.eq(2);
        expect(playlists.items.length).to.eq(2);
      });
    });

    describe("searchTracks", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            tracks: {
              items: [
                {
                  id: "4HpiwfnQvs867JNWeLy1vr",
                  name: "Todos Os Cantos (Ao Vivo)",
                },
                {
                  id: "0aUGXSCmdJz9I9kdY9e9kk",
                  name: "Love a Queima Roupa - Ao Vivo",
                },
              ],
              limit: 2,
              offset: 0,
              total: 21654,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const tracks: PagingTracks = await spotify.searchTracks("love", { limit: 2 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { type: "track", limit: 2, q: "love" },
          url: "https://api.spotify.com/v1/search",
        });
      });

      it("should get playlists for valid search", async () => {
        const tracks: PagingTracks = await spotify.searchTracks("love", { limit: 2 });
        expect(tracks.items).to.not.be.empty;
        expect(tracks.limit).to.eq(2);
        expect(tracks.items.length).to.eq(2);
      });

    });

    describe("search", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            artists: { total: 0, items: [] }, playlists: {
              items: [
                {
                  id: "37i9dQZF1DX50QitC6Oqtn",
                  name: "Love Pop",
                },
              ], total: 1,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const response: PagingSearch = await spotify.search("love", { type: "artist,playlist", limit: 2 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { type: "artist,playlist", q: "love", limit: 2 },
          url: "https://api.spotify.com/v1/search",
        });
      });

      it("should get response with valid search", async () => {
        const response: PagingSearch = await spotify.search("love", { type: "artist,playlist", limit: 2 });
        expect(response.artists).to.exist;
        expect(response.playlists).to.exist;
        expect(response.playlists.items).to.not.be.empty;
        expect(response.playlists.items[0].id).to.eq("37i9dQZF1DX50QitC6Oqtn");
      });

    });

    describe("getBrowseCategory", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            href: "https://api.spotify.com/v1/browse/categories/party",
            icons: [{
              height: 274,
              url: "https://datsnxq1rwndn.cloudfront.net/media/derived/party-274x274_73d1907a7371c3bb96a288390a96ee27_0_0_274_274.jpg",
              width: 274,
            }],
            id: "party",
            name: "Party",
          },
        });
      });

      it("should get response with a category", async () => {
        const category: Category = await spotify.getBrowseCategory("party", { country: "US" });
        expect(category.href).to.exist;
        expect(category.icons).to.exist;
        expect(category.icons).to.not.be.empty;
        expect(category.icons[0].height).to.eq(274);
        expect(category.id).to.exist;
      });

      it("should call httpClient with correct settings", async () => {
        const category: Category = await spotify.getBrowseCategory("party", { country: "BR" });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { country: "BR" },
          url: "https://api.spotify.com/v1/browse/categories/party",
        });
      });

    });

    describe("getBrowseCategoryPlaylists", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            playlists: {
              items: [
                {
                  id: "37i9dQZF1DX8mBRYewE6or",
                  name: "Sexta",
                },
                {
                  id: "3AGOiaoRXMSjswCLtuNqv5",
                  name: "Segue o Baile",
                },
              ],
              limit: 20,
              offset: 0,
              total: 21654,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const playlists: PagingPlaylists = await spotify.getBrowseCategoryPlaylists("party", { country: "BR", limit: 20 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { country: "BR", limit: 20 },
          url: "https://api.spotify.com/v1/browse/categories/party/playlists",
        });
      });

      it("should get response with playlists", async () => {
        const playlists: PagingPlaylists = await spotify.getBrowseCategoryPlaylists("party", { country: "BR", limit: 20 });
        expect(playlists.items).to.exist;
        expect(playlists.items).to.not.be.empty;
        expect(playlists.limit).to.eq(20);
        expect(playlists.total).to.exist;
      });
    });

    describe("getBrowseListOfCategories", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            categories: {
              href: "https://api.spotify.com/v1/browse/categories?offset=0&limit=20",
              items: [{
                id: "toplists",
                name: "Top Lists",
              }, {
                id: "mood",
                name: "Mood",
              }],
              limit: 10,
              offset: 0,
              total: 31,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const categories: PagingCategories = await spotify.getBrowseListOfCategories({ offset: 0, limit: 10 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { offset: 0, limit: 10 },
          url: "https://api.spotify.com/v1/browse/categories",
        });
      });

      it("should get list of categories", async () => {
        const categories: PagingCategories = await spotify.getBrowseListOfCategories({ offset: 0, limit: 10 });
        expect(categories.items).to.exist;
        expect(categories.items).to.not.be.empty;
        expect(categories.total).to.exist;
        expect(categories.limit).to.exist;
      });
    });

    describe("getBrowseFeaturedPlaylists", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            message: "Monday morning music, coming right up!",
            playlists: {
              items: [
                {
                  description: "Relaxed deep house to slowly help you get back on your feet and ready yourself for a productive week.",
                  id: "6ftJBzU2LLQcaKefMi7ee7",
                  name: "Monday Morning Mood",
                },
                {
                  description: "Du kommer studsa ur sängen med den här spellistan.",
                  id: "4uOEx4OUrkoGNZoIlWMUbO",
                  name: "Upp och hoppa!",
                },
              ],
              limit: 5,
              offset: 1,
              total: 20,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const featured: FeaturedPlaylists = await spotify.getBrowseFeaturedPlaylists({ offset: 0, limit: 10, timestamp: new Date("2020-01-01") });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { offset: 0, limit: 10, timestamp: "2020-01-01T00:00:00.000Z" },
          url: "https://api.spotify.com/v1/browse/featured-playlists",
        });
      });

      it("should get featured playlists", async () => {
        const featured: FeaturedPlaylists = await spotify.getBrowseFeaturedPlaylists({ offset: 0, limit: 10, timestamp: new Date("2020-01-01") });
        expect(featured.message).to.exist;
        expect(featured.playlists.items).to.not.be.empty;
        expect(featured.playlists.items[0].id).to.exist;
        expect(featured.playlists.total).to.exist;
      });
    });

    describe("getBrowseNewReleases", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            message: "Some cool message here",
            albums: {
              items: [{
                id: "5ZX4m5aVSmWQ5iHAPQpT71",
                name: "Runnin'",
              }, {
                id: "0geTzdk2InlqIoB16fW9Nd",
                name: "Sneakin",
              }],
              limit: 10,
              offset: 0,
              total: 300,
            },
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const featured: FeaturedAlbums = await spotify.getBrowseNewReleases({ offset: 0, limit: 10 });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { offset: 0, limit: 10 },
          url: "https://api.spotify.com/v1/browse/new-releases",
        });
      });

      it("should get albums", async () => {
        const featured: FeaturedAlbums = await spotify.getBrowseNewReleases({ offset: 0, limit: 10 });
        expect(featured.message).to.exist;
        expect(featured.albums.items).to.not.be.empty;
        expect(featured.albums.limit).to.exist;
        expect(featured.albums.offset).to.exist;
      });
    });

    describe("getBrowseRecommendations", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            tracks: [{
              id: "1TKYPzH66GwsqyJFKFkBHQ",
              is_playable: true,
              name: "Music Is Life",
            }, {
              id: "15iosIuxC3C53BgsM5Uggs",
              is_playable: true,
              name: "All Night",
            }],
            seeds: [{
              initialPoolSize: 500,
              afterFilteringSize: 380,
              afterRelinkingSize: 365,
              id: "4NHQUGzhtTLFvgF5SZesLK",
            }],
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const recommendations = await spotify.getBrowseRecommendations({
          seed_tracks: ["4NHQUGzhtTLFvgF5SZesLK", "1VBflYyxBhnDc9uVib98rw"],
          target_loudness: 0.2,
        });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { seed_tracks: "4NHQUGzhtTLFvgF5SZesLK,1VBflYyxBhnDc9uVib98rw", target_loudness: 0.2 },
          url: "https://api.spotify.com/v1/recommendations",
        });
      });

      it("should get recomendations", async () => {
        const recommendations = await spotify.getBrowseRecommendations({
          seed_tracks: ["4NHQUGzhtTLFvgF5SZesLK", "1VBflYyxBhnDc9uVib98rw"],
          target_loudness: 0.2,
        });
        expect(recommendations.seeds).to.not.be.empty;
        expect(recommendations.tracks).to.not.be.empty;
        expect(recommendations.tracks.length).to.eq(2);
      });
    });

    describe("getPlaylists", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            href: "https://api.spotify.com/v1/users/wizzler/playlists",
            items: [
              {
                collaborative: false,
                external_urls: {
                  spotify: "http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
                },
                href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
                id: "53Y8wT46QIMz5H4WQ8O22c",
                images: [],
                name: "Wizzlers Big Playlist",
                owner: {
                  external_urls: {
                    spotify: "http://open.spotify.com/user/wizzler",
                  },
                  href: "https://api.spotify.com/v1/users/wizzler",
                  id: "wizzler",
                  type: "user",
                  uri: "spotify:user:wizzler",
                },
                public: true,
                snapshot_id: "bNLWdmhh+HDsbHzhckXeDC0uyKyg4FjPI/KEsKjAE526usnz2LxwgyBoMShVL+z+",
                tracks: {
                  href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks",
                  total: 30,
                },
                type: "playlist",
                uri: "spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c",
              },
              {
                collaborative: false,
                external_urls: {
                  spotify: "http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju",
                },
                href: "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju",
                id: "1AVZz0mBuGbCEoNRQdYQju",
                images: [],
                name: "Another Playlist",
                owner: {
                  external_urls: {
                    spotify: "http://open.spotify.com/user/wizzlersmate",
                  },
                  href: "https://api.spotify.com/v1/users/wizzlersmate",
                  id: "wizzlersmate",
                  type: "user",
                  uri: "spotify:user:wizzlersmate",
                },
                public: true,
                snapshot_id: "Y0qg/IT5T02DKpw4uQKc/9RUrqQJ07hbTKyEeDRPOo9LU0g0icBrIXwVkHfQZ/aD",
                tracks: {
                  href: "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks",
                  total: 58,
                },
                type: "playlist",
                uri: "spotify:user:wizzlersmate:playlist:1AVZz0mBuGbCEoNRQdYQju",
              },
            ],
            limit: 9,
            next: null,
            offset: 0,
            previous: null,
            total: 9,
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        const playlists = await spotify.getPlaylists("wizzlersmate", {
          limit: 9,
          offset: 0,
        });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: { limit: 9, offset: 0 },
          url: "https://api.spotify.com/v1/users/wizzlersmate/playlists",
        });
      });

      it("should get playlists", async () => {
        const playlists = await spotify.getPlaylists("wizzlersmate", {
          limit: 9,
          offset: 0,
        });
        expect(playlists).to.not.be.empty;
        expect(playlists.items).to.eql([
          {
            collaborative: false,
            external_urls: {
              spotify: "http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
            },
            href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
            id: "53Y8wT46QIMz5H4WQ8O22c",
            images: [],
            name: "Wizzlers Big Playlist",
            owner: {
              external_urls: {
                spotify: "http://open.spotify.com/user/wizzler",
              },
              href: "https://api.spotify.com/v1/users/wizzler",
              id: "wizzler",
              type: "user",
              uri: "spotify:user:wizzler",
            },
            public: true,
            snapshot_id: "bNLWdmhh+HDsbHzhckXeDC0uyKyg4FjPI/KEsKjAE526usnz2LxwgyBoMShVL+z+",
            tracks: {
              href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks",
              total: 30,
            },
            type: "playlist",
            uri: "spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c",
          },
          {
            collaborative: false,
            external_urls: {
              spotify: "http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju",
            },
            href: "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju",
            id: "1AVZz0mBuGbCEoNRQdYQju",
            images: [],
            name: "Another Playlist",
            owner: {
              external_urls: {
                spotify: "http://open.spotify.com/user/wizzlersmate",
              },
              href: "https://api.spotify.com/v1/users/wizzlersmate",
              id: "wizzlersmate",
              type: "user",
              uri: "spotify:user:wizzlersmate",
            },
            public: true,
            snapshot_id: "Y0qg/IT5T02DKpw4uQKc/9RUrqQJ07hbTKyEeDRPOo9LU0g0icBrIXwVkHfQZ/aD",
            tracks: {
              href: "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks",
              total: 58,
            },
            type: "playlist",
            uri: "spotify:user:wizzlersmate:playlist:1AVZz0mBuGbCEoNRQdYQju",
          },
        ]);
        expect(playlists.limit).to.eq(9);
        expect(playlists.offset).to.eq(0);
        expect(playlists.total).to.eq(9);
      });
    });

    describe("createPlaylist", () => {
      beforeEach(() => {
        httpClientStub.resolves({data: "response"});
      });

      it("should call httpClient with correct settings", async () => {
        const playlist = await spotify.createPlaylist("wizzlersmate", {
          name: "Playlist",
          description: "Desc",
          collaborative: false,
          public: true,
        });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          method: "post",
          data: { collaborative: false, description: "Desc", name: "Playlist", public: true },
          url: "https://api.spotify.com/v1/users/wizzlersmate/playlists",
        });
      });

      it("should create playlist", async () => {
        const playlist = await spotify.createPlaylist("wizzlersmate", {
          name: "Playlist",
          description: "Desc",
          collaborative: false,
          public: true,
        });
        expect(playlist).to.eql("response");
      });
    });

    describe("updatePlaylistDetails", () => {
      beforeEach(() => {
        httpClientStub.resolves();
      });

      it("should call httpClient with correct settings", async () => {
        await spotify.updatePlaylistDetails("playlistid", {
          name: "New Playlist",
          description: "New Desc",
          collaborative: true,
          public: false,
        });
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          method: "put",
          data: { collaborative: true, description: "New Desc", name: "New Playlist", public: false },
          url: "https://api.spotify.com/v1/playlists/playlistid",
        });
      });
    });

    describe("addPlaylistTracks", () => {
      beforeEach(() => {
        httpClientStub.resolves();
      });

      it("should call httpClient with correct settings", async () => {
        await spotify.addPlaylistTracks("playlistid", ["uri1", "url2"]);
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          method: "post",
          data: { uris: ["uri1", "url2"] },
          url: "https://api.spotify.com/v1/playlists/playlistid/tracks",
        });
      });
    });

    describe("replacePlaylistTracks", () => {
      beforeEach(() => {
        httpClientStub.resolves();
      });

      it("should call httpClient with correct settings", async () => {
        await spotify.replacePlaylistTracks("playlistid", ["uri1", "url2"]);
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          method: "put",
          data: { uris: ["uri1", "url2"] },
          url: "https://api.spotify.com/v1/playlists/playlistid/tracks",
        });
      });
    });

    describe("unfollowPlaylist", () => {
      beforeEach(() => {
        httpClientStub.resolves();
      });

      it("should call httpClient with correct settings", async () => {
        await spotify.unfollowPlaylist("playlistid");
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          method: "delete",
          params: undefined,
          url: "https://api.spotify.com/v1/playlists/playlistid/followers",
        });
      });
    });

    describe("getUserProfile", () => {
      beforeEach(() => {
        httpClientStub.resolves({
          data: {
            country: "SE",
            display_name: "JM Wizzler",
            email: "email@example.com",
            external_urls: {
              spotify: "https://open.spotify.com/user/wizzler",
            },
            followers: {
              href: null,
              total: 3829,
            },
            href: "https://api.spotify.com/v1/users/wizzler",
            id: "wizzler",
            images: [
              {
                height: null,
                url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/t1.0-1/1970403_10152215092574354_1798272330_n.jpg",
                width: null,
              },
            ],
            product: "premium",
            type: "user",
            uri: "spotify:user:wizzler",
          },
        });
      });

      it("should call httpClient with correct settings", async () => {
        await spotify.getUserProfile("wizzler");
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          method: "get",
          params: undefined,
          url: "https://api.spotify.com/v1/users/wizzler",
        });
      });
    });
  });
});

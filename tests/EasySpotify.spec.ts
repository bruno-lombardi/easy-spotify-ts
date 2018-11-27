import { AxiosResponse } from "axios";
import { expect, use } from "chai";
import "mocha";
import {SinonStub, stub} from "sinon";
import sinonChai = require("sinon-chai");
use(sinonChai);

import EasySpotify from "../src/EasySpotify";
import EasySpotifyConfig from "../src/EasySpotifyConfig";
import { Album } from "../src/models/Album";
import { PagingTracks } from "../src/models/Paging";

const params: any = undefined;
const baseHttpClientConfig = {
  headers: { Authorization: "Bearer token" },
  method: "get",
  params,
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
    // TODO: Add validation to check it's a valid URL
    spotify.setApiUrl("new apiURL");
    expect(spotify.getApiUrl()).to.eq("new apiURL");
  });

  describe("Albums", () => {

    describe("getAlbum", () => {
      let id = "4aawyAB9vmqN3uQ7FjRGTy";

      beforeEach(() => {
        httpClientStub.resolves({ data: {id, name : "Cyndi Lauper"}});
      });

      it("should call httpClient method", async () => {
        const album: Album = await spotify.getAlbum(id);
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient with correct config", async () => {
        const album: Album = await spotify.getAlbum(id, {market: "ES"});
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
        httpClientStub.rejects({response: { status: 400}});
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
        httpClientStub.resolves({ data: {
          albums: [
            {id: "41MnTivkwTO3UUJ8DrqEJJ", name : "Cyndi Lauper"},
            {id: "6JWc4iAiJ9FjyK0B59ABb4", name : "Rock is Good"},
            {id: "6UXCm6bOO4gFlDQZV5yL37", name : "Just a Fake Name"},
          ],
        }});
      });

      it("should call httpClient method", async () => {
        const albums: Album[] = await spotify.getAlbums(ids);
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient with correct config", async () => {
        const albums: Album[] = await spotify.getAlbums(ids, {market: "ES"});
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          // tslint:disable-next-line:max-line-length
          params: {ids: `${ids}`, market: "ES"},
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
        httpClientStub.rejects({response: { status: 400}});
        ids = ["invalid", "id"];
        try {
          await await spotify.getAlbums(ids);
        } catch (err) {
          expect(err.response.status).to.eq(400);
        }
      });

    });

    describe("getAlbumTracks", () => {
      const id = "4aawyAB9vmqN3uQ7FjRGTy";

      beforeEach(() => {
        httpClientStub.resolves({ data: {
          href: "https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks?offset=0&limit=3",
          items: [
            {id: "41MnTivkwTO3UUJ8DrqEJJ", name: "Cyndi Lauper"},
            {id: "6JWc4iAiJ9FjyK0B59ABb4", name: "Rock is Good"},
            {id: "6UXCm6bOO4gFlDQZV5yL37", name: "Just a Fake Name"},
          ],
        }});
      });

      it("should call httpClient method", async () => {
        const albumTracks: PagingTracks = await spotify.getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy");
        expect(httpClientStub).to.have.been.calledOnce;
      });

      it("should call httpClient method with correct config", async () => {
        const albumTracks: PagingTracks = await spotify.getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy", {limit: 3, offset: 0});
        expect(httpClientStub).to.have.been.calledWith({
          ...baseHttpClientConfig,
          params: {limit: 3, offset: 0},
          url: "https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy/tracks",
        });
      });
    });
  });
});

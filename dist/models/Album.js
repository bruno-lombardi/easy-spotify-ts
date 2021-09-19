"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
var Album = /** @class */ (function () {
    function Album(response) {
        this.album_type = response.album_type;
        this.artists = response.artists;
        this.available_markets = response.available_markets;
        this.copyrights = response.available_markets;
        this.external_ids = response.external_ids;
        this.external_urls = response.external_urls;
        this.genres = response.genres;
        this.href = response.href;
        this.id = response.id;
        this.images = response.images;
        this.name = response.name;
        this.popularity = response.popularity;
        this.release_date = response.release_date;
        this.release_date_precision = response.release_date_precision;
        this.tracks = response.tracks;
        this.type = response.type;
        this.uri = response.uri;
    }
    return Album;
}());
exports.Album = Album;

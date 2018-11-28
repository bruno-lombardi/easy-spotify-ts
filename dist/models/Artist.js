"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Artist = /** @class */ (function () {
    function Artist(response) {
        this.external_urls = response.external_urls;
        this.href = response.href;
        this.id = response.id;
        this.name = response.name;
        this.type = response.type;
        this.uri = response.type;
        this.followers = response.followers;
        this.genres = response.genres;
        this.images = response.images;
        this.popularity = response.popularity;
    }
    return Artist;
}());
exports.Artist = Artist;

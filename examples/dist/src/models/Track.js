"use strict";
exports.__esModule = true;
var Track = /** @class */ (function () {
    function Track(response) {
        this.album = response.album;
        this.artists = response.artists;
        this.available_markets = response.available_markets;
        this.disc_number = response.disc_number;
        this.duration_ms = response.duration_ms;
        this.explicit = response.explicit;
        this.external_ids = response.external_ids;
        this.external_urls = response.external_urls;
        this.href = response.href;
        this.id = response.id;
        this.is_playable = response.is_playable;
        this.linked_from = response.linked_from;
        this.name = response.name;
        this.restrictions = response.restrictions;
        this.popularity = response.popularity;
        this.preview_url = response.preview_url;
        this.track_number = response.track_number;
        this.type = response.type;
        this.uri = response.uri;
    }
    return Track;
}());
exports.Track = Track;

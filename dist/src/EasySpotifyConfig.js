"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var API_URL = "https://api.spotify.com/v1";
var EasySpotifyConfig = /** @class */ (function () {
    function EasySpotifyConfig(token, apiURL) {
        if (apiURL === void 0) { apiURL = API_URL; }
        this.token = token;
        this.apiURL = apiURL;
    }
    return EasySpotifyConfig;
}());
exports.default = EasySpotifyConfig;
//# sourceMappingURL=EasySpotifyConfig.js.map
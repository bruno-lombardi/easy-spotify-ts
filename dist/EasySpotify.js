"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EasySpotify = /** @class */ (function () {
    function EasySpotify(config) {
        this.config = config;
    }
    EasySpotify.prototype.setToken = function (token) {
        if (token.trim() === '')
            throw new Error('Cannot set an empty token');
        this.config.token = token;
    };
    EasySpotify.prototype.setApiUrl = function (apiURL) {
        if (apiURL.trim() === '')
            throw new Error('Cannot set an empty API Url');
        this.config.apiURL = apiURL;
    };
    EasySpotify.prototype.buildHeaders = function () {
        return {
            headers: {
                Authorization: "Bearer " + this.config.token
            }
        };
    };
    return EasySpotify;
}());
exports.default = EasySpotify;
//# sourceMappingURL=EasySpotify.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EasySpotify {
    constructor(config) {
        this.config = config;
    }
    setToken(token) {
        if (token.trim() === '')
            throw new Error('Cannot set an empty token');
        this.config.token = token;
    }
    setApiUrl(apiURL) {
        if (apiURL.trim() === '')
            throw new Error('Cannot set an empty API Url');
        this.config.apiURL = apiURL;
    }
}
exports.default = EasySpotify;
//# sourceMappingURL=EasySpotify.js.map
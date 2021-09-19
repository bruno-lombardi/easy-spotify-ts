"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = void 0;
var SpotifyError_1 = require("./SpotifyError");
var handleResponse = function (response) {
    if (response.status === 200) {
        return response.data;
    }
    throw new SpotifyError_1.SpotifyError(response.data.error);
};
exports.handleResponse = handleResponse;

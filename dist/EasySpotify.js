"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var models_1 = require("./models");
var utils_1 = require("./utils");
var EasySpotify = /** @class */ (function () {
    function EasySpotify(config) {
        this.config = config;
        this.httpClient = axios_1.default.create({
            validateStatus: function (status) { return status < 500; }
        });
    }
    EasySpotify.prototype.setToken = function (token) {
        if (token.trim() === '') {
            throw new Error('Cannot set an empty token');
        }
        this.config.token = token;
    };
    EasySpotify.prototype.setApiUrl = function (apiURL) {
        if (apiURL.trim() === '') {
            throw new Error('Cannot set an empty API Url');
        }
        this.config.apiURL = apiURL;
    };
    EasySpotify.prototype.getToken = function () {
        return this.config.token;
    };
    EasySpotify.prototype.getApiUrl = function () {
        return this.config.apiURL;
    };
    EasySpotify.prototype.getAlbum = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("albums/" + id, options)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, new models_1.Album(data)];
                }
            });
        });
    };
    EasySpotify.prototype.getAlbums = function (ids, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest('albums', __assign({ ids: "" + ids }, options))];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.albums.map(function (album) { return new models_1.Album(album); })];
                }
            });
        });
    };
    EasySpotify.prototype.getAlbumTracks = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("albums/" + id + "/tracks", options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getArtist = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("artists/" + id)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, new models_1.Artist(data)];
                }
            });
        });
    };
    EasySpotify.prototype.getArtists = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest('artists', {
                            ids: "" + ids
                        })];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.artists.map(function (artist) { return new models_1.Artist(artist); })];
                }
            });
        });
    };
    EasySpotify.prototype.getArtistAlbums = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("artists/" + id + "/albums", options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getArtistTopTracks = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("artists/" + id + "/top-tracks", options)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.tracks.map(function (track) { return new models_1.Track(track); })];
                }
            });
        });
    };
    EasySpotify.prototype.getArtistRelatedArtists = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("artists/" + id + "/related-artists")];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.artists.map(function (artist) { return new models_1.Artist(artist); })];
                }
            });
        });
    };
    EasySpotify.prototype.searchAlbums = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = __assign(__assign({}, options), { q: query, type: 'album' });
                        return [4 /*yield*/, this.buildRequest('search', params)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.albums];
                }
            });
        });
    };
    EasySpotify.prototype.searchArtists = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = __assign(__assign({}, options), { q: query, type: 'artist' });
                        return [4 /*yield*/, this.buildRequest('search', params)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.artists];
                }
            });
        });
    };
    EasySpotify.prototype.searchPlaylists = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = __assign(__assign({}, options), { q: query, type: 'playlist' });
                        return [4 /*yield*/, this.buildRequest('search', params)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.playlists];
                }
            });
        });
    };
    EasySpotify.prototype.searchTracks = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = __assign(__assign({}, options), { q: query, type: 'track' });
                        return [4 /*yield*/, this.buildRequest('search', params)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.tracks];
                }
            });
        });
    };
    EasySpotify.prototype.search = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest('search', __assign(__assign({}, options), { q: query }))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseNewReleases = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest('browse/new-releases', options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseFeaturedPlaylists = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (options.timestamp) {
                            Object.assign(options, { timestamp: options.timestamp.toISOString() });
                        }
                        return [4 /*yield*/, this.buildRequest('browse/featured-playlists', options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseListOfCategories = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest('browse/categories', options)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.categories];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseCategory = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("browse/categories/" + id, options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseCategoryPlaylists = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("browse/categories/" + id + "/playlists", options)];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.playlists];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseRecommendations = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (query.seed_artists && query.seed_artists.length) {
                            Object.assign(query, {
                                seed_artists: query.seed_artists.join(',')
                            });
                        }
                        if (query.seed_genres && query.seed_genres.length) {
                            Object.assign(query, {
                                seed_genres: query.seed_genres.join(',')
                            });
                        }
                        if (query.seed_tracks && query.seed_tracks.length) {
                            Object.assign(query, {
                                seed_tracks: query.seed_tracks.join(',')
                            });
                        }
                        return [4 /*yield*/, this.buildRequest('recommendations', query)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseRecommendationGenres = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest('recommendations/available-genre-seeds')];
                    case 1:
                        response = _a.sent();
                        data = (0, utils_1.handleResponse)(response);
                        return [2 /*return*/, data.genres];
                }
            });
        });
    };
    EasySpotify.prototype.getCurrentUserPlaylists = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest('me/playlists', options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getUserPlaylists = function (userId, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("users/" + userId + "/playlists", options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.createPlaylist = function (userId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("users/" + userId + "/playlists", params, 'POST')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getPlaylist = function (playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("playlists/" + playlistId)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.updatePlaylistDetails = function (playlistId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("playlists/" + playlistId, params, 'PUT')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.addPlaylistTracks = function (playlistId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/tracks", params, 'POST')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.replacePlaylistTracks = function (playlistId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/tracks", params, 'PUT')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.removeTracksFromPlaylist = function (playlistId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var requestParams, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestParams = {
                            tracks: params.uris.map(function (uri) { return ({ uri: uri }); })
                        };
                        if (params.snapshot_id) {
                            requestParams = __assign(__assign({}, requestParams), { snapshot_id: params.snapshot_id });
                        }
                        return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/tracks", requestParams, 'DELETE')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getPlaylistCoverImage = function (playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/images")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.uploadCustomPlaylistCoverImage = function (playlistId, imageBase64) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/images", imageBase64, 'PUT', { 'Content-Type': 'image/jpeg' })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.unfollowPlaylist = function (playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/followers", undefined, 'DELETE')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.getUserProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = userId ? "users/" + userId : 'me';
                        return [4 /*yield*/, this.buildRequest(endpoint)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.handleResponse)(response)];
                }
            });
        });
    };
    EasySpotify.prototype.buildRequest = function (endpoint, params, method, headers) {
        var _this = this;
        if (method === void 0) { method = 'GET'; }
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                var payloadKey = ['PUT', 'POST', 'PATCH', 'DELETE'].some(function (m) { return m === method; })
                    ? 'data'
                    : 'params';
                var request = {
                    headers: __assign(__assign({}, _this.buildHeaders()), headers),
                    method: method,
                    url: _this.getApiUrl() + "/" + endpoint
                };
                if (params) {
                    request = __assign(__assign({}, request), (_a = {}, _a[payloadKey] = params, _a));
                }
                _this.httpClient(request).then(resolve, function (e) {
                    var _a, _b;
                    var retryAfter = ((_a = e.response) === null || _a === void 0 ? void 0 : _a.headers)
                        ? (_b = e.response) === null || _b === void 0 ? void 0 : _b.headers['retry-after']
                        : null;
                    if (retryAfter) {
                        setTimeout(function () {
                            _this.buildRequest(endpoint, params, method).then(resolve, reject);
                        }, (retryAfter + 1) * 1000);
                    }
                    else {
                        reject(e);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    EasySpotify.prototype.buildHeaders = function () {
        return {
            Authorization: "Bearer " + this.config.token,
            'Content-Type': 'application/json'
        };
    };
    return EasySpotify;
}());
exports.default = EasySpotify;

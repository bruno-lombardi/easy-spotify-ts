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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var EasySpotify = /** @class */ (function () {
    function EasySpotify(config) {
        this.config = config;
        this.httpClient = axios_1.default;
    }
    EasySpotify.prototype.setToken = function (token) {
        if (token.trim() === "") {
            throw new Error("Cannot set an empty token");
        }
        this.config.token = token;
    };
    EasySpotify.prototype.setApiUrl = function (apiURL) {
        if (apiURL.trim() === "") {
            throw new Error("Cannot set an empty API Url");
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
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("albums/" + id, options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, new models_1.Album(response.data)];
                        }
                        else {
                            throw new Error("Could not find any album with that id");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getAlbums = function (ids, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, albums, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("albums", __assign({ ids: "" + ids }, options))];
                    case 1:
                        response = _a.sent();
                        if (response.data.albums) {
                            albums = response.data.albums.map(function (album) {
                                return new models_1.Album(album);
                            });
                            return [2 /*return*/, albums];
                        }
                        else {
                            throw new Error("Could not find any albums with provided ids");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getAlbumTracks = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("albums/" + id + "/tracks", options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        else {
                            throw new Error("Could not find any tracks for provided id");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getArtist = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("artists/" + id)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getArtists = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var response, artists, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("artists", { ids: "" + ids })];
                    case 1:
                        response = _a.sent();
                        if (response.data.artists) {
                            artists = response.data.artists.map(function (artist) {
                                return new models_1.Artist(artist);
                            });
                            return [2 /*return*/, artists];
                        }
                        else {
                            throw new Error("No artists found");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getArtistAlbums = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("artists/" + id + "/albums", options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        else {
                            throw new Error("Could not find any tracks for provided id");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getArtistTopTracks = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, tracks, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("artists/" + id + "/top-tracks", options)];
                    case 1:
                        response = _a.sent();
                        if (response.data.tracks) {
                            tracks = response.data.tracks.map(function (track) {
                                return new models_1.Track(track);
                            });
                            return [2 /*return*/, tracks];
                        }
                        else {
                            throw new Error("Could not find any tracks for provided id");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getArtistRelatedArtists = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, artists, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("artists/" + id + "/related-artists")];
                    case 1:
                        response = _a.sent();
                        if (response.data.artists) {
                            artists = response.data.artists.map(function (artist) {
                                return new models_1.Artist(artist);
                            });
                            return [2 /*return*/, artists];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_8 = _a.sent();
                        throw err_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.searchAlbums = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = __assign({}, options, { q: query, type: "album" });
                        return [4 /*yield*/, this.buildRequest("search", params)];
                    case 1:
                        response = _a.sent();
                        if (response.data.albums) {
                            return [2 /*return*/, response.data.albums];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_9 = _a.sent();
                        throw err_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.searchArtists = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = __assign({}, options, { q: query, type: "artist" });
                        return [4 /*yield*/, this.buildRequest("search", params)];
                    case 1:
                        response = _a.sent();
                        if (response.data.artists) {
                            return [2 /*return*/, response.data.artists];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_10 = _a.sent();
                        throw err_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.searchPlaylists = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = __assign({}, options, { q: query, type: "playlist" });
                        return [4 /*yield*/, this.buildRequest("search", params)];
                    case 1:
                        response = _a.sent();
                        if (response.data.playlists) {
                            return [2 /*return*/, response.data.playlists];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_11 = _a.sent();
                        throw err_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.searchTracks = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = __assign({}, options, { q: query, type: "track" });
                        return [4 /*yield*/, this.buildRequest("search", params)];
                    case 1:
                        response = _a.sent();
                        if (response.data.tracks) {
                            return [2 /*return*/, response.data.tracks];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_12 = _a.sent();
                        throw err_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.search = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("search", __assign({}, options, { q: query }))];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_13 = _a.sent();
                        throw err_13;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseCategory = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("browse/categories/" + id, options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, new models_1.Category(response.data)];
                        }
                        else {
                            throw new Error("Could not find any category with that id");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_14 = _a.sent();
                        throw err_14;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseCategoryPlaylists = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("browse/categories/" + id + "/playlists", options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data.playlists];
                        }
                        else {
                            throw new Error("Could not find any playlist from that category id");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_15 = _a.sent();
                        throw err_15;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseListOfCategories = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("browse/categories", options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data.categories];
                        }
                        else {
                            throw new Error("Could not get any categories");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_16 = _a.sent();
                        throw err_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseFeaturedPlaylists = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (options.timestamp) {
                            Object.assign(options, { timestamp: options.timestamp.toISOString() });
                        }
                        return [4 /*yield*/, this.buildRequest("browse/featured-playlists", options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        else {
                            throw new Error("Could not get any featured playlists");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_17 = _a.sent();
                        throw err_17;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseNewReleases = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("browse/new-releases", options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        else {
                            throw new Error("Could not get any albums");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_18 = _a.sent();
                        throw err_18;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getBrowseRecommendations = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (query.seed_artists && query.seed_artists.length) {
                            Object.assign(query, {
                                seed_artists: query.seed_artists.join(","),
                            });
                        }
                        if (query.seed_genres && query.seed_genres.length) {
                            Object.assign(query, {
                                seed_genres: query.seed_genres.join(","),
                            });
                        }
                        if (query.seed_tracks && query.seed_tracks.length) {
                            Object.assign(query, {
                                seed_tracks: query.seed_tracks.join(","),
                            });
                        }
                        return [4 /*yield*/, this.buildRequest("recommendations", query)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        else {
                            throw new Error("Could not get any recommendations");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_19 = _a.sent();
                        throw err_19;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getPlaylists = function (userId, options) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response, err_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        endpoint = userId ? "users/" + userId + "/playlists" : "me/playlists";
                        return [4 /*yield*/, this.buildRequest(endpoint, options)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_20 = _a.sent();
                        throw err_20;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.createPlaylist = function (userId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("users/" + userId + "/playlists", params, "post")];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_21 = _a.sent();
                        throw err_21;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.updatePlaylistDetails = function (playlistId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var err_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("playlists/" + playlistId, params, "put")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_22 = _a.sent();
                        throw err_22;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.replacePlaylistTracks = function (playlistId, uris) {
        return __awaiter(this, void 0, void 0, function () {
            var err_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/tracks", { uris: uris }, "put")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_23 = _a.sent();
                        throw err_23;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.unfollowPlaylist = function (playlistId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.buildRequest("playlists/" + playlistId + "/followers", undefined, "delete")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_24 = _a.sent();
                        throw err_24;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.getUserProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response, err_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        endpoint = userId ? "users/" + userId : "me";
                        return [4 /*yield*/, this.buildRequest(endpoint)];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            return [2 /*return*/, response.data];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_25 = _a.sent();
                        throw err_25;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EasySpotify.prototype.buildRequest = function (endpoint, params, method) {
        var _this = this;
        if (method === void 0) { method = "get"; }
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                var paramsKey = ["put", "post", "patch"].some(function (m) { return m === method.toLowerCase(); }) ? "data" : "params";
                _this.httpClient((_a = {
                        headers: _this.buildHeaders(),
                        method: method
                    },
                    _a[paramsKey] = params,
                    _a.url = _this.getApiUrl() + "/" + endpoint,
                    _a)).then(resolve, function (e) {
                    var retryAfter = e.response && e.response.headers["retry-after"];
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
            "Authorization": "Bearer " + this.config.token,
            "Content-Type": "application/json",
        };
    };
    return EasySpotify;
}());
exports.default = EasySpotify;

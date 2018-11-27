"use strict";
exports.__esModule = true;
/**
 * The imports are relative to the project scope
 * If you to import this way in your own project, it will never work
 */
var EasySpotify_1 = require("../src/EasySpotify");
var EasySpotifyConfig_1 = require("../src/EasySpotifyConfig");
/**
 * You should instantiate this way
 * If you don't have a token at the moment of initialization, just pass an empty string
 */
var spotify = new EasySpotify_1["default"](new EasySpotifyConfig_1["default"]("token"));
/**
 * Get a valid token through Spotify authorization
 * See how here: https://developer.spotify.com/documentation/general/guides/authorization-guide/
 */
spotify.setToken("your-token-here");
/**
 * Get albums example with then
 * Works with await too, it's just a regular Promise
 */
// spotify.getAlbums(["382ObEPsp2rxGrnsizN5TX", "1A2GTWGtFfWp7KSQTwWOyo"], {market: "ES"}).then((albums) => {
//   console.log(albums);
// }).catch((error) => {
//   console.log(error);
// });

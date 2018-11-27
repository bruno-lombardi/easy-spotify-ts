/**
 * The imports are relative to the project scope
 * If you to import this way in your own project, it will never work
 */
import EasySpotify from "../src/EasySpotify";
import EasySpotifyConfig from "../src/EasySpotifyConfig";
import { Album } from "../src/models/Album";

/**
 * You should instantiate this way
 * If you don't have a token at the moment of initialization, just pass an empty string
 */
const spotify = new EasySpotify(new EasySpotifyConfig("token"));
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


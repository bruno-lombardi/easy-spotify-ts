# EasySpotifyTS - A Spotify Web Api TS Wrapper
This is a TypeScript library that wraps [Spotify Web API](https://developer.spotify.com/documentation/web-api/) to make your life easier. It's still not published and in **development**. See [features list](#features) to check what else I plan to add to this library.

![Demo](demo.gif)

There is also a [JS version here](https://github.com/bruno-lombardi/easy-spotify/).

## Installation and Usage
This library is easier than the JS version to use, because it doesn't have any external dependencies. Also, if you like **type hints**, or **intellisense**, here you get them evem for responses that come from Spotify.

### NodeJS Environment

Install [easy-spotify-ts](https://www.npmjs.com/package/easy-spotify-ts), and then just import and use the library: 

`terminal`
```sh
$ npm install easy-spotify-ts --save
```
`app.js`
```js
const { EasySpotify, EasySpotifyConfig } = require("easy-spotify-ts");

const spotify = new EasySpotify(new EasySpotifyConfig("your-api-token"));

// Get multiple albums!
spotify.getAlbums(["382ObEPsp2rxGrnsizN5TX", "1A2GTWGtFfWp7KSQTwWOyo"], {market: "ES"}).then((albums) => {
  // do something with albums
  console.log(albums);
}).catch((error) => {
  // catch an error, like invalid token or invalid request
  console.log(error);
});

```

## Methods available
### getAlbum(id: string, options?: GetAlbumOptions): Promise\<Album\>
This method returns an album object with the provided id.
> Check [official documentation page](https://developer.spotify.com/documentation/web-api/reference/albums/get-album/)
```ts
const album = await spotify.getAlbum("382ObEPsp2rxGrnsizN5TX", {market: "ES"});
// do something with the data
// album.tracks.items[0].preview_url
```

### getAlbums(ids: string[], options?: GetAlbumOptions): Promise\<Album[]\>
This method returns an array of album objects with the provided ids.
> Check [official documentation page](https://developer.spotify.com/documentation/web-api/reference/albums/get-several-albums/)
```ts
const albums = await spotify.getAlbums(["382ObEPsp2rxGrnsizN5TX", "1A2GTWGtFfWp7KSQTwWOyo"], {market: "ES"});
// do something with the albums
// albums[0].tracks.items[0].name
```
### getAlbumTracks(id: string, options?: GetAlbumTracksOptions): Promise\<PagingTracks\>
This method returns a paging object with the tracks for an album given it's id. Tracks are in items property.
> Check [official documentation page](https://developer.spotify.com/documentation/web-api/reference/albums/get-albums-tracks/)
```ts
const tracks = await spotify.getAlbumTracks("1A2GTWGtFfWp7KSQTwWOyo", {limit: 10, offset: 1, market: "ES"});
// do something with the albums
// tracks.total
// tracks.limit
// tracks.items[0].artists[1].name
```
### getArtist(id: string): Promise\<Artist\>
This method returns an complete artist object for the given id.
> Check [official documentation page](https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/)
```ts
const artist = await spotify.getArtist("0OdUWJ0sBjDrqHygGUXeCF");
// do something with the artist
// artist.id
// artist.genres
// artist.followers.total
```
### getArtists(id: string[]): Promise\<Artist[]\>
This method returns an array of artist objects for the given ids.
> Check [official documentation page](https://developer.spotify.com/documentation/web-api/reference/artists/get-several-artists/)
```ts
const artists = await spotify.getArtists(["0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin"]);
// do something with the artists
// artists[0].id
// artist[2].genres
// artist[1].followers.total
```
### getArtistAlbums(id: string, options?: GetArtistAlbumsOptions): Promise\<PagingAlbums\>
This method returns an array of simplified album objects for the given artist id.
> Check [official documentation page](https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/)
```ts
const artistAlbums = await spotify.getArtistAlbums("4aawyAB9vmqN3uQ7FjRGTy", { 
  include_groups: "appears_on", 
  limit: 3, 
  offset: 0, 
  market: "ES"
});
// do something with the albums
// artistAlbums.items.length
// artistAlbums.items[0].id
// artistAlbums.offset
```

## <a name="features"></a> Features to implement
- [ ] Support Search endpoints
- [ ] Support Artists endpoints
- [ ] Support Browse endpoints
- [ ] Support Follow endpoints
- [ ] Support Library endpoints
- [ ] Support Personalization endpoints
- [ ] Support Player endpoints
- [ ] Support Playlists endpoints
- [ ] Support Tracks endpoints
- [ ] Support User Profiles endpoints

## Authors

| ![Bruno Lombardi](https://avatars2.githubusercontent.com/u/7153294?s=150&v=4)|
|:---------------------:|
|  [Bruno Lombardi](https://github.com/bruno-lombardi)   |

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
# EasySpotifyTS - A Spotify Web Api TS Wrapper
<p align="center">
  <img><a href="https://nodei.co/npm/easy-spotify-ts/"><img src="https://nodei.co/npm/easy-spotify-ts.png"></a>
</p>

[![codecov](https://codecov.io/gh/bruno-lombardi/easy-spotify-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/bruno-lombardi/easy-spotify-ts)

This is a Javascript library written in Typescript that wraps [Spotify Web API](https://developer.spotify.com/documentation/web-api/) to make your spotify responses and requests benefit from autocompletion. It's still not published and in **development**. See [features list](#features) to check what else I plan to add to this library.

![Demo](demo.gif)

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

### getArtistTopTracks(id: string, options?: GetAlbumOptions): Promise\<Track[]\>
This method returns an array of up to 10 top Track objects for the given artist id.
> Check official [documentation page](https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-top-tracks/)
```ts
const topTracks = await spotfiy.getArtistTopTracks("43ZHCT0cAZBISjO8DG9PnE", {market: "SE"});
// do something with tracks
// topTracks[0].name
// topTracks[2].disc_number
// topTracks[9].preview_url
```

### getArtistRelatedArtists(id: string): Promise<Artist[]>
This method returns an array of related artists for the given artist id.
> Check official [documentation page](https://developer.spotify.com/documentation/web-api/reference/artists/get-related-artists/)
```ts
const relatedArtists = await spotfiy.getArtistRelatedArtists("43ZHCT0cAZBISjO8DG9PnE");
// do something with artists
// relatedArtists[0].followers.total
// relatedArtists[1].images[0].url
// relatedArtists[3].genres[0]
```

### searchAlbums(query: string, options?: OptionalRequestParams): Promise\<PagingAlbums\>
This method returns an paging object of albums for the given query.
> Check official [documentation page](https://developer.spotify.com/documentation/web-api/reference/search/search/)
```ts
const albums = await spotify.searchAlbums("Rock", {limit: 2});

// do something with albums
// albums.items[0].id
// albums.items[1].artists
```

### searchArtists(query: string, options?: OptionalRequestParams): Promise\<PagingArtists\>
This method returns an paging object of artists for the given query.
> Check official [documentation page](https://developer.spotify.com/documentation/web-api/reference/search/search/)
```ts
const artists = await spotify.searchArtists("Elvis", {limit: 2});

// do something with artists
// artists.items[0].name
// artists.items[1].uri
```

### searchPlaylists(query: string, options?: OptionalRequestParams): Promise\<PagingPlaylists\>
This method returns an paging object of playlists for the given query.
> Check official [documentation page](https://developer.spotify.com/documentation/web-api/reference/search/search/)
```ts
const playlists = await spotify.searchPlaylists("abba", {limit: 2, market: "US"});

// do something with playlists
// playlists.items[0].tracks
// playlists.items[1].owner
```

### searchTracks(query: string, options?: OptionalRequestParams): Promise\<PagingTracks\>
This method returns an paging object of tracks for the given query.
> Check official [documentation page](https://developer.spotify.com/documentation/web-api/reference/search/search/)
```ts
const tracks = await spotify.searchTracks("love", {limit: 2});

// do something with playlists
// tracks.items[0].artists
// tracks.items[1].preview_url
```

### search(query: string, options: SearchRequestParams): Promise\<PagingSearch\>
This method returns an object that may contain albums, artists, playlists or tracks paging object. Under options, 
you should define the type as comma-separated list of wich ones you want (in singular).
> Check official [documentation page](https://developer.spotify.com/documentation/web-api/reference/search/search/)
```ts
const result = await spotify.search("love", {type: "artist,playlist", limit: 2});

// do something with result
// result.artists.items[0].id
// result.playlists.total
// result.playlists.items[0].name
// result.tracks -> undefined
// result.albums -> undefined
```


## <a name="features"></a> Features to implement
- [x] Support Search endpoint
- [x] Support Artists endpoints
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
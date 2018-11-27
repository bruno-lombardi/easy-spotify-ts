# EasySpotifyTS - A Spotify Web Api TS Wrapper
This is a TypeScript library that wraps [Spotify Web API](https://developer.spotify.com/documentation/web-api/) to make your life easier. It's still not published and in **development**. See [features list](#features) to check what else I plan to add to this library.

![Demo](demo.gif)

There is also a [JS version here](https://github.com/bruno-lombardi/easy-spotify/).

## Installation and Usage
This library is easier than the JS version to use, because it doesn't have any external dependencies. Also, if you like **type hints**, or **intellisense**, here you get them evem for responses that come from Spotify.

### TypeScript environment

Install [easy-spotify-ts](https://www.npmjs.com/package/easy-spotify-ts), and then just import and use the library: 

`terminal`
```sh
$ npm install node-fetch easy-spotify --save
```
`app.ts`
```ts
import { EasySpotify, EasySpotifyConfig } from "easy-spotify-ts";
import { Album } from "easy-spotify-ts/models";

const spotify = new EasySpotify(new EasySpotifyConfig("your-api-token"));

// Get multiple albums!
spotify.getAlbums(["382ObEPsp2rxGrnsizN5TX", "1A2GTWGtFfWp7KSQTwWOyo"], {market: "ES"}).then((albums) => {
  console.log(albums);
}).catch((error) => {
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
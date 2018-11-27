# EasySpotifyTS - A Spotify Web Api TS Wrapper
# Still in development, not really usable now
This is a TypeScript library that wraps [Spotify Web API](https://developer.spotify.com/documentation/web-api/) to make your life easier. It's still not published and in **development**.

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

# easy-spotify-ts

[![CI](https://github.com/bruno-lombardi/easy-spotify-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/bruno-lombardi/easy-spotify-ts/actions/workflows/ci.yml)

A TypeScript client for the Spotify Web API, with typed responses, current-user
playlist operations and explicit support for Spotify quota modes.

The repository is being updated for the current API. These changes are not yet
published to npm; version 0.3.0 has not been bumped. Node.js **>=22.13.0** is required;
Node 24 is recommended. CommonJS and native ESM named imports are supported.

## Usage

```sh
npm install easy-spotify-ts
```

The following examples describe this checkout's API, which differs from the
previously published version. Obtain an OAuth access token with the scopes your
operations require; the client does not obtain or refresh tokens automatically.

```ts
import { EasySpotify, EasySpotifyConfig } from 'easy-spotify-ts'

const spotify = new EasySpotify(new EasySpotifyConfig('your-access-token'))
const profile = await spotify.getCurrentUserProfile()
const tracks = await spotify.searchTracks('Miles Davis', { limit: 10 })
const playlists = await spotify.getCurrentUserPlaylists({ limit: 20 })

console.log(profile.account_id, tracks.items, playlists.items)
```

## Playlists

```ts
const playlist = await spotify.createPlaylist({
  name: 'My discoveries',
  public: false
})

await spotify.addPlaylistItems(playlist.id, {
  uris: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh']
})

const page = await spotify.getPlaylistItems(playlist.id, { limit: 50 })
for (const entry of page.items) {
  // An unavailable item can be null. Episodes and tracks share these fields.
  if (entry?.item) console.log(entry.item.type, entry.item.name)
}

await spotify.updatePlaylistItems(playlist.id, {
  range_start: 0,
  insert_before: 1
})

await spotify.removePlaylistItems(playlist.id, {
  items: [{ uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' }]
})
```

Playlist content is only available where Spotify permits access. Metadata-only
responses may omit `playlist.items`. Check before using it. The old methods
`addPlaylistTracks`, `replacePlaylistTracks` and `removeTracksFromPlaylist`
remain deprecated aliases using the new routes and payloads.

## Available methods

| Area | Methods |
| --- | --- |
| Albums | `getAlbum`, `getAlbums`, `getAlbumTracks` |
| Artists | `getArtist`, `getArtists`, `getArtistAlbums` |
| Search | `search`, `searchAlbums`, `searchArtists`, `searchTracks`, `searchPlaylists` |
| Current user | `getCurrentUserProfile`, `getUserProfile()`, `getCurrentUserPlaylists` |
| Playlists | `createPlaylist(params)`, `getPlaylist`, `getPlaylistItems`, `updatePlaylistDetails`, `addPlaylistItems`, `updatePlaylistItems`, `removePlaylistItems` |
| Covers | `getPlaylistCoverImage`, `uploadCustomPlaylistCoverImage` |
| Library | `saveLibraryItems`, `removeLibraryItems`, `checkLibraryItems`, `unfollowPlaylist` |

`getAlbums` and `getArtists` fetch individual resources with at most three
requests in flight, preserving order and duplicates. A failed resource rejects the
operation. Search accepts up to 10 results per type in Development Mode and offset
up to 1000. Playlist mutations accept up to 100 items; library operations accept
up to 40 URIs per request. Use offsets to request additional pages.

## Quota modes and migration

Development Mode is the default. Unsupported methods reject with
`SpotifyUnsupportedEndpointError` before making HTTP requests. They are not
silently replaced with a different discovery algorithm.

For an app that Spotify has actually granted Extended Quota access:

```ts
const spotify = new EasySpotify(
  new EasySpotifyConfig('your-access-token', { quotaMode: 'extended' })
)
```

This setting does not grant access or bypass Spotify restrictions. Legacy browse,
recommendations, artist top/related tracks and other-user methods are retained
for eligible apps. See the [API migration guide](docs/spotify-api-migration.md)
for method replacements, response changes, scopes and official references.

## Errors and types

`SpotifyError` exposes HTTP `status` and Spotify's optional `reason`.
Quota exhaustion (`QUOTA_EXCEEDED`) is returned without automatic retries.
Other 429 responses with a valid Retry-After are retried at most twice. Network
and 5xx failures currently retain Axios error behavior.

Models and request types are exported from the package root. Legacy metadata may
be absent; pagination links and previews may be null. Selecting `fields` can omit
otherwise required properties, so use only the fields you requested.

## Development

```sh
npm ci
npm run check
npm run test:coverage
npm pack --dry-run
```

`npm run lint` checks without modifying files. Use `npm run lint:fix` or
`npm run format` to apply changes. Packing validates and builds automatically;
`dist/` is generated rather than maintained in Git.

`@types/node` is a development dependency. Tests and examples have their own
TypeScript project configs for VS Code, and workspace settings point to the
installed compiler. If diagnostics persist after installing dependencies, choose
**TypeScript: Select TypeScript Version ? Use Workspace Version**, then run
**TypeScript: Restart TS Server**.

To run the read-only example, set `SPOTIFY_ACCESS_TOKEN` and run `npm run example`.
An optional `SPOTIFY_SEARCH_QUERY` changes the search text.

See the [maintenance audit](docs/maintenance-audit.md) for the tooling baseline.

## License

[MIT](LICENSE.md) ? Bruno Lombardi.

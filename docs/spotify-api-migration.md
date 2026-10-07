# Spotify API migration

This checkout targets current-user workflows in Development Mode by default.
The package version has not been bumped or published. Treat the changes below as
a breaking migration from 0.3.0, including stricter response types and validation.

## Configuration

```ts
const spotify = new EasySpotify(new EasySpotifyConfig(token))

// Only for an app with Extended Quota access granted by Spotify:
const extended = new EasySpotify(
  new EasySpotifyConfig(token, { quotaMode: 'extended' })
)

// The previous custom API URL constructor is still supported:
const custom = new EasySpotify(
  new EasySpotifyConfig(token, apiURL, { quotaMode: 'extended' })
)
```

Quota mode is declared by the caller, not detected from the access token. It does
not change Spotify permissions. Extended mode enables legacy methods and retains
their historical search limit; an HTTP error is still possible if the app lacks
the specific entitlement. See [quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

## Existing methods

| Previous call | Current behavior / replacement |
| --- | --- |
| `getAlbums(ids)`, `getArtists(ids)` | Individual metadata fetches, up to three concurrent requests, ordered results. No removed batch routes. |
| `createPlaylist(userId, params)` | Use `createPlaylist(params)` for the authenticated user. The ID overload remains restricted to Extended Quota. |
| `addPlaylistTracks(id, params)` | Deprecated alias of `addPlaylistItems(id, params)`. |
| `replacePlaylistTracks(id, params)` | Deprecated alias of `updatePlaylistItems(id, params)`. |
| `removeTracksFromPlaylist(id, { uris })` | Deprecated alias converting URIs into `removePlaylistItems(id, { items })`. |
| `unfollowPlaylist(id)` | Calls the generic library removal operation using a playlist URI. |
| `getUserProfile()` | Alias of `getCurrentUserProfile()`. |
| `getUserProfile(id)`, `getUserPlaylists(id)` | Extended-only; use current-user methods in Development Mode. |
| `getArtistTopTracks`, `getArtistRelatedArtists` | Extended-only legacy methods; no equivalent substitution. |
| All `getBrowse*` methods, including recommendations and genre seeds | Extended-only legacy methods, retained for eligible apps. |

The removed routes and app-mode differences are documented in the
[2026 migration guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide).
Recommendations, related artists and editorial browsing were also restricted by
the [2024 announcement](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api).
Unsupported calls reject with `SpotifyUnsupportedEndpointError` before HTTP.

## Playlists

Creation uses [`POST /me/playlists`](https://developer.spotify.com/documentation/web-api/reference/create-playlist).
The old ID overload is never silently redirected to a different user's account.

Current item operations use `/playlists/{id}/items`:

- [`getPlaylistItems`](https://developer.spotify.com/documentation/web-api/reference/get-playlists-items)
  supports market, fields, additional_types, offset and a limit from 1 through 50.
- [`addPlaylistItems`](https://developer.spotify.com/documentation/web-api/reference/add-items-to-playlist)
  accepts track or episode URIs and optional position, including zero.
- [`updatePlaylistItems`](https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-items)
  accepts either replacement URIs (an empty array clears the playlist) or reorder
  parameters. Reordering requires range_start and insert_before; URIs are not required.
- [`removePlaylistItems`](https://developer.spotify.com/documentation/web-api/reference/remove-items-playlist)
  sends `{ items: [{ uri }], snapshot_id? }`. Mutations validate the 100-item maximum.

Details and cover methods keep their routes. OAuth scopes remain the caller's
responsibility: playlist reads may need playlist-read-private or
playlist-read-collaborative; mutations need playlist-modify-public or
playlist-modify-private as applicable. [Cover uploads](https://developer.spotify.com/documentation/web-api/reference/upload-custom-playlist-cover)
also need ugc-image-upload and raw base64 JPEG data within Spotify's 256 KB limit.

`getPlaylist` and `getPlaylistItems` expose canonical `items` / `item` properties,
normalizing legacy `tracks` / `track` payloads when present. Explicit null items
remain null. Original legacy fields are preserved and deprecated in declarations;
the normalizer does not mutate the response object.

Playlist item types include both full tracks and episodes. Pagination links,
added_at and added_by can be null. Content can be unavailable; check `entry?.item`
before accessing it. Playlist metadata can be returned without content. Selecting
`fields` can omit otherwise required properties; only rely on requested fields.

## Search and metadata

All five search methods validate limits and offsets rather than silently clamp
them. Development Mode accepts 0–10 results per requested type, with Spotify's
default of 5 when omitted. Extended mode permits the historical maximum of 50.
The offset is 0–1000. See [search](https://developer.spotify.com/documentation/web-api/reference/search).

`searchTracks` returns full tracks; album track pages remain simplified tracks.
`PagingSearch` sections are optional because responses only contain requested
types. `Paging<T>` uses nullable next/previous links. Missing artist followers,
popularity and available markets are represented by optional properties rather
than fabricated defaults.

Album and track external IDs remain available, reflecting the
[March correction](https://developer.spotify.com/documentation/web-api/references/changes/march-2026).
`getCurrentUserProfile` includes the optional stable `account_id` added in
[May](https://developer.spotify.com/documentation/web-api/references/changes/may-2026).
Image dimensions and previews permit null, and external IDs support UPC, EAN and ISRC.

`getAlbums` and `getArtists` work without batch API access in either mode. They
preserve duplicates and input order, return an empty array for no IDs, and reject
if any individual request fails. They do not return the null placeholders that
some legacy batch responses supplied. On failure, queued work stops; already
started requests may complete.

## Library operations

`saveLibraryItems(uris)` and `removeLibraryItems(uris)` use
[`PUT /me/library`](https://developer.spotify.com/documentation/web-api/reference/save-library-items) and
[`DELETE /me/library`](https://developer.spotify.com/documentation/web-api/reference/remove-library-items).
URIs go in the query string, with no JSON request body. `unfollowPlaylist` passes
`spotify:playlist:{id}` to the removal method.

`checkLibraryItems(uris)` uses
[`GET /me/library/contains`](https://developer.spotify.com/documentation/web-api/reference/check-library-contains)
and returns booleans in URI order. All three methods validate 1–40 URIs. Supported
entity types and scopes vary by operation; use the linked references. Saving or
removing artist URIs is not promised because those operations' current reference
lists differ from the contains endpoint.

## Quota errors

`SpotifyError.reason` preserves the API error reason. The
[July changelog](https://developer.spotify.com/documentation/web-api/references/changes/july-2026)
introduces `QUOTA_EXCEEDED` for exhausted account quotas. This client surfaces that
error immediately, even when Retry-After is present, rather than retrying it.
Temporary 429 rate limits retain bounded retries. Network and 5xx failures still
use Axios errors; token acquisition and refresh are not implemented in this change.

## Editor setup and validation

`@types/node@22.20.5` is installed. The root compiler config explicitly includes
Node types. Tests and examples each have a tsconfig inheriting the shared check
configuration, so VS Code discovers their projects instead of treating files as
unconfigured scripts. Workspace settings select the installed TypeScript compiler.

Run `npm ci` when setting up a checkout. If VS Code retains old diagnostics, select
the workspace TypeScript version and restart its TS server. No global type package
installation is required.

The tests exercise both quota modes, removed-method guards, canonical and legacy
payloads, search/mutation limits, metadata concurrency, quota errors and actual
HTTP request serialization against a local server. They do not establish live
Spotify permissions; that requires an authorized app and token.

Local validation on Windows / Node 24.21.0 passed: 148 tests (including the local
HTTP test), coverage generation, build, lint, formatting, and typechecks for the
root, tests and examples projects. The installed Node types resolve successfully.

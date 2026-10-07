# Playlist synchronization

`client.playlists.planSync(id, { uris, preserveDuplicates?, signal? })` reads all
items and builds a plan without modifying Spotify. `apply(plan, options?)`
executes it; `sync(id, options)` combines both. `iterateItems(id, { signal? })`
is an async iterator that fetches pages of 50 on demand, including episodes.
Pass a playlist ID, and track or episode Spotify URIs as desired contents.

## Order, duplicates and operations

The desired array specifies the exact final order. Duplicates are preserved by
default. `preserveDuplicates: false` keeps the first occurrence of each URI in
the desired array. Input arrays are copied; plans and their arrays are frozen.
Plans belong to the client instance that created them, cannot be deserialized
from JSON for execution, and should not be reused after execution or failure.

The planner removes unwanted URIs, moves existing entries into the desired order,
and inserts missing items. It does not replace the entire playlist. Removal is
by URI and removes all occurrences: when an existing URI has excess copies, all
copies are removed and the desired copies are added back. Those re-added copies
lose their original added-at/added-by metadata; other existing entries are kept.
The plan is deterministic but does not guarantee the minimum possible requests.
Reordering uses a greedy algorithm and can take quadratic time for large lists.

`summary.added` and `summary.removed` count actual insertions and removals,
including re-added duplicate copies; `reordered` counts single-item moves.
`writeRequests` excludes reads and any rate-limit retries. Planning needs two
metadata requests plus at least one items request. Execution checks the snapshot
before every write and after the final verification. Changed playlists are read
again to verify their final ordered contents. Unchanged playlists need one
snapshot check and zero writes.

Planning refuses local or unavailable/null items, invalid URIs, incomplete pages,
and snapshot changes while reading. Relinked tracks are compared using their
original `linked_from.uri` when supplied by Spotify.

## Progress, cancellation and failure

```ts
import { PlaylistSyncExecutionError } from 'easy-spotify-ts'

const controller = new AbortController()
try {
  await spotify.playlists.sync(playlistId, {
    uris: desiredUris,
    signal: controller.signal,
    onProgress: progress => {
      console.log(progress.completedOperations, progress.totalOperations)
    }
  })
} catch (error) {
  if (error instanceof PlaylistSyncExecutionError) {
    console.error(error.progress, error.cause)
  }
  throw error
}
```

Progress callbacks run after each acknowledged write and can be asynchronous.
Callback failures stop execution and are wrapped with progress, as are API errors,
conflicts and execution cancellation. Planning errors are returned directly.
`PlaylistSyncConflictError` exposes expected and actual snapshots; during
execution it is the `cause` of `PlaylistSyncExecutionError`.

Cancellation stops at request boundaries, does not abort an in-flight HTTP request
or a rate-limit wait, and does not undo completed writes. Same-client concurrent
execution for the same playlist is rejected. This lock does not coordinate other
clients or processes.

Snapshot checks and final content verification detect changes, but there is a
race between checking and writing. Additions have no conditional snapshot
parameter, and the whole workflow is not transactional. A failed network request
may already have changed Spotify even when no response was received; progress
counts acknowledged writes only. Synchronization never automatically replays
an ambiguous failed write. Existing bounded HTTP 429 retries still apply.
After any failure, inspect remote state by creating a fresh plan.

## Permissions and official API

The token needs playlist read access and the appropriate
`playlist-modify-public` / `playlist-modify-private` permission. Private and
collaborative playlist reads can additionally require `playlist-read-private` /
`playlist-read-collaborative`. Quota mode and Spotify's content access rules apply;
the client cannot grant access or refresh a token.

- [Read playlist items](https://developer.spotify.com/documentation/web-api/reference/get-playlists-items)
- [Add items, in batches of up to 100](https://developer.spotify.com/documentation/web-api/reference/add-items-to-playlist)
- [Reorder items and snapshots](https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-items)
- [Remove playlist items](https://developer.spotify.com/documentation/web-api/reference/remove-items-playlist)
- [Authorization scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes)

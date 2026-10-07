# Maintenance audit — 2026-10-07

This update restores the development and packaging baseline. It does not migrate
every Spotify endpoint or declare the library ready for a new npm release.

## Changes applied

| Area | Previous state | Updated baseline |
| --- | --- | --- |
| Runtime | Node 14 CI, ES5 output | Node >=22.13, ES2022 output, Node 24 recommended |
| HTTP | Axios 0.21 | Axios 1.20 |
| TypeScript | 4.4, implicit-any checks only | 6.0, strict checks on source, tests and example |
| Lint | ESLint 7, Airbnb and multiple overlapping plugins | ESLint 10 flat config, typescript-eslint 8 |
| Formatting | Prettier 2 embedded in lint | Prettier 3, separate check and write commands |
| Tests | Mocha 9, Chai 4, Sinon 11, ts-node | Mocha 12, Chai 6, Sinon 22, tsx |
| Coverage | nyc and obsolete codecov package | c8 text, HTML and LCOV reports |
| Installation | Yarn lock, scripts requiring Yarn | npm lock and npm-only scripts |
| CI | Travis on Node 14 | GitHub Actions on Node 22/24/26 and Windows on Node 24 |
| Packaging | Committed output, no validation hook | Ignored build output, prepack validation and build |

Unused ts-loader, rimraf, ts-node, codecov and legacy ESLint plugins were removed.
TypeScript 7 is deliberately deferred: typescript-eslint 8.71.1 declares a
TypeScript peer range of `>=4.8.4 <6.1.0`. TypeScript 6.0.3 satisfies that range.
Versions were checked against the npm registry, not inferred from the old lock.
Node typings stay on major 22 to match the minimum supported runtime.

CommonJS output, package name and version 0.3.0 are retained. Models, request types
and SpotifyError can now be imported from the package root. No restrictive exports
map was added because existing consumers may use dist subpaths. Node requirements,
strict declarations and ES2022 output are compatibility changes and require release
notes and a new version before publication.

## Correctness fixes

- Album copyrights read copyrights instead of available_markets; restrictions are copied.
- Artist URI reads uri instead of type; track popularity is typed as a number.
- Browse methods serialize a copy rather than mutate caller arguments.
- Response handling accepts all 2xx statuses and handles missing JSON error bodies.
- 429 retry handles resolved Axios responses and rejected Axios errors. Retry-After
  is converted to seconds numerically, headers and body are preserved, and retries
  stop after two attempts. Invalid or timer-overflow delays are not retried.
- Existing error tests now await promise rejection. Their old bare `.to.throw`
  expressions neither invoked the assertion nor awaited the asynchronous operation.
- Regression tests exercise the real Axios adapter boundary, serialization and retries.

## Spotify API compatibility to address next

Availability depends on app mode. The [2024 announcement](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api)
restricts recommendations, related artists, featured/category playlists and some
preview data for affected apps. Keeping a method does not guarantee API access.

The [2026 migration guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide)
describes development-mode changes: playlist `/tracks` becomes `/items`, creation
moves to `/me/playlists`, library operations converge on `/me/library`, batch fetches
and several browse/other-user endpoints disappear, and search limits shrink.
Response fields also change. Extended quota apps are treated differently, so the
next release needs an explicit compatibility policy before replacing routes.

Check subsequent updates too: [March](https://developer.spotify.com/documentation/web-api/references/changes/march-2026)
restores external_ids; [May](https://developer.spotify.com/documentation/web-api/references/changes/may-2026)
adds account_id; [July](https://developer.spotify.com/documentation/web-api/references/changes/july-2026)
updates app limits and introduces QUOTA_EXCEEDED. The older migration guide's
one-app limit should not be treated as the latest rule.

## Priorities for the next release

1. Define useful supported workflows around current-user playlists, search and
   library management. Audit each route against current app-mode restrictions.
2. Implement OAuth authorization code/PKCE and token refresh, or define an explicit
   token-provider interface. Today callers must obtain and refresh tokens themselves.
3. Replace any payloads with accurate response types: nullable images/previews,
   optional search sections, track versus simplified track pagination, full playlist
   item pages, optional or removed metadata, and missing external ID variants.
4. Add pagination helpers and bounded concurrency for individual metadata fetches.
5. Add configurable timeout, cancellation and retry policy. Normalize network and
   5xx failures alongside SpotifyError; expose quota reasons without blind retries.
6. Test real HTTP behavior and package consumption across supported runtimes.
   Unit tests and adapter checks do not establish live Spotify access.
7. Rewrite legacy method reference examples and links, decide whether native ESM
   and browser support are release requirements, add changelog and migration notes,
   and choose the next version before publishing.

## Local commands

```sh
npm ci
npm run check
npm run test:coverage
npm pack --dry-run
```

CI runs these checks. `npm pack` runs prepack validation and builds from source;
dist need not be checked into Git. No credentials are needed for the test suite.

Validation on Windows with portable Node 24.21.0: typecheck, lint, formatting,
build and all 113 tests passed. c8 reported 97.88% line coverage; this includes
transformed TypeScript modules and is not a measure of live endpoint coverage.
The full npm audit reported zero known vulnerabilities at the time of this update.
A clean `npm ci` succeeded. The generated tarball was installed in a separate
temporary consumer project: CommonJS imports, native ESM named imports and strict
TypeScript imports all passed. The archive contains runtime files, declarations,
README, license and this audit, without source tests or development dependencies.
GitHub Actions is configured for the wider runtime matrix but has not run locally.
Live Spotify behavior remains unverified without an authorized app and token.

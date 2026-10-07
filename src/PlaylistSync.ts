import type EasySpotify from './EasySpotify'
import type { PlaylistItem } from './models/Playlist'

export interface PlaylistSyncOptions {
  uris: readonly string[]
  /** Defaults to true. False keeps only the first occurrence of each URI. */
  preserveDuplicates?: boolean
  signal?: AbortSignal
}

export type PlaylistSyncOperation =
  | { readonly type: 'remove'; readonly uris: readonly string[] }
  | {
      readonly type: 'add'
      readonly uris: readonly string[]
      readonly position: number
    }
  | { readonly type: 'reorder'; readonly from: number; readonly to: number }

export interface PlaylistSyncPlan {
  readonly playlistId: string
  readonly snapshotId: string
  readonly currentUris: readonly string[]
  readonly desiredUris: readonly string[]
  readonly operations: readonly PlaylistSyncOperation[]
  readonly summary: Readonly<{
    currentItems: number
    desiredItems: number
    added: number
    removed: number
    reordered: number
    writeRequests: number
  }>
}

export interface PlaylistSyncProgress {
  readonly completedOperations: number
  readonly totalOperations: number
  readonly snapshotId: string
}

export interface ApplyPlaylistSyncOptions {
  signal?: AbortSignal
  onProgress?: (progress: PlaylistSyncProgress) => void | Promise<void>
}

export interface PlaylistSyncResult extends PlaylistSyncProgress {
  readonly playlistId: string
  readonly changed: boolean
}

export class PlaylistSyncConflictError extends Error {
  constructor(
    public readonly expectedSnapshotId: string,
    public readonly actualSnapshotId: string
  ) {
    super(
      'Playlist changed during synchronization; create a new plan before retrying'
    )
    this.name = 'PlaylistSyncConflictError'
  }
}

export class PlaylistSyncExecutionError extends Error {
  constructor(
    public readonly progress: PlaylistSyncProgress,
    cause: unknown
  ) {
    super(
      'Playlist synchronization stopped; inspect progress and create a new plan before retrying',
      { cause }
    )
    this.name = 'PlaylistSyncExecutionError'
  }
}

function checkAbort(signal?: AbortSignal): void {
  signal?.throwIfAborted()
}

function validateUri(uri: string): void {
  if (
    typeof uri !== 'string' ||
    !/^spotify:(track|episode):[a-zA-Z0-9]+$/.test(uri)
  ) {
    throw new TypeError(
      'Synchronization requires Spotify track or episode URIs'
    )
  }
}

function counts(uris: readonly string[]): Map<string, number> {
  const result = new Map<string, number>()
  for (const uri of uris) result.set(uri, (result.get(uri) ?? 0) + 1)
  return result
}

/** High-level playlist workflows. Access through client.playlists. */
export class PlaylistSync {
  private readonly plans = new WeakSet<PlaylistSyncPlan>()
  private readonly active = new Set<string>()

  constructor(private readonly client: EasySpotify) {}

  /** Pages are requested on demand. Cancellation is checked between requests. */
  public async *iterateItems(
    playlistId: string,
    options: { signal?: AbortSignal } = {}
  ): AsyncGenerator<PlaylistItem | null> {
    this.validateId(playlistId)
    let offset = 0
    let total: number | undefined
    while (true) {
      checkAbort(options.signal)
      const page = await this.client.getPlaylistItems(playlistId, {
        limit: 50,
        offset,
        additional_types: 'track,episode'
      })
      checkAbort(options.signal)
      if (
        !Array.isArray(page.items) ||
        !Number.isInteger(page.total) ||
        page.total < 0 ||
        page.items.length > 50 ||
        offset + page.items.length > page.total ||
        page.offset !== offset
      ) {
        throw new Error('Spotify returned an incomplete playlist page')
      }
      if (total !== undefined && total !== page.total)
        throw new Error(
          'Playlist length changed while reading; create a new plan'
        )
      total = page.total
      if (page.items.length === 0 && offset < total)
        throw new Error(
          'Spotify returned an empty page before the playlist ended'
        )
      for (const entry of page.items) {
        checkAbort(options.signal)
        yield entry
      }
      offset += page.items.length
      if (offset >= total) return
    }
  }

  /** Reads a consistent snapshot and creates an immutable, read-only plan. */
  public async planSync(
    playlistId: string,
    options: PlaylistSyncOptions
  ): Promise<PlaylistSyncPlan> {
    this.validateId(playlistId)
    if (!Array.isArray(options.uris))
      throw new TypeError('uris must be an array')
    if (
      options.preserveDuplicates !== undefined &&
      typeof options.preserveDuplicates !== 'boolean'
    )
      throw new TypeError('preserveDuplicates must be a boolean')
    options.uris.forEach(validateUri)
    const desired =
      options.preserveDuplicates === false
        ? [...new Set(options.uris)]
        : [...options.uris]
    checkAbort(options.signal)
    const snapshotId = await this.snapshot(playlistId)
    const current: string[] = []
    for await (const entry of this.iterateItems(playlistId, options)) {
      // Never silently drop unavailable or local entries from a destructive plan.
      if (!entry?.item || entry.is_local)
        throw new Error(
          'Cannot synchronize playlists containing local or unavailable items'
        )
      const uri =
        'linked_from' in entry.item && entry.item.linked_from
          ? entry.item.linked_from.uri
          : entry.item.uri
      validateUri(uri)
      current.push(uri)
    }
    await this.assertSnapshot(playlistId, snapshotId)
    checkAbort(options.signal)

    const wantedCounts = counts(desired)
    // URI removal removes every occurrence. Re-add desired occurrences when a
    // URI has too many copies, while preserving all other existing entries.
    const remove = [...counts(current)]
      .filter(([uri, count]) => count > (wantedCounts.get(uri) ?? 0))
      .map(([uri]) => uri)
    const removedUris = new Set(remove)
    const working = current.filter(uri => !removedUris.has(uri))
    const operations: PlaylistSyncOperation[] = []
    let added = 0
    let reordered = 0
    for (let start = 0; start < remove.length; start += 100)
      operations.push({
        type: 'remove',
        uris: Object.freeze(remove.slice(start, start + 100))
      })
    for (let index = 0; index < desired.length;) {
      if (working[index] === desired[index]) {
        index++
        continue
      }
      const from = working.indexOf(desired[index], index + 1)
      if (from !== -1) {
        operations.push({ type: 'reorder', from, to: index })
        working.splice(index, 0, working.splice(from, 1)[0])
        reordered++
        index++
      } else {
        const uris: string[] = []
        const position = index
        do {
          uris.push(desired[index])
          working.splice(index, 0, desired[index])
          index++
        } while (
          index < desired.length &&
          uris.length < 100 &&
          working.indexOf(desired[index], index) === -1
        )
        added += uris.length
        operations.push({ type: 'add', position, uris: Object.freeze(uris) })
      }
    }
    const plan: PlaylistSyncPlan = Object.freeze({
      playlistId,
      snapshotId,
      currentUris: Object.freeze(current),
      desiredUris: Object.freeze(desired),
      operations: Object.freeze(
        operations.map(operation => Object.freeze(operation))
      ),
      summary: Object.freeze({
        currentItems: current.length,
        desiredItems: desired.length,
        added,
        removed:
          current.length - current.filter(uri => !removedUris.has(uri)).length,
        reordered,
        writeRequests: operations.length
      })
    })
    this.plans.add(plan)
    return plan
  }

  /** Apply a plan returned by this instance. Writes are sequential, never replayed automatically. */
  public async apply(
    plan: PlaylistSyncPlan,
    options: ApplyPlaylistSyncOptions = {}
  ): Promise<PlaylistSyncResult> {
    if (!this.plans.has(plan))
      throw new TypeError(
        "Use an unmodified plan returned by this client's planSync()"
      )
    if (this.active.has(plan.playlistId))
      throw new Error('A synchronization is already running for this playlist')
    this.active.add(plan.playlistId)
    let completed = 0
    let snapshotId = plan.snapshotId
    const progress = (): PlaylistSyncProgress =>
      Object.freeze({
        completedOperations: completed,
        totalOperations: plan.operations.length,
        snapshotId
      })
    try {
      checkAbort(options.signal)
      for (const operation of plan.operations) {
        await this.assertSnapshot(plan.playlistId, snapshotId)
        checkAbort(options.signal)
        const response =
          operation.type === 'remove'
            ? await this.client.removePlaylistItems(plan.playlistId, {
                items: operation.uris.map(uri => ({ uri })),
                snapshot_id: snapshotId
              })
            : operation.type === 'add'
              ? await this.client.addPlaylistItems(plan.playlistId, {
                  uris: [...operation.uris],
                  position: operation.position
                })
              : await this.client.updatePlaylistItems(plan.playlistId, {
                  range_start: operation.from,
                  insert_before: operation.to,
                  range_length: 1,
                  snapshot_id: snapshotId
                })
        completed++
        if (!response?.snapshot_id)
          throw new Error(
            'Spotify did not return a snapshot after the write; remote state is uncertain'
          )
        snapshotId = response.snapshot_id
        await options.onProgress?.(progress())
      }
      checkAbort(options.signal)
      if (completed > 0) {
        const actual: string[] = []
        for await (const entry of this.iterateItems(plan.playlistId, options)) {
          const item = entry?.item
          actual.push(
            item && 'linked_from' in item && item.linked_from
              ? item.linked_from.uri
              : (item?.uri ?? '')
          )
        }
        if (
          actual.length !== plan.desiredUris.length ||
          actual.some((uri, index) => uri !== plan.desiredUris[index])
        ) {
          throw new Error(
            'Playlist content differs from the planned result; create a new plan'
          )
        }
      }
      await this.assertSnapshot(plan.playlistId, snapshotId)
      checkAbort(options.signal)
      return Object.freeze({
        ...progress(),
        playlistId: plan.playlistId,
        changed: completed > 0
      })
    } catch (cause) {
      throw new PlaylistSyncExecutionError(progress(), cause)
    } finally {
      this.active.delete(plan.playlistId)
    }
  }

  public async sync(
    playlistId: string,
    options: PlaylistSyncOptions & ApplyPlaylistSyncOptions
  ): Promise<PlaylistSyncResult> {
    return this.apply(await this.planSync(playlistId, options), options)
  }

  private validateId(id: string): void {
    if (typeof id !== 'string' || !/^[a-zA-Z0-9]+$/.test(id))
      throw new TypeError('playlistId must be a Spotify ID')
  }

  private async snapshot(id: string): Promise<string> {
    const playlist = await this.client.getPlaylist(id, {
      fields: 'snapshot_id'
    })
    if (typeof playlist.snapshot_id !== 'string' || !playlist.snapshot_id)
      throw new Error('Spotify did not return a playlist snapshot')
    return playlist.snapshot_id
  }

  private async assertSnapshot(id: string, expected: string): Promise<void> {
    const actual = await this.snapshot(id)
    if (actual !== expected)
      throw new PlaylistSyncConflictError(expected, actual)
  }
}

import assert from 'node:assert/strict'
import {
  EasySpotify,
  EasySpotifyConfig,
  PlaylistSyncConflictError,
  PlaylistSyncExecutionError
} from '../src'

const uri = (id: string | number) => `spotify:track:${id}`

describe('Playlist synchronization', () => {
  let client: EasySpotify
  let state: string[]
  let version: number
  let writes: { method: string; body: any }[]
  let reads: number[]
  let failWrite: number
  let unavailable: boolean
  let local: boolean
  let changeDuringRead: boolean

  beforeEach(() => {
    state = []
    version = 0
    writes = []
    reads = []
    failWrite = 0
    unavailable = false
    local = false
    changeDuringRead = false
    client = new EasySpotify(new EasySpotifyConfig('token'))
    client.httpClient.defaults.adapter = async config => {
      let data: unknown
      if (config.method === 'get') {
        if (config.url?.endsWith('/items')) {
          const offset = config.params.offset
          reads.push(offset)
          data = {
            items: state
              .slice(offset, offset + 50)
              .map(value =>
                unavailable
                  ? null
                  : { is_local: local, item: { uri: value, type: 'track' } }
              ),
            total: state.length,
            offset,
            next: null
          }
          if (changeDuringRead) version++
        } else data = { snapshot_id: `s${version}` }
      } else {
        const body = JSON.parse(config.data)
        writes.push({ method: config.method!, body })
        if (writes.length === failWrite) throw new Error('Connection lost')
        if (body.snapshot_id) assert.equal(body.snapshot_id, `s${version}`)
        if (config.method === 'delete') {
          const removed = new Set(
            body.items.map((item: { uri: string }) => item.uri)
          )
          state = state.filter(value => !removed.has(value))
        } else if (config.method === 'post')
          state.splice(body.position, 0, ...body.uris)
        else
          state.splice(
            body.insert_before,
            0,
            state.splice(body.range_start, 1)[0]
          )
        version++
        data = { snapshot_id: `s${version}` }
      }
      return { config, status: 200, statusText: 'OK', headers: {}, data }
    }
  })

  it('plans without writes, copies input and freezes the plan', async () => {
    const uris = [uri('a')]
    const plan = await client.playlists.planSync('playlist', { uris })
    uris.push(uri('b'))
    assert.deepEqual(plan.desiredUris, [uri('a')])
    assert.equal(writes.length, 0)
    assert.ok(Object.isFrozen(plan.operations[0]))
    assert.ok(Object.isFrozen(plan.desiredUris))
    assert.equal(plan.summary.writeRequests, 1)
  })

  it('does no writes when already synchronized, including duplicates', async () => {
    state = [uri('a'), uri('a')]
    const result = await client.playlists.sync('playlist', { uris: [...state] })
    assert.equal(result.changed, false)
    assert.equal(writes.length, 0)
  })

  it('paginates on demand and stops when the consumer stops', async () => {
    state = Array.from({ length: 121 }, (_, i) => uri(i))
    for await (const entry of client.playlists.iterateItems('playlist')) {
      assert.ok(entry)
      break
    }
    assert.deepEqual(reads, [0])
    reads = []
    const plan = await client.playlists.planSync('playlist', { uris: state })
    assert.equal(plan.currentUris.length, 121)
    assert.deepEqual(reads, [0, 50, 100])
  })

  it('adds 205 items in ordered batches of at most 100', async () => {
    const desired = Array.from({ length: 205 }, (_, i) => uri(i))
    const progress: number[] = []
    await client.playlists.sync('playlist', {
      uris: desired,
      onProgress: update => {
        progress.push(update.completedOperations)
      }
    })
    assert.deepEqual(state, desired)
    assert.deepEqual(
      writes.map(write => write.body.uris.length),
      [100, 100, 5]
    )
    assert.deepEqual(progress, [1, 2, 3])
  })

  it('reorders existing entries instead of removing and adding them', async () => {
    state = [uri('a'), uri('b'), uri('c')]
    const desired = [uri('c'), uri('a'), uri('b')]
    const result = await client.playlists.sync('playlist', { uris: desired })
    assert.deepEqual(state, desired)
    assert.equal(result.completedOperations, 1)
    assert.equal(writes[0].method, 'put')
  })

  it('preserves requested duplicates and handles excess existing copies', async () => {
    state = [uri('a'), uri('a'), uri('a'), uri('b')]
    const desired = [uri('a'), uri('b'), uri('a'), uri('c'), uri('c')]
    await client.playlists.sync('playlist', { uris: desired })
    assert.deepEqual(state, desired)
    assert.equal(writes[0].method, 'delete')
  })

  it('deduplicates desired URIs by first occurrence when requested', async () => {
    state = [uri('a'), uri('a')]
    await client.playlists.sync('playlist', {
      uris: [uri('b'), uri('a'), uri('b')],
      preserveDuplicates: false
    })
    assert.deepEqual(state, [uri('b'), uri('a')])
  })

  it('clears a playlist and batches URI removals', async () => {
    state = Array.from({ length: 105 }, (_, i) => uri(i))
    await client.playlists.sync('playlist', { uris: [] })
    assert.deepEqual(state, [])
    assert.deepEqual(
      writes.map(write => write.body.items.length),
      [100, 5]
    )
  })

  it('supports episode URIs', async () => {
    const desired = ['spotify:episode:abc', uri('a')]
    await client.playlists.sync('playlist', { uris: desired })
    assert.deepEqual(state, desired)
  })

  it('rejects invalid input before requests', async () => {
    await assert.rejects(
      client.playlists.planSync('../playlist', { uris: [] }),
      TypeError
    )
    for (const value of [
      'spotify:local:a',
      'https://open.spotify.com/track/a',
      'spotify:album:a',
      ''
    ]) {
      await assert.rejects(
        client.playlists.planSync('playlist', { uris: [value] }),
        TypeError
      )
    }
    assert.equal(reads.length, 0)
    assert.equal(writes.length, 0)
  })

  it('refuses to silently discard unavailable or local items', async () => {
    state = [uri('a')]
    unavailable = true
    await assert.rejects(
      client.playlists.planSync('playlist', { uris: [] }),
      /local or unavailable/
    )
    unavailable = false
    local = true
    await assert.rejects(
      client.playlists.planSync('playlist', { uris: [] }),
      /local or unavailable/
    )
    assert.equal(writes.length, 0)
  })

  it('detects a change while the plan is being read', async () => {
    changeDuringRead = true
    state = [uri('a')]
    await assert.rejects(
      client.playlists.planSync('playlist', { uris: [] }),
      PlaylistSyncConflictError
    )
  })

  it('rejects a stale plan before the first write', async () => {
    const plan = await client.playlists.planSync('playlist', {
      uris: [uri('a')]
    })
    version++
    await assert.rejects(client.playlists.apply(plan), (error: unknown) => {
      assert.ok(error instanceof PlaylistSyncExecutionError)
      assert.ok(error.cause instanceof PlaylistSyncConflictError)
      assert.equal(error.progress.completedOperations, 0)
      return true
    })
    assert.equal(writes.length, 0)
  })

  it('stops on changes between batches and reports completed writes', async () => {
    const desired = Array.from({ length: 105 }, (_, i) => uri(i))
    await assert.rejects(
      client.playlists.sync('playlist', {
        uris: desired,
        onProgress: () => {
          version++
        }
      }),
      (error: unknown) => {
        assert.ok(error instanceof PlaylistSyncExecutionError)
        assert.equal(error.progress.completedOperations, 1)
        assert.ok(error.cause instanceof PlaylistSyncConflictError)
        return true
      }
    )
    assert.equal(writes.length, 1)
  })

  it('does not retry an ambiguous write failure and permits a fresh plan', async () => {
    failWrite = 2
    const desired = Array.from({ length: 105 }, (_, i) => uri(i))
    await assert.rejects(
      client.playlists.sync('playlist', { uris: desired }),
      (error: unknown) => {
        assert.ok(error instanceof PlaylistSyncExecutionError)
        assert.equal(error.progress.completedOperations, 1)
        return true
      }
    )
    failWrite = 0
    await client.playlists.sync('playlist', { uris: desired })
    assert.deepEqual(state, desired)
  })

  it('cancels between writes and reports partial progress', async () => {
    const controller = new AbortController()
    await assert.rejects(
      client.playlists.sync('playlist', {
        uris: Array.from({ length: 105 }, (_, i) => uri(i)),
        signal: controller.signal,
        onProgress: () => controller.abort()
      }),
      PlaylistSyncExecutionError
    )
    assert.equal(writes.length, 1)
  })

  it('rejects forged plans and plans created by another client', async () => {
    const plan = await client.playlists.planSync('playlist', { uris: [] })
    await assert.rejects(client.playlists.apply({ ...plan }), TypeError)
    const other = new EasySpotify(new EasySpotifyConfig('token'))
    await assert.rejects(other.playlists.apply(plan), TypeError)
  })

  it('refuses overlapping execution and releases the lock after a callback fails', async () => {
    const plan = await client.playlists.planSync('playlist', {
      uris: [uri('a')]
    })
    await assert.rejects(
      client.playlists.apply(plan, {
        onProgress: async () => {
          await assert.rejects(client.playlists.apply(plan), /already running/)
          throw new Error('Callback failed')
        }
      }),
      PlaylistSyncExecutionError
    )
    const result = await client.playlists.sync('playlist', { uris: [uri('a')] })
    assert.equal(result.changed, false)
  })

  it('verifies final content rather than relying only on a snapshot', async () => {
    await assert.rejects(
      client.playlists.sync('playlist', {
        uris: [uri('a')],
        onProgress: () => {
          state.push(uri('b'))
        }
      }),
      (error: unknown) => {
        assert.ok(error instanceof PlaylistSyncExecutionError)
        assert.match(String(error.cause), /differs from the planned result/)
        return true
      }
    )
  })

  it('rejects pre-aborted planning without reading or writing', async () => {
    const controller = new AbortController()
    controller.abort()
    await assert.rejects(
      client.playlists.planSync('playlist', {
        uris: [],
        signal: controller.signal
      }),
      { name: 'AbortError' }
    )
    assert.deepEqual(reads, [])
    assert.deepEqual(writes, [])
  })

  it('rejects missing page data instead of interpreting it as an empty playlist', async () => {
    client.getPlaylistItems = async () => ({ total: 1, offset: 0 }) as any
    await assert.rejects(
      client.playlists.planSync('playlist', { uris: [] }),
      /incomplete playlist page/
    )
  })

  it('compares relinked tracks using the original URI', async () => {
    client.getPlaylistItems = async () =>
      ({
        offset: 0,
        total: 1,
        items: [
          {
            is_local: false,
            item: {
              uri: uri('replacement'),
              linked_from: { uri: uri('original') }
            }
          }
        ]
      }) as any
    const plan = await client.playlists.planSync('playlist', {
      uris: [uri('original')]
    })
    assert.equal(plan.operations.length, 0)
  })

  it('matches desired sequences across repeated randomized duplicate-heavy cases', async () => {
    let seed = 123
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return seed
    }
    for (let i = 0; i < 100; i++) {
      state = Array.from({ length: random() % 25 }, () => uri(random() % 6))
      const desired = Array.from({ length: random() % 25 }, () =>
        uri(random() % 6)
      )
      await client.playlists.sync('playlist', { uris: desired })
      assert.deepEqual(state, desired)
    }
  })
})

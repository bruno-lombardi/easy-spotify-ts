import { Followers } from '.'
import { ExternalUrls } from './ExternalUrls'
import { Image } from './Image'
import { Paging, PagingPlaylists } from './Paging'
import { User } from './User'
import { Track } from './Track'
import { Episode } from './Episode'

export interface FeaturedPlaylists {
  message: string
  playlists: PagingPlaylists
}

export interface PlaylistItemsSummary {
  href: string
  total: number
}

export type PlaylistOwner = Pick<
  User,
  'external_urls' | 'href' | 'id' | 'type' | 'uri'
> & {
  display_name?: string | null
}

export interface SimplifiedPlaylist {
  collaborative: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  description: string | null
  owner: PlaylistOwner
  public: boolean | null
  snapshot_id: string
  items?: PlaylistItemsSummary
  /** @deprecated Legacy response field from eligible extended quota apps. */
  tracks?: PlaylistItemsSummary
  type: 'playlist'
  uri: string
}
export interface CreatePlaylistParams {
  name: string
  public?: boolean
  collaborative?: boolean
  description?: string
}

export interface UpdatePlaylistParams {
  name?: string
  public?: boolean
  collaborative?: boolean
  description?: string
}
export interface AddPlaylistTracksParams {
  uris: string[]
  position?: number
}
export interface ReplacePlaylistTracksParams {
  /**
   * An array of uris to set. An uri looks like this: spotify:track:4iV5W9uYEdYUVa79Axb7Rh.
   */
  uris?: string[]
  /**
   * The position of the first item to be reordered.
   */
  range_start?: number
  /**
   * The position where the items should be inserted.
   * To reorder the items to the end of the playlist, simply set insert_before to the position after the last item.
   */
  insert_before?: number
  /**
   * The amount of items to be reordered. Defaults to 1 if not set.
   * The range of items to be reordered begins from the range_start position, and includes the range_length subsequent items.
   */
  range_length?: number
  /**
   * The playlist’s snapshot ID against which you want to make the changes.
   */
  snapshot_id?: string
}
export interface RemovePlaylistTracksParams {
  /**
   * An array of uris to set. An uri looks like this: spotify:track:4iV5W9uYEdYUVa79Axb7Rh.
   */
  uris: string[]
  /**
   * The playlist’s snapshot ID against which you want to make the changes.
   */
  snapshot_id?: string
}

export interface PlaylistItem {
  added_at: string | null
  added_by: Pick<User, 'external_urls' | 'href' | 'id' | 'type' | 'uri'> | null
  is_local: boolean
  item: Track | Episode | null
  /** @deprecated Legacy response field. Use item. */
  track?: Track | Episode | null
}

export type PagingPlaylistItems = Paging<PlaylistItem | null>

export interface Playlist extends Omit<SimplifiedPlaylist, 'items' | 'tracks'> {
  followers?: Followers
  /** Absent when the authorized user does not own or collaborate on the playlist. */
  items?: PagingPlaylistItems
  /** @deprecated Legacy response field. Use items. */
  tracks?: PagingPlaylistItems
}

export type AddPlaylistItemsParams = AddPlaylistTracksParams
export type UpdatePlaylistItemsParams =
  | { uris: string[] }
  | {
      range_start: number
      insert_before: number
      range_length?: number
      snapshot_id?: string
    }
export interface RemovePlaylistItemsParams {
  items: { uri: string }[]
  snapshot_id?: string
}
export interface GetPlaylistOptions {
  market?: string
  fields?: string
  additional_types?: string
}
export interface GetPlaylistItemsOptions extends GetPlaylistOptions {
  limit?: number
  offset?: number
}

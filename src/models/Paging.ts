import { SimplifiedAlbum } from './Album'
import { Artist } from './Artist'
import { Category } from './Category'
import { SimplifiedPlaylist } from './Playlist'
import { SimplifiedTrack } from './SimplifiedTrack'
import { Track } from './Track'

export interface Paging<T = unknown> {
  href: string
  items: T[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}

export interface PagingTracks extends Paging<SimplifiedTrack> {
  items: SimplifiedTrack[]
}

export type PagingFullTracks = Paging<Track>

export interface PagingAlbums extends Paging {
  items: SimplifiedAlbum[]
}

export interface PagingArtists extends Paging {
  items: Artist[]
}

export interface PagingPlaylists extends Paging {
  items: SimplifiedPlaylist[]
}

export interface PagingCategories extends Paging {
  items: Category[]
}

export interface PagingSearch {
  tracks?: PagingFullTracks
  albums?: PagingAlbums
  artists?: PagingArtists
  playlists?: PagingPlaylists
}

export interface PagingRequestParams {
  limit?: number
  offset?: number
}

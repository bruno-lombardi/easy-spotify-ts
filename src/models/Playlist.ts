import { Followers } from '.'
import { ExternalUrls } from './ExternalUrls'
import { Image } from './Image'
import { PagingPlaylists } from './Paging'
import { User } from './User'

export interface FeaturedPlaylists {
  message: string
  playlists: PagingPlaylists
}

interface Tracks {
  href: string
  total: number
}

export interface SimplifiedPlaylist {
  collaborative: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  description: string
  owner: User
  public: boolean
  snapshot_id: string
  tracks: Tracks
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

export interface Playlist extends SimplifiedPlaylist {
  followers: Followers
}

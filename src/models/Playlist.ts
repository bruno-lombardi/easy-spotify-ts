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
  owner: User
  primary_color: null
  public: any
  snapshot_id: string
  tracks: Tracks
  type: 'playlist'
  uri: string
  description: string
}

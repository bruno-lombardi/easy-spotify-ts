import { SimplifiedArtist } from './Artist'
import { ExternalUrls } from './ExternalUrls'

export interface SimplifiedTrack {
  artists: SimplifiedArtist[]
  available_markets?: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  is_playable?: boolean
  linked_from?: {
    id: string
    uri: string
    href: string
    type: string
    external_urls: ExternalUrls
  }
  name: string
  preview_url?: string | null
  track_number: number
  type: string
  uri: string
  is_local: boolean
}

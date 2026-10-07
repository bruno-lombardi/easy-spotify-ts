import { ExternalUrls } from './ExternalUrls'
import { Image } from './Image'

export interface Episode {
  type: 'episode'
  id: string
  uri: string
  href: string
  name: string
  description: string
  html_description: string
  duration_ms: number
  explicit: boolean
  external_urls: ExternalUrls
  images: Image[]
  is_externally_hosted: boolean
  is_playable: boolean
  languages: string[]
  release_date: string
  release_date_precision: string
  audio_preview_url?: string | null
  restrictions?: { reason: string }
  resume_point?: { fully_played: boolean; resume_position_ms: number }
  show: {
    id: string
    name: string
    uri: string
    href: string
    type: 'show'
    external_urls: ExternalUrls
    images: Image[]
    description: string
    html_description: string
    explicit: boolean
    is_externally_hosted: boolean
    languages: string[]
    media_type: string
    total_episodes: number
    publisher?: string
    available_markets?: string[]
  }
}

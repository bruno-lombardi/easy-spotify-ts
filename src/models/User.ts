import { ExternalUrls } from './ExternalUrls'
import { Followers } from './Followers'
import { Image } from './Image'

export interface User {
  display_name: string | null
  /** Stable account identifier returned by GET /me since May 2026. */
  account_id?: string
  external_urls: ExternalUrls
  followers?: Followers
  href: string
  id: string
  images: Image[]
  type: string
  uri: string
}

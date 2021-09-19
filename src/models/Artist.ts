import { ExternalUrls } from './ExternalUrls'
import { Followers } from './Followers'
import { Image } from './Image'
import { OptionalRequestParams } from './Request'

export interface SimplifiedArtist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface GetArtistAlbumsOptions extends OptionalRequestParams {
  include_groups?: string
}

export class Artist implements SimplifiedArtist {
  public external_urls: ExternalUrls

  public href: string

  public id: string

  public name: string

  public type: string

  public uri: string

  public followers: Followers

  public genres: string[]

  public images: Image[]

  public popularity: number

  constructor(response: any) {
    this.external_urls = response.external_urls
    this.href = response.href
    this.id = response.id
    this.name = response.name
    this.type = response.type
    this.uri = response.type
    this.followers = response.followers
    this.genres = response.genres
    this.images = response.images
    this.popularity = response.popularity
  }
}

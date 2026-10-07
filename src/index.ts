import EasySpotify from './EasySpotify'
import EasySpotifyConfig from './EasySpotifyConfig'

export { EasySpotify, EasySpotifyConfig }
export { SpotifyError } from './SpotifyError'
export * from './models'
export type { GetAlbumOptions } from './models/Album'
export type { GetArtistAlbumsOptions } from './models/Artist'
export type { PagingRequestParams } from './models/Paging'
export type {
  AddPlaylistTracksParams,
  CreatePlaylistParams,
  Playlist,
  RemovePlaylistTracksParams,
  ReplacePlaylistTracksParams,
  UpdatePlaylistParams
} from './models/Playlist'
export type {
  OptionalRequestParams,
  SearchRequestParams
} from './models/Request'
export type { default as Snapshot } from './models/Snapshot'

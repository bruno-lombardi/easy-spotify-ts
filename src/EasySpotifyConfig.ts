const API_URL = 'https://api.spotify.com/v1'

export type SpotifyQuotaMode = 'development' | 'extended'

export interface EasySpotifyOptions {
  /** Must match the quota mode granted to your app by Spotify. */
  quotaMode?: SpotifyQuotaMode
}

export default class EasySpotifyConfig {
  public apiURL: string

  public token: string

  public quotaMode: SpotifyQuotaMode

  constructor(
    token: string,
    apiURLOrOptions: string | EasySpotifyOptions = API_URL,
    options: EasySpotifyOptions = {}
  ) {
    this.token = token
    this.apiURL =
      typeof apiURLOrOptions === 'string' ? apiURLOrOptions : API_URL
    this.quotaMode =
      (typeof apiURLOrOptions === 'string' ? options : apiURLOrOptions)
        .quotaMode ?? 'development'
  }
}

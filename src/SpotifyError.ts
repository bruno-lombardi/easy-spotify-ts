export class SpotifyError extends Error {
  public status: number

  public reason?: string

  constructor(error: { message?: string; status?: number; reason?: string }) {
    super(error.message)
    this.status = error.status ?? 0
    this.reason = error.reason
    this.name = 'SpotifyError'
  }
}

export class SpotifyUnsupportedEndpointError extends Error {
  constructor(public endpoint: string) {
    super(
      `${endpoint} is unavailable in Spotify Development Mode. ` +
        'Use a current-user endpoint where available, or configure quotaMode: "extended" only for an app with that access.'
    )
    this.name = 'SpotifyUnsupportedEndpointError'
  }
}

export class SpotifyError extends Error {
  public status: number

  constructor(error: { message?: string; status?: number }) {
    super(error.message)
    this.status = error.status
    this.name = 'SpotifyError'
  }
}

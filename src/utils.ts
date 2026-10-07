import { AxiosResponse } from 'axios'
import { SpotifyError } from './SpotifyError'

export const handleResponse = (response: AxiosResponse) => {
  if (response.status < 300 && response.status >= 200) {
    return response.data
  }
  throw new SpotifyError({
    message:
      response.data?.error?.message ??
      `Spotify request failed (${response.status})`,
    status: response.status
  })
}

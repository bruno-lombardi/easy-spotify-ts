import { AxiosResponse } from 'axios'
import { SpotifyError } from './SpotifyError'

export const handleResponse = (response: AxiosResponse) => {
  if (response.status === 200) {
    return response.data
  }
  throw new SpotifyError(response.data.error)
}

import { AxiosResponse } from 'axios'

export const handleResponse = (response: AxiosResponse) => {
  if (response.status === 200) {
    return response.data
  }
  throw new Error(response.data)
}

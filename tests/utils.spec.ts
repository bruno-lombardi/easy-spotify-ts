import { AxiosResponse } from 'axios'
import { expect } from 'chai'
import { handleResponse } from '../src/utils'

describe('Utils', () => {
  it('should return the data when status is 200', () => {
    const response = {
      data: { id: 'some id' },
      status: 200
    } as AxiosResponse
    const data = handleResponse(response)
    expect(data).to.eq(response.data)
  })
  it('should throw error when status is not 200', () => {
    const response = {
      data: { id: 'some id' },
      status: 400
    } as AxiosResponse

    expect(() => handleResponse(response)).to.throw
  })
})

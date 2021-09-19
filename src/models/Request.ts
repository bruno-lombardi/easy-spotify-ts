import { PagingRequestParams } from './Paging'

export interface OptionalRequestParams extends PagingRequestParams {
  market?: string
}

export interface SearchRequestParams extends OptionalRequestParams {
  type: string
  include_external?: string
}

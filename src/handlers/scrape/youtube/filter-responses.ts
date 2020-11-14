import { GaxiosResponse } from 'gaxios/build/src/common'

export type Responses<T> = Array<PromiseSettledResult<GaxiosResponse<T>>>
export type SuccessfulResponses<T> = Array<PromiseFulfilledResult<GaxiosResponse<T>>>

export const filterSuccessfulResponses = <T>(responses: Responses<T>): SuccessfulResponses<T> =>
  responses.filter(res => {
    if (res.status === 'fulfilled') {
      return true
    } else {
      console.error('Search failed: ', res)
      return false
    }
  }) as SuccessfulResponses<T>

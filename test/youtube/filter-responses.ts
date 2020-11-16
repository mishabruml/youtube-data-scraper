import { filterSuccessfulResponses, Responses } from '../../src/youtube/filter-responses'
import { youtube_v3 } from 'googleapis'
import { partial } from '../helpers'

describe('filterResponses', () => {
  test('filters an array of youtube promiseAllSettled results and logs for errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const fakeSearchChannelResponses = partial<Responses<youtube_v3.Schema$SearchListResponse>>(
      [
        {
          value: { status: 200 },
          status: 'fulfilled'
        },
        {
          status: 'rejected',
          reason: 'something bad'
        }]
    )

    expect(filterSuccessfulResponses(fakeSearchChannelResponses)).toEqual([{
      value: { status: 200 },
      status: 'fulfilled'
    }])

    expect(consoleErrorSpy).toBeCalledWith('Search failed: ', {
      status: 'rejected',
      reason: 'something bad'
    })
  })
})

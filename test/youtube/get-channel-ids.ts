import { getChannelIds } from '../../src/youtube/get-channel-ids'
import { SuccessfulResponses } from '../../src/youtube/filter-responses'
import { youtube_v3 } from 'googleapis'
import { partial } from '../helpers'

describe('get-channel-ids', () => {
  test('should return channelIds from an array of Search Channel Responses', () => {
    const fakeChannelIds = ['1', '2', '3']

    const fakeSearchChannelResponses = partial<SuccessfulResponses<youtube_v3.Schema$SearchListResponse>>(
      fakeChannelIds.map(channelId =>
        ({ value: { data: { items: [{ snippet: { channelId } }] } }, status: 'fulfilled' })
      )
    )

    expect(getChannelIds(fakeSearchChannelResponses)).toEqual(fakeChannelIds)
  })

  test('should return the channelId from the first item of an items array for a SearchChannelResponse', () => {
    const fakeChannelIds = ['1', '2', '3']
    const fakeItems = fakeChannelIds.map(channelId => ({ snippet: { channelId } }))

    const fakeSearchChannelResponses = partial<SuccessfulResponses<youtube_v3.Schema$SearchListResponse>>(
      [{ value: { data: { items: fakeItems } }, status: 'fulfilled' }]
    )

    expect(getChannelIds(fakeSearchChannelResponses)).toEqual(['1'])
  })
})

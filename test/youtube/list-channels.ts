import { listChannels } from '../../src/youtube/list-channels'
import { youtube_v3 } from 'googleapis'
import { partial } from '../helpers'

describe('listChannels', () => {
  test('should call the youtube channels.list api', async () => {
    const channelIds = ['1', '2', '3']

    const fakeList = jest.fn()
    const fakeYoutube = partial<youtube_v3.Youtube>({
      channels: {
        list: fakeList
      }
    })
    await listChannels(fakeYoutube, channelIds)
    expect(fakeList).toBeCalledWith({
      part: ['contentDetails'],
      maxResults: 1,
      id: channelIds
    })
  })
})

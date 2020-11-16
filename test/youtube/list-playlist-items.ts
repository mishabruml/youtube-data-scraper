import { listPlaylistItems } from '../../src/youtube/list-playlist-items'
import { youtube_v3 } from 'googleapis'
import { partial } from '../helpers'

describe('listPlaylistItems', () => {
  test('should call the youtube playlistItems.list api', async () => {
    const playlistId = '1'
    const pageToken = 'foo'

    const fakeList = jest.fn()
    const fakeYoutube = partial<youtube_v3.Youtube>({
      playlistItems: {
        list: fakeList
      }
    })
    await listPlaylistItems(fakeYoutube, playlistId, pageToken)
    expect(fakeList).toBeCalledWith({
      playlistId,
      part: ['snippet'],
      maxResults: 50,
      pageToken
    })
  })
})

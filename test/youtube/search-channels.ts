import { searchChannels } from '../../src/youtube/search-channels'
import { youtube_v3 } from 'googleapis'
import { partial } from '../helpers'

describe('searchChannels', () => {
  test('should call the youtube search.list api', async () => {
    const searchTerms = ['Global Cycling Network', 'globalmtb']

    const fakeList = jest.fn()
    const fakeYoutube = partial<youtube_v3.Youtube>({
      search: {
        list: fakeList
      }
    })
    await searchChannels(fakeYoutube, searchTerms)

    expect(fakeList).nthCalledWith(1, {
      part: ['snippet'],
      q: 'Global Cycling Network',
      type: ['channel'],
      maxResults: 1
    })

    expect(fakeList).nthCalledWith(2, {
      part: ['snippet'],
      q: 'globalmtb',
      type: ['channel'],
      maxResults: 1
    })
  })
})

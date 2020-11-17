import { getPlaylistItemsData } from '../../src/youtube/get-playlist-items-data'
import { GaxiosResponse } from 'gaxios/build/src/common'
import { youtube_v3 } from 'googleapis'
import { partial } from '../helpers'

describe('getPlaylistItemsData', () => {
  test('should return playlist items from a playlistItemListResponse', () => {
    const fakePlaylistId = 'playlist-id-123'
    const fakeNextPageToken = 'foo'

    const video1 = {
      title: 'interesting video',
      publishedAt: '12345'
    }

    const video2 = {
      title: 'another interesting video',
      publishedAt: '54321'
    }

    const fakePlaylistListItemsResponse = partial<GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>>({
      data: {
        items: [
          { snippet: video1 },
          { snippet: video2 }
        ],
        nextPageToken: fakeNextPageToken
      }
    })

    expect(getPlaylistItemsData(fakePlaylistListItemsResponse, fakePlaylistId)).toEqual({
      videoData: [video1, video2],
      nextPageToken: fakeNextPageToken,
      playlistId: fakePlaylistId
    })
  })

  test('should return empty array when playlistItemListResponse items is undefined', () => {
    const fakePlaylistId = 'playlist-id-123'
    const fakeNextPageToken = 'foo'

    const fakePlaylistListItemsResponse = partial<GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>>({
      data: {
        items: undefined,
        nextPageToken: fakeNextPageToken
      }
    })

    expect(getPlaylistItemsData(fakePlaylistListItemsResponse, fakePlaylistId)).toEqual({
      videoData: [],
      nextPageToken: fakeNextPageToken,
      playlistId: fakePlaylistId
    })
  })

  test('should return undefined videos when playlistItemListResponse video snippets are undefined', () => {
    const fakePlaylistId = 'playlist-id-123'
    const fakeNextPageToken = 'foo'

    const fakePlaylistListItemsResponse = partial<GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>>({
      data: {
        items: [
          {
            snippet: undefined
          }
        ],
        nextPageToken: fakeNextPageToken
      }
    })

    expect(getPlaylistItemsData(fakePlaylistListItemsResponse, fakePlaylistId)).toEqual({
      videoData: [
        {
          title: undefined,
          publishedAt: undefined
        }
      ],
      nextPageToken: fakeNextPageToken,
      playlistId: fakePlaylistId
    })
  })
})

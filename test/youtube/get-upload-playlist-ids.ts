import { getUploadPlaylistIds } from '../../src/youtube/get-upload-playlist-ids'
import { GaxiosResponse } from 'gaxios/build/src/common'
import { youtube_v3 } from 'googleapis'
import { partial } from '../helpers'

describe('getUploadPlaylistIds', () => {
  test('should return uploadPlaylistIds from a listChannels response for multiple channels', () => {
    const uploadPlaylistId1 = 'upload-playlist-id-1'
    const uploadPlaylistId2 = 'upload-playlist-id-1'

    const fakeListChannelsResponse = partial<GaxiosResponse<youtube_v3.Schema$ChannelListResponse>>({
      data: {
        items: [
          {
            contentDetails: {
              relatedPlaylists: {
                uploads: uploadPlaylistId1
              }
            }
          },
          {
            contentDetails: {
              relatedPlaylists: {
                uploads: uploadPlaylistId2
              }
            }
          }
        ]
      }
    })

    expect(getUploadPlaylistIds(fakeListChannelsResponse)).toEqual([uploadPlaylistId1, uploadPlaylistId2])
  })

  test('should return an empty array when listChannels response uploads is undefined', () => {
    const fakeListChannelsResponse = partial<GaxiosResponse<youtube_v3.Schema$ChannelListResponse>>({
      data: {
        items: [
          {
            contentDetails: {
              relatedPlaylists: { uploads: undefined }
            }
          }
        ]
      }
    })

    expect(getUploadPlaylistIds(fakeListChannelsResponse)).toEqual([])
  })

  test('should return an empty array when listChannels response relatedPlaylists is undefined', () => {
    const fakeListChannelsResponse = partial<GaxiosResponse<youtube_v3.Schema$ChannelListResponse>>({
      data: {
        items: [
          {
            contentDetails: {
              relatedPlaylists: undefined
            }
          }
        ]
      }
    })

    expect(getUploadPlaylistIds(fakeListChannelsResponse)).toEqual([])
  })

  test('should return an empty array when listChannels response contentDetails is undefined', () => {
    const fakeListChannelsResponse = partial<GaxiosResponse<youtube_v3.Schema$ChannelListResponse>>({
      data: {
        items: [
          {
            contentDetails: undefined
          }
        ]
      }
    })

    expect(getUploadPlaylistIds(fakeListChannelsResponse)).toEqual([])
  })

  test('should return empty array when listChannels response items is undefined', () => {
    const fakeListChannelsResponse = partial<GaxiosResponse<youtube_v3.Schema$ChannelListResponse>>({
      data: {}
    })

    expect(getUploadPlaylistIds(fakeListChannelsResponse)).toEqual([])
  })
})

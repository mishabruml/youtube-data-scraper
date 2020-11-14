import { youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios/build/src/common'

export type UploadPlaylistIds = string[]

export const getUploadPlaylistIds = (listChannelsResponse: GaxiosResponse<youtube_v3.Schema$ChannelListResponse>): UploadPlaylistIds =>
  listChannelsResponse.data.items?.map(item =>
    item.contentDetails?.relatedPlaylists?.uploads as string
  ) ?? []

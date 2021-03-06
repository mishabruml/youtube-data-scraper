import { youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios/build/src/common'
import { PlaylistId, UploadPlaylistIds } from './models'

export const getUploadPlaylistIds = (listChannelsResponse: GaxiosResponse<youtube_v3.Schema$ChannelListResponse>): UploadPlaylistIds =>
  listChannelsResponse.data.items?.reduce<PlaylistId[]>((filtered, item) => {
    if (item.contentDetails?.relatedPlaylists?.uploads) {
      filtered.push(item.contentDetails.relatedPlaylists.uploads)
    }
    return filtered
  }, []) ?? []

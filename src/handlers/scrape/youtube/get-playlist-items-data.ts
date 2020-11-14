import { youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios/build/src/common'
// import { SuccessfulResponses } from './filter-responses'

export interface VideoData {
  publishedAt: string
  title: string
}

export const getPlaylistItemsData = (playlistItemListResponse: GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>) => {
  // TODO: validate here and implement a custom type to stop the type casting
  const { data: { items, nextPageToken } } = playlistItemListResponse
  let playlistId
  return {
    videoData: items?.map(item => {
      playlistId = item.snippet?.playlistId
      return {
        title: item.snippet?.title as string,
        publishedAt: item.snippet?.publishedAt as string
      }
    }),
    nextPageToken,
    playlistId
  }
}

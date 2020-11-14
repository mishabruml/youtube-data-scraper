import { youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios/build/src/common'

export type NextPageToken = string | undefined
export type PlaylistId = string

export interface VideoData {
  publishedAt: string
  title: string
}

export interface PlaylistItemsData {
  videoData: VideoData[] | undefined
  playlistId: string
  nextPageToken: NextPageToken
}

// TODO: validate here, stop typecasting
export const getPlaylistItemsData = (playlistItemListResponse: GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>, playlistId: PlaylistId): PlaylistItemsData => ({
  videoData: playlistItemListResponse.data.items?.map(item => (
    {
      title: item.snippet?.title as string,
      publishedAt: item.snippet?.publishedAt as string
    }
  )),
  nextPageToken: playlistItemListResponse.data.nextPageToken as NextPageToken,
  playlistId
})

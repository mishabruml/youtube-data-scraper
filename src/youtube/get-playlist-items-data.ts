import { youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios/build/src/common'
import {
  NextPageToken,
  PrevPageToken,
  PlaylistId,
  PlaylistItemsData
} from './models'

// TODO: validate here, stop typecasting
export const getPlaylistItemsData = (playlistItemListResponse: GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>, playlistId: PlaylistId): PlaylistItemsData => ({
  videoData: playlistItemListResponse.data.items?.map(item => (
    {
      title: item.snippet?.title as string,
      publishedAt: item.snippet?.publishedAt as string
    }
  )),
  nextPageToken: playlistItemListResponse.data.nextPageToken as NextPageToken,
  prevPageToken: playlistItemListResponse.data.prevPageToken as PrevPageToken,
  playlistId
})

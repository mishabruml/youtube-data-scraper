export type SearchTerms = string[]
export type ChannelIds = string[]

export type PlaylistId = string
export type UploadPlaylistIds = PlaylistId[]

export interface VideoData {
  publishedAt: string
  title: string
}

export interface PlaylistItemsData {
  videoData: VideoData[] | undefined
  playlistId: PlaylistId
  nextPageToken: NextPageToken
  prevPageToken: PrevPageToken
}
export type NextPageToken = string | undefined
export type PrevPageToken = string | undefined

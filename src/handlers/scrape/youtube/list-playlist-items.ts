import { youtube_v3 } from 'googleapis'

export const listPlaylistItems = (youtubeClient: youtube_v3.Youtube, playlistId: string, pageToken: string | undefined) =>
  youtubeClient.playlistItems.list({
    playlistId,
    part: ['snippet'],
    maxResults: 50,
    pageToken
  })

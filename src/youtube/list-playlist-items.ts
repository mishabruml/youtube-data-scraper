import { youtube_v3 } from 'googleapis'
import { NextPageToken, PlaylistId } from './models'

export const listPlaylistItems = (youtubeClient: youtube_v3.Youtube, playlistId: PlaylistId, pageToken: NextPageToken) =>
  youtubeClient.playlistItems.list({
    playlistId,
    part: ['snippet'],
    maxResults: 50,
    pageToken
  })

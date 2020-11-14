import { youtube_v3 } from 'googleapis'
import { ChannelIds } from './get-channel-ids'

export const listChannels = (youtubeClient: youtube_v3.Youtube, channelIds: ChannelIds) =>
  youtubeClient.channels.list({
    part: ['contentDetails'],
    maxResults: 1,
    id: channelIds
  })

import { google } from 'googleapis'
import { searchChannels } from '../../youtube/search-channels'
import { getChannelIds } from '../../youtube/get-channel-ids'
import { listChannels } from '../../youtube/list-channels'
import { getUploadPlaylistIds } from '../../youtube/get-upload-playlist-ids'
import { filterSuccessfulResponses } from '../../youtube/filter-responses'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
})

export const handler = async () => {
  const searchChannelResponses = await Promise.allSettled(searchChannels(youtube, ['Global Cycling Network', 'globalmtb']))
  const successfulSearchChannelResponses = filterSuccessfulResponses(searchChannelResponses)
  const channelIds = getChannelIds(successfulSearchChannelResponses)
  // const channelIds = ['UCuTaETsuCOkJ0H_GAztWt0Q', 'UC_A--fhX5gea0i4UtpD99Gg']

  const listChannelResponses = await listChannels(youtube, channelIds)
  const uploadPlaylistIds = getUploadPlaylistIds(listChannelResponses)
  // todo: send playlistIds to SQS
  // const uploadPlaylistIds = ['UUuTaETsuCOkJ0H_GAztWt0Q', 'UU_A--fhX5gea0i4UtpD99Gg']
  console.log(uploadPlaylistIds)
  return
}

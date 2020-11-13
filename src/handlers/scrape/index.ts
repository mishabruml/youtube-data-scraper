import { google } from 'googleapis'
import { listChannels } from './youtube/list-channels'
import { processChannels } from './youtube/process-channels'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
})

export const handler = async () => {
  const listChannelResponses = await Promise.allSettled(listChannels(youtube, ['Global Cycling Network', 'globalmtb']))
  const channels = processChannels(listChannelResponses)
  console.log(channels)
}
(async () => { handler() })()

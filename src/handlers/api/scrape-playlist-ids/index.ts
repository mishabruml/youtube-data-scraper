import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { google } from 'googleapis'
import { searchChannels } from '../../../youtube/search-channels'
import { getChannelIds } from '../../../youtube/get-channel-ids'
import { listChannels } from '../../../youtube/list-channels'
import { getUploadPlaylistIds } from '../../../youtube/get-upload-playlist-ids'
import { filterSuccessfulResponses } from '../../../youtube/filter-responses'
import { sendScrapeVideosRequest } from '../../../sqs'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
})

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const channels = event.multiValueQueryStringParameters?.channel
  if (channels) {
    try {
      // search for channel strings to get channel ids
      console.info(`scraping request initaited for ${channels}`)
      const searchChannelResponses = await Promise.allSettled(searchChannels(youtube, channels))
      const successfulSearchChannelResponses = filterSuccessfulResponses(searchChannelResponses)
      const channelIds = getChannelIds(successfulSearchChannelResponses)
      console.info(`found channel ids ${channelIds}, listing channels...`)

      // list channels by id to get uploads playlist ids
      const listChannelResponses = await listChannels(youtube, channelIds)
      const uploadPlaylistIds = getUploadPlaylistIds(listChannelResponses)
      console.info(`found upload playlist ids ${uploadPlaylistIds}, sending for video data scraping...`)

      // send upload playlist ids to video scraper
      await Promise.allSettled(uploadPlaylistIds.map(playlistId => sendScrapeVideosRequest({ playlistId, pageToken: undefined })))
    } catch (e) {
      console.error(e)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Could not scrape channel(s) ${channels}`
        })
      }
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `youtube data scrape request initated for ${channels}`
    })
  }
}

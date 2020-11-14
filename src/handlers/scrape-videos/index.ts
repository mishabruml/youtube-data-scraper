import { google } from 'googleapis'
import { listPlaylistItems } from '../../youtube/list-playlist-items'
import { getPlaylistItemsData, NextPageToken, PlaylistId } from '../../youtube/get-playlist-items-data'
import { SQSEvent, SQSRecord } from 'aws-lambda'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
})

export interface ScrapeVideosRequestQueueRecordBody {
  playlistId: PlaylistId
  pageToken: NextPageToken
}

export interface ScrapeVideosRequestQueueRecord extends Omit<SQSRecord, 'body'> {
  body: ScrapeVideosRequestQueueRecordBody
}

export interface ScrapeVideosRequestQueueEvent extends Omit<SQSEvent, 'Records'> {
  Records: ScrapeVideosRequestQueueRecord[]
}

export const handler = async (event: ScrapeVideosRequestQueueEvent) => {
  const results = await Promise.allSettled(event.Records.map(async record => {
    const { body: { playlistId, pageToken } } = record
    const playlistItemsResponse = await listPlaylistItems(youtube, playlistId, pageToken)
    return getPlaylistItemsData(playlistItemsResponse, playlistId)
  }))

  results.filter(res => {
    if (res.status === 'fulfilled') {
      // todo store res.value.videoData, send new event to queue
      console.log(res.value)
    } else {
      console.error('Search failed: ', res)
    }
  })
}

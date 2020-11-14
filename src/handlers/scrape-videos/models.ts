import { NextPageToken, PlaylistId } from '../../youtube/models'
import { SQSEvent, SQSRecord } from 'aws-lambda'

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

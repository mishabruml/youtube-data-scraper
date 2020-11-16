import { SQSEvent, SQSRecord } from 'aws-lambda'
import { VideoData } from '../../youtube/models'

export interface StoreVideoQueueRecord extends Omit<SQSRecord, 'body'> {
  body: VideoData
}

export interface StoreVideoQueueEvent extends Omit<SQSEvent, 'Records'> {
  Records: StoreVideoQueueRecord[]
}

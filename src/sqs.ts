import { ScrapeVideosRequestQueueRecordBody } from './handlers/scrape-videos/models'
import { SQS } from 'aws-sdk'
import { VideoData } from './youtube/models'
import config from './config'
const sqs = new SQS()

export const sendScrapeVideosRequest = async ({ playlistId, pageToken }: ScrapeVideosRequestQueueRecordBody) => {
  const messageParams = {
    QueueUrl: config.aws.sqs.scrapeVideosQueueUrl,
    MessageBody: JSON.stringify({ playlistId, pageToken })
  }

  await sqs.sendMessage(messageParams).promise().catch(console.error)
}

export const sendStoreVideosRequest = async (videoData: VideoData) => {
  const messageParams = {
    QueueUrl: config.aws.sqs.storeVideosQueueUrl,
    MessageBody: JSON.stringify(videoData)
  }

  await sqs.sendMessage(messageParams).promise().catch(console.error)
}

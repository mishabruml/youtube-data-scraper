import { ScrapeVideosRequestQueueRecordBody } from './handlers/scrape-videos/models'
import { SQS } from 'aws-sdk'
import { VideoData } from './youtube/models'
const sqs = new SQS()

export const sendScrapeVideosRequest = async ({ playlistId, pageToken }: ScrapeVideosRequestQueueRecordBody) => {
  const messageParams = {
    QueueUrl: process.env.SCRAPE_VIDEOS_REQUEST_QUEUE_URL as string,
    MessageBody: JSON.stringify({ playlistId, pageToken })
  }

  await sqs.sendMessage(messageParams).promise().catch(console.error)
}

export const sendStoreVideosRequest = async (videoData: VideoData) => {
  const messageParams = {
    QueueUrl: process.env.STORE_VIDEOS_QUEUE_URL as string,
    MessageBody: JSON.stringify(videoData)
  }

  await sqs.sendMessage(messageParams).promise().catch(console.error)
}

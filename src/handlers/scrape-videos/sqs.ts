import { ScrapeVideosRequestQueueRecordBody } from './models'
import { SQS } from 'aws-sdk'
const sqs = new SQS()

export const sendScrapeVideosRequest = async ({ playlistId, pageToken }: ScrapeVideosRequestQueueRecordBody) => {
  const messageParams = {
    QueueUrl: process.env.SCRAPE_VIDEOS_REQUEST_QUEUE_URL as string,
    MessageBody: JSON.stringify({ playlistId, pageToken })
  }

  await sqs.sendMessage(messageParams).promise().catch(console.error)
}

import { StoreVideoQueueEvent } from './models'
import { str as hash } from 'crc-32'
import { formatDateISOtoSQL } from './utils'
import { connectDb } from '../../db'

export const eventHandler = async (event: StoreVideoQueueEvent) => {
  const { video } = await connectDb()
  const records = event.Records.map(record => {
    const { title, publishedAt } = record.body
    const id = hash(title + publishedAt) // create id hash from title and publishedAt
    const date = formatDateISOtoSQL(record.body.publishedAt)
    return { id, title, date }
  })
  return video.bulkCreate(records)
}

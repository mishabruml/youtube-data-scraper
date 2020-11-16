import { StoreVideoQueueEvent } from './models'
import { str as hash } from 'crc-32'
import { formatDateISOtoSQL } from './utils'
import { connectDb } from '../../db'

export const eventHandler = async (event: StoreVideoQueueEvent) => {
  const { video } = await connectDb()
  const results = await Promise.allSettled(event.Records.map(async record => {
    const { title, publishedAt } = record.body
    const id = hash(title + publishedAt) // create id hash from title and publishedAt
    const date = formatDateISOtoSQL(record.body.publishedAt)

    console.log({ id, title, publishedAt, date })
    await video.create({ id, title, date })
  }))

  results.forEach(result => {
    if (result.status === 'rejected') {
      console.error('Storing videos failed: ', result)
    }
  })
  return
}

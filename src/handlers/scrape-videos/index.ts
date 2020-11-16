import middy from '@middy/core'
import sqsJsonBodyParser from '@middy/sqs-json-body-parser'
import { eventHandler } from './event'

export const handler = middy(eventHandler).use(sqsJsonBodyParser())

import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda'
import { partial } from '../../../helpers'

jest.mock('../../../../src/config.ts', () => ({
  aws: {
    sqs: {
      scrapeVideosQueueUrl: 'fakeQueueUrl'
    }
  }
}))

jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => ({
      search: {
        list: jest.fn().mockResolvedValue({
          data: {
            items: [
              {
                snippet: {
                  channelId: 'foo'
                }
              }
            ]
          }
        })
      },
      channels: {
        list: jest.fn().mockResolvedValue({
          data: {
            items: [
              {
                contentDetails: {
                  relatedPlaylists: {
                    uploads: 'bar'
                  }
                }
              }
            ]
          }
        })
      }
    }))
  }
}))

const mockSqsPromise = jest.fn()
const mockSqsSendMessage = jest.fn(() => ({ promise: mockSqsPromise }))
jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    sendMessage: mockSqsSendMessage
  }))
}))

describe('scrape-playlist-ids handler', () => {
  test(`GIVEN some channel search terms via querystring
  THEN channelIds obtained by youtube search
  THEN uploads playlists ids obtained by list channels
  THEN the ids should be sent to the scrape videos queue`, async () => {
    const event = partial<APIGatewayProxyEvent>({
      multiValueQueryStringParameters: { channel: ['Global Cycling Network'] }
    })
    const context = partial<Context>({})
    const callback = partial<Callback>({})

    const { handler } = await import('../../../../src/handlers/api/scrape-playlist-ids/index')
    await handler(event, context, callback)
    expect(mockSqsSendMessage)
      .toBeCalledWith({
        MessageBody: JSON.stringify({ playlistId: 'bar' }),
        QueueUrl: 'fakeQueueUrl'
      })
  })
})

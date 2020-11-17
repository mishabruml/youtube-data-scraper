import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { connectDb } from '../../../db'

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const { video } = await connectDb()
    const videoResults = await video.findAll({ raw: true })

    const videoResultsData = videoResults.map(video => ({
      id: video.id,
      title: video.title,
      date: video.date
    }))

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(videoResultsData)
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Could not get video'
      })
    }
  }
}

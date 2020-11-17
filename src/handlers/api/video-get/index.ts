import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { connectDb } from '../../../db'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const queryId = event.pathParameters?.id

  if (!queryId) {
    return {
      statusCode: 400,
      body: 'Please provide id path parameter'
    }
  }

  try {
    const { video } = await connectDb()
    const videoResult = await video.findByPk(queryId, {
      raw: true,
      rejectOnEmpty: true
    })

    console.log(videoResult)

    const { id, title, date } = videoResult

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ id, title, date })
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: e.errorType === 'SequelizeEmptyResultError' ? 404 : 500,
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

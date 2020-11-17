import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { connectDb } from '../../../db'
import { Op } from 'sequelize'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const search = event.queryStringParameters?.q

  if (!search) {
    return {
      statusCode: 400,
      body: 'Please provide search querystring'
    }
  }

  try {
    const { video } = await connectDb()
    const videoResults = await video.findAll({
      where: {
        title: {
          [Op.like]: `%${search}%`
        }
      },
      raw: true
    })

    const videoResultsData = videoResults.map(video => ({
      id: video.id,
      title: video.title
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

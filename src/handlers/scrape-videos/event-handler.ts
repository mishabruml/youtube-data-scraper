import { google } from 'googleapis'
import { listPlaylistItems } from '../../youtube/list-playlist-items'
import { getPlaylistItemsData } from '../../youtube/get-playlist-items-data'
import { sendScrapeVideosRequest } from './sqs'
import { ScrapeVideosRequestQueueEvent } from './models'
import { isLastPage, stringContainsSearchTerms } from './utils'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
})

export const eventHandler = async (event: ScrapeVideosRequestQueueEvent) => {
  const results = await Promise.allSettled(event.Records.map(async (record) => {
    const { body: { playlistId, pageToken } } = record
    const playlistItemsResponse = await listPlaylistItems(youtube, playlistId, pageToken)
    const { nextPageToken, prevPageToken, videoData } = getPlaylistItemsData(playlistItemsResponse, playlistId)

    const searchTerms = ['pro',
      'matt stephens',
      '5',
      'Mitchelton-Scott',
      'Dubai stage'
    ]

    const searchMatches = videoData?.filter(video => stringContainsSearchTerms(video.title, searchTerms))

    console.log(searchMatches)

    if (!isLastPage(nextPageToken, prevPageToken)) {
      await sendScrapeVideosRequest({ playlistId, pageToken: nextPageToken })
    } else {
      console.log('Last page reached: no more videos for channel')
    }
  }))

  results.forEach(result => {
    if (result.status === 'rejected') {
      console.error('Getting videos failed: ', result)
    }
  })
}

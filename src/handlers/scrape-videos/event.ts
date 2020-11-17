import { google } from 'googleapis'
import { listPlaylistItems } from '../../youtube/list-playlist-items'
import { getPlaylistItemsData } from '../../youtube/get-playlist-items-data'
import { sendScrapeVideosRequest, sendStoreVideosRequest } from '../../sqs'
import { ScrapeVideosRequestQueueEvent } from './models'
import { isLastPage } from './utils'
import { filterTitles } from './filter-titles'
import { getSearchFilter } from './get-search-filter-file'
import config from '../../config'

export const eventHandler = async (event: ScrapeVideosRequestQueueEvent) => {
  const youtube = google.youtube({
    version: 'v3',
    auth: config.googleApiKey
  })
  const results = await Promise.allSettled(event.Records.map(async (record) => {
    const { body: { playlistId, pageToken } } = record
    const playlistItemsResponse = await listPlaylistItems(youtube, playlistId, pageToken)
    const { nextPageToken, videoData } = getPlaylistItemsData(playlistItemsResponse, playlistId)

    if (videoData) {
      const searchFilter = await getSearchFilter(config.searchFilterFilename)
      const searchMatches = filterTitles(videoData, searchFilter)
      searchMatches.map(sendStoreVideosRequest)
    }

    if (!isLastPage(nextPageToken)) {
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

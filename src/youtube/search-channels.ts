import { youtube_v3 } from 'googleapis'
import { SearchTerms } from './models'

export const searchChannels = (youtubeClient: youtube_v3.Youtube, searchTerms: SearchTerms) =>
  searchTerms.map(q =>
    youtubeClient.search.list({
      part: ['snippet'],
      q,
      type: ['channel'],
      maxResults: 1
    })
  )

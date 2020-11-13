import { youtube_v3 } from 'googleapis'

export const listChannels = (youtubeClient: youtube_v3.Youtube, searchTerms: string[]) => (
  searchTerms.map(q =>
    youtubeClient.search.list({
      part: ['snippet'],
      q,
      type: ['channel'],
      maxResults: 1
    })
  )
)

import { youtube_v3 } from 'googleapis'
import { SuccessfulResponses } from './filter-responses'
import { ChannelIds } from './models'

export const getChannelIds = (searchChannelResponses: SuccessfulResponses<youtube_v3.Schema$SearchListResponse>): ChannelIds =>
  searchChannelResponses
    .map(res => {
      // TODO: validate here and implement a custom type to stop the type casting
      const items = res.value.data.items ?? []
      const channel = items[0]
      const snippet = channel.snippet as youtube_v3.Schema$SearchResultSnippet
      const { channelId } = snippet
      return channelId as string
    })

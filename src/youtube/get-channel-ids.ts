import { youtube_v3 } from 'googleapis'
import { SuccessfulResponses } from './filter-responses'
import { ChannelIds } from './models'

export const getChannelIds = (searchChannelResponses: SuccessfulResponses<youtube_v3.Schema$SearchListResponse>): ChannelIds =>
  searchChannelResponses
    .reduce<ChannelIds>((filtered, res) => {
    if (res.value.data.items?.[0].snippet) {
      const snippet = res.value.data.items[0].snippet
      const { channelId } = snippet
      filtered.push(channelId as string)
    }
    return filtered
  }, [])

import { youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios/build/src/common'

type ChannelResponses = Array<PromiseSettledResult<GaxiosResponse<youtube_v3.Schema$SearchListResponse>>>

export const processChannels = (channelResponses: ChannelResponses) =>
  channelResponses.map(res => {
    if (res.status === 'rejected') {
      console.log('Could not fetch result', res)
      return {}
    } else {
    // TODO: validate here
      const items = res.value.data.items ?? []
      const channel = items[0]
      const snippet = channel.snippet as youtube_v3.Schema$SearchResultSnippet
      const { title, channelId } = snippet
      return { title, channelId }
    }
  })

import { VideoData } from '../../youtube/models'
import { stringContainsSearchTerms } from './utils'

export const filterTitles = (videoData: VideoData[], searchTerms) =>
  videoData.filter(video => stringContainsSearchTerms(video.title, searchTerms))

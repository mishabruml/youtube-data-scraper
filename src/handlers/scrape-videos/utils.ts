import { NextPageToken, PrevPageToken } from '../../youtube/models'

export const isLastPage = (nextPageToken: NextPageToken, prevPageToken: PrevPageToken) =>
  prevPageToken && (nextPageToken === undefined)

export const stringContainsSearchTerms = (str, searchTerms) =>
  searchTerms.some(substring => normaliseString(str).includes(normaliseString(substring)))

export const normaliseString = (str: string) => str.toLowerCase().replace(/\s/g, '')

// console.log(stringContainsSearchTerm('The Big Dubai Stage', searchTerms))

import { YoutubeConfigError } from './errors.js'

export const getYoutubeApiKey = () => {
  const apiKey = process.env.YT_API_KEY

  if (!apiKey) {
    throw new YoutubeConfigError('Missing YT_API_KEY')
  }

  return apiKey
}

const parseIdList = (rawValue) => {
  return String(rawValue || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

export const getFeaturedArrangementVideoId = () => {
  const videoId = process.env.FEATURED_ARRANGEMENT_ID?.trim()

  if (!videoId) {
    throw new YoutubeConfigError('Missing FEATURED_ARRANGEMENT_ID')
  }

  return [videoId]
}

export const getMoreArrangementVideoIds = () => {
  const videoIds = parseIdList(process.env.MORE_ARRANGEMENTS_IDS)

  if (videoIds.length === 0) {
    throw new YoutubeConfigError('Missing MORE_ARRANGEMENTS_IDS')
  }

  return videoIds
}

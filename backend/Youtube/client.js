import fetch from 'node-fetch'
import { getYoutubeApiKey } from './config.js'
import { YoutubeApiError } from './errors.js'

const buildVideosUrl = (videoIds) => {
  const searchParams = new URLSearchParams({
    key: getYoutubeApiKey(),
    id: videoIds.join(','),
    part: 'snippet,statistics',
  })

  return `https://www.googleapis.com/youtube/v3/videos?${searchParams.toString()}`
}

export const fetchYoutubeVideosByIds = async (videoIds) => {
  const response = await fetch(buildVideosUrl(videoIds))
  const data = await response.json()

  if (!response.ok) {
    throw new YoutubeApiError(data?.error?.message || 'YouTube error')
  }

  return Array.isArray(data.items) ? data.items : []
}

import {
  getFeaturedArrangementVideoId,
  getMoreArrangementVideoIds,
  getPerformanceVideoIds,
} from './config.js'
import { fetchYoutubeVideosByIds } from './client.js'
import { mapYoutubeVideo } from './mapper.js'

const getVideosForIds = async (videoIds) => {
  const items = await fetchYoutubeVideosByIds(videoIds)
  return items.map(mapYoutubeVideo)
}

export const getFeaturedArrangementVideos = async () => {
  return getVideosForIds(getFeaturedArrangementVideoId())
}

export const getMoreArrangementVideos = async () => {
  return getVideosForIds(getMoreArrangementVideoIds())
}

export const getPerformanceVideos = async () => {
  return getVideosForIds(getPerformanceVideoIds())
}

import {
  getFeaturedArrangementVideos,
  getMoreArrangementVideos,
  getPerformanceVideos,
} from './service.js'

const respondWithVideos = async (res, loader) => {
  try {
    const videos = await loader()
    return res.json({ videos })
  } catch (error) {
    console.error('yt fetch failed:', error.message)

    return res.status(error.statusCode || 500).json({
      error: error.publicMessage || 'Failed to fetch YouTube videos',
    })
  }
}

export const getFeaturedArrangement = async (req, res) => {
  return respondWithVideos(res, getFeaturedArrangementVideos)
}

export const getMoreArrangement = async (req, res) => {
  return respondWithVideos(res, getMoreArrangementVideos)
}

export const getPerformance = async (req, res) => {
  return respondWithVideos(res, getPerformanceVideos)
}

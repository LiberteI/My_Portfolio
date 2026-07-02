const THUMBNAIL_PRIORITY = ['maxres', 'standard', 'high', 'medium', 'default']

const getThumbnailUrl = (thumbnails) => {
  if (!thumbnails) return null

  for (const key of THUMBNAIL_PRIORITY) {
    if (typeof thumbnails[key]?.url === 'string') {
      return thumbnails[key].url
    }
  }

  return null
}

export const mapYoutubeVideo = (item) => {
  const snippet = item?.snippet ?? {}
  const resolvedId =
    typeof item?.id === 'object' && typeof item.id.videoId === 'string'
      ? item.id.videoId
      : item?.id

  return {
    id: typeof resolvedId === 'string' ? resolvedId : null,
    title: typeof snippet.title === 'string' ? snippet.title : 'Untitled performance',
    description: typeof snippet.description === 'string' ? snippet.description : '',
    publishedAt: typeof snippet.publishedAt === 'string' ? snippet.publishedAt : null,
    thumbnail: getThumbnailUrl(snippet.thumbnails),
  }
}

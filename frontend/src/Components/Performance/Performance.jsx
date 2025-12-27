import './Performance.css'
import { useEffect, useState } from 'react'

const Performance = () => {
  const [videos, setVideos] = useState([])
  const [status, setStatus] = useState('idle')
  // if remote exists, use it. otherwise, fall back
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:8080' : window.location.origin)

  useEffect(() => {
    const fetchVideos = async () => {
      setStatus('loading')

      try {
        const response = await fetch(`${apiBase}/api/youtube`)
        if (!response.ok) {
          throw new Error('Request failed')
        }

        const data = await response.json()
        let items = []
        if (data && Array.isArray(data.videos)) {
          items = data.videos
        }
        setVideos(items)
        setStatus('success')
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }

    fetchVideos()
  }, [apiBase])

  const handleCardClick = (videoId) => {
    if (!videoId) {
      return
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className='performance' id='performance'>
      <h1>My Performances</h1>

      {status === 'loading' && <p className='performance-loading'>Loading Performances</p>}
      {status === 'error' && <p className='performance-error'>Fail to load performances</p>}

      <div className='performance-grid'>
        {videos.map((video) => (
          <article
            className='performance-card'
            key={video.id || video.title}
            onClick={() => handleCardClick(video.id)}
          >
            <h3>{video.title}</h3>
            {video.thumbnail && (
              <img
                className='performance-thumbnail'
                src={video.thumbnail}
                alt={video.title}
              />
            )}
            <p>{video.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Performance

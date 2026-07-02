import { useEffect, useState } from 'react'
import MusicHeader from '../../Components/Music/MusicHeader'

const SURFACE_CARD_CLASS = 'rounded-2xl border border-neutral-700/70 bg-neutral-900/80'
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@Liberteeeee-hd7zg'

const formatPerformanceDate = (value) => {
  if (!value) return 'Date unavailable'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

const mapVideoToPerformance = (video) => {
  if (!video?.id) return null

  return {
    title: video.title || 'Untitled performance',
    meta: formatPerformanceDate(video.publishedAt),
    thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
    href: `https://www.youtube.com/watch?v=${video.id}`,
  }
}

const PlayIcon = () => {
  return (
    <div className='flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-black/35 backdrop-blur-sm'>
      <span
        className='ml-1 block h-0 w-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-white'
        aria-hidden='true'
      />
    </div>
  )
}

const PerformanceCard = ({ item }) => {
  return (
    <a className='group flex flex-col gap-4' href={item.href} target='_blank' rel='noreferrer'>
      <div className='relative overflow-hidden rounded-2xl border border-neutral-700/70 bg-neutral-950/70'>
        <div className='aspect-[16/10] w-full bg-black/40'>
          <img
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
            src={item.thumbnail}
            alt={`${item.title} performance thumbnail`}
          />
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <PlayIcon />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-xl text-neutral-100 transition-colors duration-150 group-hover:text-[#E6B870]'>
          {item.title}
        </p>
        <p className='text-sm text-neutral-400'>{item.meta}</p>
      </div>
    </a>
  )
}

const Performance = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const [performanceItems, setPerformanceItems] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadPerformanceVideos = async () => {
      try {
        const response = await fetch(`${apiBase}/api/youtube/performance`)

        if (!response.ok) {
          throw new Error('Failed to load performance videos')
        }

        const payload = await response.json()

        if (!isMounted) {
          return
        }

        const videos = Array.isArray(payload?.videos)
          ? payload.videos.map(mapVideoToPerformance).filter(Boolean)
          : []

        setPerformanceItems(videos)
      } catch (error) {
        console.error('Unable to load performance videos', error)
      }
    }

    loadPerformanceVideos()

    return () => {
      isMounted = false
    }
  }, [apiBase])

  return (
    <section
      className={`${SURFACE_CARD_CLASS} self-center min-h-[300px] w-[calc(100%-1.5rem)] max-w-[110rem] p-6 md:w-[calc(100%-3rem)] md:p-8 lg:p-10`}
    >
      <div className='flex flex-col gap-8 overflow-hidden'>
        <div className='flex flex-col gap-6'>
          <MusicHeader
            number={3}
            title='Performances Showcase'
            subtitle='Capturing moments, sharing music.'
          />
        </div>

        {performanceItems.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {performanceItems.map((item) => (
              <PerformanceCard key={item.href} item={item} />
            ))}
          </div>
        ) : (
          <div className='flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-neutral-700/80 bg-neutral-950/40 p-5 text-sm text-neutral-500'>
            Performance videos unavailable
          </div>
        )}

        <div className='flex justify-center'>
          <a
            className='inline-flex items-center rounded-xl border border-[#c6942f]/40 bg-[#c6942f]/10 px-6 py-3 text-sm font-medium text-[#E6B870] transition-colors duration-150 hover:border-[#c6942f]/70 hover:bg-[#c6942f]/15'
            href={YOUTUBE_CHANNEL_URL}
            target='_blank'
            rel='noreferrer'
          >
            View All Performances
          </a>
        </div>
      </div>
    </section>
  )
}

export default Performance

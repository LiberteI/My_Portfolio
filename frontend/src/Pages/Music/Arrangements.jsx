import MusicHeader from '../../Components/Music/MusicHeader'

const SURFACE_CARD_CLASS = 'rounded-2xl border border-neutral-700/70 bg-neutral-900/80'

const featuredArrangement = {
  title: '巴赫旧约',
  href: 'https://www.youtube.com/watch?v=frxT2qB1POQ',
  thumbnail: 'https://img.youtube.com/vi/frxT2qB1POQ/hqdefault.jpg',
}

const moreArrangements = [
  {
    title: 'River Flows In You',
    href: 'https://www.youtube.com/watch?v=7maJOI3QMu0',
    thumbnail: 'https://img.youtube.com/vi/7maJOI3QMu0/hqdefault.jpg',
  },
  {
    title: 'Lemon',
    href: 'https://www.youtube.com/watch?v=SX_ViT4Ra7k',
    thumbnail: 'https://img.youtube.com/vi/SX_ViT4Ra7k/hqdefault.jpg',
  },
  {
    title: 'Canon in D',
    href: 'https://www.youtube.com/watch?v=Ptk_1Dc2iPY',
    thumbnail: 'https://img.youtube.com/vi/Ptk_1Dc2iPY/hqdefault.jpg',
  },
]

const Arrangements = () => {
  return (
    <section
      className={`${SURFACE_CARD_CLASS} self-center min-h-[300px] w-[calc(100%-1.5rem)] max-w-[110rem] p-6 md:w-[calc(100%-3rem)] md:p-8 lg:p-10`}
    >
      <div className='flex flex-col gap-8 overflow-hidden'>
        <MusicHeader
          number={2}
          title='Arrangements Showcase'
          subtitle='Reimagining music I love.'
        />

        <div className='grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start'>
          <div className='flex min-w-0 flex-col gap-6'>
          <a
            className='group relative overflow-hidden rounded-2xl border border-neutral-700/70 bg-neutral-950/70 transition-colors duration-150 hover:border-[#c6942f]/70'
            href={featuredArrangement.href}
            target='_blank'
            rel='noreferrer'
          >
            <img
              className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]'
              src={featuredArrangement.thumbnail}
              alt={`${featuredArrangement.title} arrangement thumbnail`}
            />
            <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20' />

            <div className='relative z-10 flex min-h-56 flex-col items-start justify-end gap-3 p-5'>
              <h3 className='text-2xl font-semibold text-neutral-100'>{featuredArrangement.title}</h3>
              <span className='inline-flex rounded-full border border-[#c6942f]/40 bg-[#c6942f]/10 px-4 py-2 text-sm font-medium text-[#E6B870] transition-colors duration-150 group-hover:border-[#c6942f]/70 group-hover:bg-[#c6942f]/15'>
                View Arrangement
              </span>
            </div>
          </a>
          </div>

          <div className='flex min-w-0 flex-col gap-5'>
          <div className='flex items-center justify-between gap-4'>
            <h3 className='text-lg font-medium text-neutral-100'>More Arrangement</h3>
          </div>

          <div className='grid grid-cols-2 gap-4 min-[1280px]:grid-cols-4'>
            {moreArrangements.map((arrangement) => (
              <div key={arrangement.title} className='flex flex-col gap-3'>
                <a
                  className='group overflow-hidden rounded-2xl border border-neutral-700/70 bg-neutral-950/70 transition-colors duration-150 hover:border-[#c6942f]/70'
                  href={arrangement.href}
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    className='h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                    src={arrangement.thumbnail}
                    alt={`${arrangement.title} arrangement thumbnail`}
                  />
                </a>
                <p className='text-sm text-neutral-400'>{arrangement.title}</p>
              </div>
            ))}

            <a
              className='flex h-full min-h-[176px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-700/80 bg-neutral-950/40 p-5 text-center transition-colors duration-150 hover:border-[#c6942f]/70 hover:bg-neutral-900/70'
              href='https://www.youtube.com/@LiberteI/videos'
              target='_blank'
              rel='noreferrer'
            >
              <span className='text-4xl text-neutral-300' aria-hidden='true'>+</span>
              <span className='max-w-[10rem] text-sm font-medium text-neutral-300'>
                View more arrangements
              </span>
            </a>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

export default Arrangements

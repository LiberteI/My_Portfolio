import { useState } from 'react'
import Arrangements from './Arrangements'
import Practice from './Practice'
import Performance from './Performance'
import MusicSidebar from '../../Components/Music/MusicSidebar'

const HamburgerIcon = ({ open = false }) => {
  return (
    <div className='relative h-5 w-6'>
      <span
        className={[
          'absolute left-0 top-0 h-0.5 w-6 rounded-full bg-neutral-100 transition-transform duration-300',
          open ? 'translate-y-[9px] rotate-45' : '',
        ].join(' ')}
      />
      <span
        className={[
          'absolute left-0 top-[9px] h-0.5 w-6 rounded-full bg-neutral-100 transition-opacity duration-200',
          open ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      />
      <span
        className={[
          'absolute left-0 top-[18px] h-0.5 w-6 rounded-full bg-neutral-100 transition-transform duration-300',
          open ? '-translate-y-[9px] -rotate-45' : '',
        ].join(' ')}
      />
    </div>
  )
}

const MusicPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <MusicSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <button
          type='button'
          aria-label='Close sidebar overlay'
          onClick={() => setIsSidebarOpen(false)}
          className='fixed inset-0 z-30 bg-black/55 min-[1280px]:hidden'
        />
      )}

      <button
        type='button'
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setIsSidebarOpen((current) => !current)}
        className='fixed left-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700/80 bg-[#050506]/90 text-neutral-100 backdrop-blur transition-colors duration-150 hover:border-[#c6942f]/70 min-[1280px]:hidden'
      >
        <HamburgerIcon open={isSidebarOpen} />
      </button>

      <main className='flex min-h-screen flex-col items-center gap-12 bg-black px-6 py-10 text-neutral-100 max-[1279px]:pt-24 lg:pl-[116px]'>
        <header className='relative flex w-full max-w-6xl items-end justify-between gap-8'>
          <div className='relative z-20 flex min-h-[100px] flex-col justify-end pb-2 translate-x-10'>
            <div className='flex items-center gap-3'>
              <span className='text-[#E6B870] scale-y-300' aria-hidden='true'>|</span>
              <h1 className='text-4xl font-bold'>Music</h1>
            </div>
            <p>Discipline, Creativity, Expression</p>
          </div>
          <div className='relative z-10 hidden min-h-[100px] flex-1 items-end justify-end min-[700px]:flex'>
            <div
              className='pointer-events-none absolute right-0 top-0 h-[100px] w-[500px] overflow-hidden'
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
              }}
            >
              <img
                src="/images/music/music-header.jpeg"
                alt="Music Header"
                className='absolute right-0 top-[-180px] h-[300px] w-auto max-w-none object-cover'
              />
            </div>
            <div className='relative z-20 pr-8 text-right -translate-x-10'>
              <p>
                  "Every day at the piano
              </p>
              <p>
                  is a step forward."
              </p>
              <p className='text-[#E6B870]'>___</p>
            </div>
          </div>
        </header>

        <div className='flex w-full max-w-6xl flex-col justify-center gap-4'>
          <Practice />
          <Arrangements />
          <Performance />
        </div>
      </main>
    </>
  )
}

export default MusicPage

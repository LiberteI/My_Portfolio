import Arrangements from './Arrangements'
import Practice from './Practice'
import Performance from './Performance'


const MusicPage = () => {
  return (
    <main className='flex min-h-screen flex-col items-center gap-12 bg-black px-6 py-10 text-neutral-100'>
      <div className='flex w-full max-w-6xl items-end justify-between gap-8'>
        <div className='flex min-h-[100px] flex-col justify-end pb-2'>
          <div className='flex items-center gap-3'>
            <h1 className='text-[#E6B870]'>|</h1>
            <h1 className='text-4xl font-bold'>Music</h1>
          </div>
          <p>Discipline, Creativity, Expression</p>
        </div>
        <div className='flex items-end gap-4'>
          <div
            className='h-[100px] w-[500px] shrink-0 overflow-hidden'
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
            }}
          >
            <img
              src="/images/music/music-header.jpeg"
              alt="Music Header"
              className='h-[300px] w-auto max-w-none object-cover -translate-y-45 -translate-x-0'
            />
          </div>
          <div className='text-right'>
            <p className='text-lg text-neutral-400'>
                "Every day at the piano
            </p>
            <p>
                is a step forward."
            </p>
            <p className='text-[#E6B870]'>___</p>
          </div>
        </div>
      </div>
      <div className='flex w-full max-w-6xl flex-col justify-center gap-4'>
        <Practice />
        {/* <Arrangements />
        <Performance /> */}
      </div>
    </main>
  )
}

export default MusicPage

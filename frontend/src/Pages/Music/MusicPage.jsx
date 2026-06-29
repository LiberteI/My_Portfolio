import Arrangements from './Arrangements'
import Practice from './Practice'
import Performance from './Performance'


const MusicPage = () => {
  return (
    <main className='flex min-h-screen flex-col items-center gap-12 bg-black px-6 py-10 text-neutral-100'>
      <div className='w-full max-w-6xl'>
        <Practice />
        {/* <Arrangements />
        <Performance /> */}
      </div>
    </main>
  )
}

export default MusicPage

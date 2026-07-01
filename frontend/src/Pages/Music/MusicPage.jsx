import Arrangements from './Arrangements'
import Practice from './Practice'
import Performance from './Performance'


const MusicPage = () => {
  return (
    <main className='flex min-h-screen flex-col items-center gap-12 bg-black px-6 py-10 text-neutral-100'>
      <div>
        <h1>|</h1>
        <h1 className='text-4xl font-bold'>Music</h1>
        <p>Discipline, Creativity, Expression</p>
        <div>
            <p className='text-lg text-neutral-400'>
                "Every day at the piano
            </p>
            <p>
                is a step forward."
            </p>
        </div>
        
      </div>
      <div className='flex w-full flex-col gap-4 justify-center '>
        <Practice />
        {/* <Arrangements />
        <Performance /> */}
      </div>
    </main>
  )
}

export default MusicPage

import MusicHeader from '../../Components/MusicHeader'
const Performance = () => {
  return (
    <section className='w-full rounded-3xl border border-neutral-700 bg-neutral-800 p-8 md:p-10'>
      <div className='flex flex-col gap-8 md:gap-10'>
        <MusicHeader
          number={3}
          title='Performance'
          subtitle='Live performances and recordings.'
        />
        <div className='min-h-64 w-full rounded-2xl border border-neutral-700/70 bg-neutral-900/50 p-6 md:p-8'>
          
        </div>
      </div>
    </section>
  )
}

export default Performance

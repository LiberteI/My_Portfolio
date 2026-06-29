import MusicHeader from '../../Components/MusicHeader'

const Practice = () => {
  return (
    <section className='flex w-full flex-col gap-6 rounded-2xl border border-neutral-700 bg-neutral-800 px-6 py-6'>
      <MusicHeader
        number={1}
        title='Practice Streak'
        subtitle='Consistency builds mastery.'
      />
    </section>
  )
}

export default Practice

import MusicHeader from '../../Components/Music/MusicHeader'

const BADGE_GOLD_TEXT_CLASS = 'text-[#c6942f]'
const SURFACE_CARD_CLASS = 'rounded-2xl border border-neutral-700/70 bg-neutral-900/80'

const Arrangements = () => {
  return (
    <section
      className={`${SURFACE_CARD_CLASS} self-center min-h-[300px] w-[calc(100%-1.5rem)] max-w-[110rem] p-6 md:w-[calc(100%-3rem)] md:p-8 lg:p-10`}
    >
      <div className='flex flex-col gap-8 overflow-hidden md:gap-10'>
        <MusicHeader
          number={2}
          title='Arrangements'
          subtitle='Creative interpretations of pieces.'
        />

        <div className='grid gap-4 md:grid-cols-[1.25fr_0.75fr]'>
          <div className={`${SURFACE_CARD_CLASS} min-h-64 p-6 md:p-8`}>
            <p className='text-sm uppercase tracking-[0.18em] text-neutral-500'>In Progress</p>
            <p className={`mt-4 text-lg font-medium ${BADGE_GOLD_TEXT_CLASS}`}>
              Arrangement notes and recordings will live here.
            </p>
            <p className='mt-3 max-w-2xl text-sm leading-7 text-neutral-400'>
              This section is set up to match the visual rhythm of Practice, so future pieces,
              drafts, and breakdowns can drop in without needing another layout pass.
            </p>
          </div>

          <div className='grid gap-4'>
            <div className={`${SURFACE_CARD_CLASS} flex min-h-[120px] flex-col justify-center p-5`}>
              <p className='text-sm uppercase tracking-[0.18em] text-neutral-500'>Status</p>
              <p className='mt-3 font-serif text-3xl text-neutral-100'>Planning</p>
            </div>

            <div className={`${SURFACE_CARD_CLASS} flex min-h-[120px] flex-col justify-center p-5`}>
              <p className='text-sm uppercase tracking-[0.18em] text-neutral-500'>Focus</p>
              <p className='mt-3 font-serif text-3xl text-neutral-100'>Piano</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Arrangements

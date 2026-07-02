import SectionBadge from './SectionBadge'

const MusicHeader = ({ number, title, subtitle, className = '' }) => {
  return (
    <div
      className={['inline-flex max-w-full items-start gap-4', className].filter(Boolean).join(' ')}
    >
      <SectionBadge number={number} className='shrink-0' />

      <div className='min-w-0 flex flex-col gap-1 text-left'>
        <h2 className='font-sans text-2xl font-medium leading-none text-neutral-100'>
          {title}
        </h2>
        <p className='text-base text-neutral-400'>{subtitle}</p>
      </div>
    </div>
  )
}

export default MusicHeader

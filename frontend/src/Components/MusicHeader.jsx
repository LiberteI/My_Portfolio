import SectionBadge from './SectionBadge'

const MusicHeader = ({ number, title, subtitle, className = '' }) => {
  return (
    <div
      className={['flex items-start gap-4', className].filter(Boolean).join(' ')}
    >
      <SectionBadge number={number} className='shrink-0' />

      <div className='flex flex-col gap-1 text-left'>
        <h2 className='font-serif text-3xl font-semibold leading-none text-neutral-100'>
          {title}
        </h2>
        <p className='text-sm text-neutral-400'>{subtitle}</p>
      </div>
    </div>
  )
}

export default MusicHeader

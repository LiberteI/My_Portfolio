const SectionBadge = ({ number, className = '' }) => {
  return (
    <div
      className={[
        'flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6B870] font-serif text-3xl font-semibold text-neutral-900 shadow-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Section ${number}`}
    >
      <span>{number}</span>
    </div>
  )
}

export default SectionBadge

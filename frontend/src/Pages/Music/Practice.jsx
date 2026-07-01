import MusicHeader from '../../Components/MusicHeader'

const CELL_BASE_CLASS =
  'h-3.5 w-3.5 rounded-[4px] border border-white/5 transition-colors duration-150'
const GRID_LABEL_CLASS = 'text-[11px] uppercase tracking-[0.18em] text-neutral-500'
const CELL_SIZE_REM = 0.875

const formatDateLabel = (date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const getCellTone = (practiceTime) => {
  if (!practiceTime) return 'bg-neutral-700/70'
  if (practiceTime < 30) return 'bg-emerald-900'
  if (practiceTime < 60) return 'bg-emerald-700'
  if (practiceTime < 90) return 'bg-emerald-500'
  return 'bg-emerald-300'
}

// Renders one daily practice cell. Empty dates are placeholders used to align the
// first week of the year to Sunday.
const ContributionCell = ({ date, practiceTime = 0 }) => {
  if (!date) {
    return <div className={`${CELL_BASE_CLASS} border-transparent bg-transparent`} aria-hidden='true' />
  }

  const formattedDate = formatDateLabel(date)
  const minutesLabel = practiceTime > 0 ? `${practiceTime} minutes practiced` : 'No practice logged'

  return (
    <div
      className={`${CELL_BASE_CLASS} ${getCellTone(practiceTime)}`}
      title={`${formattedDate}: ${minutesLabel}`}
      aria-label={`${formattedDate}: ${minutesLabel}`}
    />
  )
}

const normalizePracticeData = (data) => {
  if (!Array.isArray(data)) return new Map()

  return data.reduce((entries, item) => {
    if (!item?.date) return entries

    const dateKey =
      item.date instanceof Date
        ? item.date.toISOString().slice(0, 10)
        : String(item.date).slice(0, 10)

    entries.set(dateKey, Number(item.practiceTime) || 0)
    return entries
  }, new Map())
}

const getContributionColumns = (data) => {
  const today = new Date()
  const yearStart = new Date(today.getFullYear(), 0, 1)
  const gridStart = new Date(yearStart)
  gridStart.setDate(yearStart.getDate() - yearStart.getDay())

  const practiceMap = normalizePracticeData(data)
  const weeks = []
  let currentWeek = []

  for (let cursor = new Date(gridStart); cursor <= today; cursor.setDate(cursor.getDate() + 1)) {
    const isInCurrentYear = cursor >= yearStart
    const date = isInCurrentYear ? new Date(cursor) : null
    const dateKey = date ? date.toISOString().slice(0, 10) : null

    currentWeek.push({
      date,
      practiceTime: dateKey ? practiceMap.get(dateKey) ?? 0 : 0,
      key: dateKey ?? `empty-${weeks.length}-${currentWeek.length}`,
    })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: null,
        practiceTime: 0,
        key: `tail-empty-${weeks.length}-${currentWeek.length}`,
      })
    }
    weeks.push(currentWeek)
  }

  return weeks
}

// Uses ContributionCell to render one column per week and seven rows per column,
// similar to a contribution heatmap.
const ContributionBar = ({ data = [] }) => {
  const weeks = getContributionColumns(data)
  const monthLabels = []
  const seenMonths = new Set()

  weeks.forEach((week, columnIndex) => {
    const firstDateInWeek = week.find((cell) => cell.date)?.date
    if (!firstDateInWeek) return

    const monthIndex = firstDateInWeek.getMonth()
    if (seenMonths.has(monthIndex)) return

    seenMonths.add(monthIndex)
    monthLabels.push({
      label: firstDateInWeek.toLocaleDateString('en-US', { month: 'short' }),
      columnStart: columnIndex + 2,
    })
  })

  const weekdayLabels = [
    { label: 'Mon', rowStart: 3 },
    { label: 'Wed', rowStart: 5 },
    { label: 'Fri', rowStart: 7 },
  ]
  const legendSteps = [0, 20, 45, 75, 100]

  return (
    <div className='overflow-x-auto'>
      <div className='inline-flex min-w-full flex-col gap-4'>
        <div
          className='inline-grid w-max gap-x-1 gap-y-1'
          style={{
            gridTemplateColumns: `2rem repeat(${weeks.length}, ${CELL_SIZE_REM}rem)`,
            gridTemplateRows: `1rem repeat(7, ${CELL_SIZE_REM}rem)`,
          }}
        >
          <div aria-hidden='true' />

          {monthLabels.map((month) => (
            <div
              key={month.label}
              className={GRID_LABEL_CLASS}
              style={{ gridColumnStart: month.columnStart, gridRowStart: 1 }}
            >
              {month.label}
            </div>
          ))}

          {weekdayLabels.map((day) => (
            <div
              key={day.label}
              className={`${GRID_LABEL_CLASS} self-center`}
              style={{ gridColumnStart: 1, gridRowStart: day.rowStart }}
            >
              {day.label}
            </div>
          ))}

          {weeks.flatMap((week, columnIndex) =>
            week.map((cell, rowIndex) => (
              <div
                key={cell.key}
                style={{
                  gridColumnStart: columnIndex + 2,
                  gridRowStart: rowIndex + 2,
                }}
              >
                <ContributionCell
                  date={cell.date}
                  practiceTime={cell.practiceTime}
                />
              </div>
            ))
          )}
        </div>

        <div className='flex items-center justify-end gap-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500'>
          <span>Less</span>
          <div className='flex items-center gap-1'>
            {legendSteps.map((step) => (
              <div
                key={step}
                className={`${CELL_BASE_CLASS} ${getCellTone(step)}`}
                aria-hidden='true'
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

const demoPracticeData = [
  { date: '2026-01-02', practiceTime: 20 },
  { date: '2026-01-06', practiceTime: 55 },
  { date: '2026-02-14', practiceTime: 75 },
  { date: '2026-03-01', practiceTime: 95 },
  { date: '2026-04-18', practiceTime: 35 },
  { date: '2026-05-09', practiceTime: 120 },
  { date: '2026-06-21', practiceTime: 45 },
]

const Practice = () => {
  return (
    <section className='w-full rounded-3xl border border-neutral-700 bg-neutral-800 p-8 md:p-10'>
      <div className='flex flex-col gap-8 md:gap-10'>
        <MusicHeader
          number={1}
          title='Practice Streak'
          subtitle='Consistency builds mastery.'
        />

        <div className='w-full rounded-2xl border border-neutral-700/70 bg-neutral-900/50 p-6 md:p-8'>
          <ContributionBar data={demoPracticeData} />
        </div>
      </div>
    </section>
  )
}

export default Practice

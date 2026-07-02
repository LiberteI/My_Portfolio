import MusicHeader from '../../Components/MusicHeader'

const fireStreakGif = '/images/music/fire-streak.gif'

const CELL_BASE_CLASS =
  'h-3.5 w-3.5 rounded-[4px] border border-white/5 transition-colors duration-150'
const GRID_LABEL_CLASS = 'text-[11px] uppercase tracking-[0.18em] text-neutral-500'
const CELL_SIZE_REM = 0.875
const BADGE_GOLD_TEXT_CLASS = 'text-[#c6942f]'

const formatDateLabel = (date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const getCellTone = (practiceTime) => {
  if (!practiceTime) return 'bg-neutral-900'
  if (practiceTime < 30) return 'bg-[#0E4429]'
  if (practiceTime < 60) return 'bg-[#006D32]'
  if (practiceTime < 90) return 'bg-[#26A641]'
  return 'bg-[#39D353]'
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

const getDateKey = (date) => date.toISOString().slice(0, 10)

const getStartOfWeek = (date) => {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay())
  return start
}

const formatHours = (minutes) => {
  if (minutes <= 0) return '0h'

  const hours = minutes / 60
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`
}

const getPracticeStats = (data, weeklyGoalMinutes = 600) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const normalizedEntries = Array.isArray(data)
    ? data
        .filter((item) => item?.date)
        .map((item) => {
          const parsedDate = item.date instanceof Date ? new Date(item.date) : new Date(item.date)
          parsedDate.setHours(0, 0, 0, 0)

          return {
            date: parsedDate,
            dateKey: getDateKey(parsedDate),
            practiceTime: Number(item.practiceTime) || 0,
          }
        })
    : []

  const byDate = new Map()
  normalizedEntries.forEach((entry) => {
    byDate.set(entry.dateKey, (byDate.get(entry.dateKey) ?? 0) + entry.practiceTime)
  })

  const weekStart = getStartOfWeek(today)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  let thisWeekMinutes = 0
  let thisMonthMinutes = 0

  byDate.forEach((minutes, dateKey) => {
    const entryDate = new Date(dateKey)
    entryDate.setHours(0, 0, 0, 0)

    if (entryDate >= weekStart && entryDate <= today) {
      thisWeekMinutes += minutes
    }

    if (entryDate >= monthStart && entryDate <= today) {
      thisMonthMinutes += minutes
    }
  })

  let streakDays = 0
  const cursor = new Date(today)
  while ((byDate.get(getDateKey(cursor)) ?? 0) > 0) {
    streakDays += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  const progressPercent = Math.min((thisWeekMinutes / weeklyGoalMinutes) * 100, 100)

  return {
    streakDays,
    thisWeekMinutes,
    thisMonthMinutes,
    weeklyGoalMinutes,
    progressPercent,
  }
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

        <div className='flex items-center justify-start gap-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500'>
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

const Stats = ({ data = [] }) => {
  const {
    streakDays,
    thisWeekMinutes,
    thisMonthMinutes,
    weeklyGoalMinutes,
    progressPercent,
  } = getPracticeStats(data)

  return (
    <div className='grid gap-4 md:gap-5 max-[1280px]:grid-cols-2 max-[762px]:grid-cols-1'>
      {/* Summary card: current streak, this week, and this month at a glance. */}
      <div 
        className='rounded-2xl border border-neutral-700/70 bg-neutral-950/40 p-4
        max-[1280px]:h-full
        '>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:gap-5 justify-center'>
          <div className='flex items-center gap-4 justify-center'>
            <img
              className='h-12 w-12 object-contain -translate-y-2 translate-x-2'
              src={fireStreakGif}
              alt='Fire streak icon'
            />
            <div className='flex flex-col'>
              <p className='font-serif text-3xl text-neutral-100'>{streakDays}</p>
              <p className='text-xs uppercase tracking-[0.2em] text-neutral-500'>Day streak</p>
            </div>
          </div>

          <span className='hidden text-neutral-600 min-[1281px]:block'>|</span>

          <div className='hidden flex-col min-[1281px]:flex'>
            <p className='text-[10px] uppercase tracking-[0.2em] text-neutral-500'>This week</p>
            <p className='mt-3 font-serif text-3xl text-neutral-100'>{formatHours(thisWeekMinutes)}</p>
          </div>

          <span className='hidden text-neutral-600 min-[1281px]:block'>|</span>

          <div className='hidden flex-col min-[1281px]:flex'>
            <p className='text-[10px] uppercase tracking-[0.2em] text-neutral-500'>This month</p>
            <p className='mt-3 font-serif text-3xl text-neutral-100'>{formatHours(thisMonthMinutes)}</p>
          </div>
        </div>
      </div>

      {/* Weekly goal card keeps the label, current total, and progress fill together. */}
      <div className='min-h-[50px] rounded-xl border border-neutral-700/70 bg-neutral-950/40 p-4 max-[1280px]:h-full'>
        <div className='flex w-full justify-center'>
          <div className='w-[calc(100%-1rem)] md:w-[calc(100%-3rem)] max-w-[320px]'>
            <div className='flex items-baseline justify-between gap-3 px-1 py-1'>
              <p className={`text-xs uppercase tracking-[0.2em] ${BADGE_GOLD_TEXT_CLASS}`}>Weekly goal</p>
              <p className={`text-right text-lg ${BADGE_GOLD_TEXT_CLASS}`}>
                {formatHours(thisWeekMinutes)} / {formatHours(weeklyGoalMinutes)}
              </p>
            </div>

            <div className='mt-4 h-2.5 w-full overflow-hidden rounded-full bg-neutral-800'>
              {/* Width is derived from weekly progress percentage and capped in getPracticeStats. */}
              <div
                className='h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-300 transition-[width] duration-300'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* External shortcut to the detailed piano practice logs repository. */}
      <div className='flex min-h-[40px] justify-end
        max-[1280px]:min-h-[40px] max-[1280px]:items-start max-[1280px]:justify-start max-[1279px]:hidden'>
        <a
          className={`min-w-[200px] min-h-[40px] justify-center inline-flex w-fit items-center rounded-[5px] border border-[#c6942f]/45 bg-neutral-950/40 px-4 py-2 text-sm transition-colors duration-150 hover:border-[#c6942f]/70 hover:bg-neutral-900 ${BADGE_GOLD_TEXT_CLASS}`}
          href='https://github.com/LiberteI/piano-log/tree/main/logs'
          target='_blank'
          rel='noreferrer'
        >
          View piano logs -&gt;
        </a>
      </div>
    </div>
  )
}
const Practice = () => {
  return (
    <section 
      className='self-center min-h-[300px] w-[calc(100%-1.5rem)] max-w-[110rem] rounded-3xl border border-neutral-700 bg-neutral-900 p-8 md:w-[calc(100%-3rem)] md:p-10
      max-[1280px]:min-h-[400px]
      max-[768px]:min-h-[450px]'>
      <div className='flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10'>
        <div className='min-w-0 flex-1 flex-col gap-8 xl:flex'>
          <MusicHeader
            className='translate-y-5 translate-x-5'
            number={1}
            title='Practice Streak'
            subtitle='Consistency builds mastery.'
          />

          <div 
            className='mt-8 rounded-2xl p-6 md:p-8 -translate-y-0 translate-x-10 
              max-[1280px]:translate-y-10'>
              <ContributionBar data={demoPracticeData} />
          </div>
        </div>

        <div className='xl:w-[400px] xl:flex-none translate-y-12 -translate-x-10 
          max-[1280px]:translate-x-0'>
          <Stats data={demoPracticeData} />
        </div>
      </div>
    </section>
  )
}

export default Practice

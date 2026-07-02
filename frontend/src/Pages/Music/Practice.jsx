import { useEffect, useState } from 'react'
import MusicHeader from '../../Components/Music/MusicHeader'

const fireStreakGif = '/images/music/fire-streak.gif'
const PRACTICE_DAYS_ENDPOINT =
  'https://raw.githubusercontent.com/LiberteI/piano-log/main/practice-days.json'

const CELL_BASE_CLASS =
  'h-3.5 w-3.5 rounded-[4px] border border-white/5 transition-colors duration-150'
const GRID_LABEL_CLASS = 'text-[11px] uppercase tracking-[0.18em] text-neutral-500'
const CELL_SIZE_REM = 0.875
const BADGE_GOLD_TEXT_CLASS = 'text-[#c6942f]'
const SURFACE_CARD_CLASS = 'rounded-2xl border border-neutral-700/70 bg-neutral-900/80'

const formatDateLabel = (date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const parsePracticeDate = (value) => {
  if (value instanceof Date) {
    const parsedDate = new Date(value)
    parsedDate.setHours(0, 0, 0, 0)
    return parsedDate
  }

  if (typeof value === 'string') {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number)
    if ([year, month, day].every(Number.isFinite)) {
      return new Date(year, month - 1, day)
    }
  }

  const fallbackDate = new Date(value)
  fallbackDate.setHours(0, 0, 0, 0)
  return fallbackDate
}

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

const getMondayIndex = (date) => (date.getDay() + 6) % 7

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
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const normalizedEntries = Array.isArray(data)
    ? data
        .filter((item) => item?.date)
        .map((item) => {
          const parsedDate = parsePracticeDate(item.date)

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
    const entryDate = parsePracticeDate(dateKey)

    if (entryDate >= weekStart && entryDate <= today) {
      thisWeekMinutes += minutes
    }

    if (entryDate >= monthStart && entryDate <= today) {
      thisMonthMinutes += minutes
    }
  })

  let streakDays = 0
  const cursor = new Date(yesterday)
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
  const yearEnd = new Date(today.getFullYear(), 11, 31)
  const firstMonday = new Date(yearStart)
  firstMonday.setDate(yearStart.getDate() - getMondayIndex(yearStart))

  const practiceMap = normalizePracticeData(data)
  const weeks = []

  for (let weekStart = new Date(firstMonday); weekStart <= yearEnd; weekStart.setDate(weekStart.getDate() + 7)) {
    const week = []

    for (let offset = 0; offset < 7; offset += 1) {
      const cursor = new Date(weekStart)
      cursor.setDate(weekStart.getDate() + offset)

      if (cursor < yearStart || cursor > yearEnd) {
        continue
      }

      const date = new Date(cursor)
      const dateKey = getDateKey(date)

      week.push({
        date,
        practiceTime: practiceMap.get(dateKey) ?? 0,
        key: dateKey,
        rowStart: getMondayIndex(date) + 2,
      })
    }

    weeks.push(week)
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
    <div className='custom-scrollbar-dark w-full overflow-x-auto'>
      <div className='inline-flex min-w-full flex-col gap-4 min-[1281px]:items-center'>
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
            week.map((cell) => (
              <div
                key={cell.key}
                style={{
                  gridColumnStart: columnIndex + 2,
                  gridRowStart: cell.rowStart,
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

        <div className='flex self-start items-center justify-start gap-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500'>
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

const DashboardBlock = ({ label, value, href, accent = false }) => {
  const baseClassName = `${SURFACE_CARD_CLASS} min-h-[92px] p-5`

  if (href) {
    return (
      <a
        className={`${baseClassName} flex items-center justify-center text-center transition-colors duration-150 hover:border-[#c6942f]/70 hover:bg-neutral-900`}
        href={href}
        target='_blank'
        rel='noreferrer'
      >
        <span className={`text-lg font-medium ${BADGE_GOLD_TEXT_CLASS}`}>{label}</span>
      </a>
    )
  }

  return (
    <div className={`${baseClassName} flex flex-col items-center justify-center text-center`}>
      <p className='text-sm uppercase tracking-[0.18em] text-neutral-500'>{label}</p>
      <p className={`mt-3 font-serif text-3xl text-neutral-100 ${accent ? BADGE_GOLD_TEXT_CLASS : ''}`}>
        {value}
      </p>
    </div>
  )
}

const TopSummary = ({ data = [] }) => {
  const {
    streakDays,
    thisWeekMinutes,
    weeklyGoalMinutes,
    progressPercent,
  } = getPracticeStats(data)

  return (
    <div className='flex flex-col gap-4
      min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-start min-[600px]:gap-5'>
      <div className='flex items-center gap-4 justify-center min-[600px]:justify-start'>
        <img
          className='h-12 w-12 object-contain -translate-y-2 translate-x-2 drop-shadow-[0_0_12px_rgba(230,184,112,0.85)]'
          src={fireStreakGif}
          alt='Fire streak icon'
        />
        <div className='flex items-baseline gap-3'>
          <p className='font-serif text-3xl text-neutral-100'>{streakDays}</p>
          <p className='whitespace-nowrap text-xs uppercase tracking-[0.2em] text-neutral-500'>Day streak</p>
        </div>
      </div>

      <span className='hidden text-neutral-700 min-[600px]:block'>|</span>

      <div className='mx-auto h-px w-full max-w-[180px] bg-neutral-800
        min-[600px]:hidden' />

      <div className='flex w-full self-center max-w-[320px] flex-col gap-2
        min-[600px]:w-[220px] min-[600px]:shrink-0'>
        <p className={`text-lg font-medium ${BADGE_GOLD_TEXT_CLASS}`}>
          {formatHours(thisWeekMinutes)} / {formatHours(weeklyGoalMinutes)}
        </p>
        <p className='text-xs uppercase tracking-[0.2em] text-neutral-500'>Weekly goal</p>
        <div className='h-2.5 w-full overflow-hidden rounded-full bg-neutral-800'>
          <div
            className='h-full rounded-full bg-[#E6B870] transition-[width] duration-300'
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
const BottomStats = ({ data = [] }) => {
  const {
    thisWeekMinutes,
    thisMonthMinutes,
  } = getPracticeStats(data)

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <DashboardBlock label='This Week' value={formatHours(thisWeekMinutes)} />
      <DashboardBlock label='This Month' value={formatHours(thisMonthMinutes)} />
      <DashboardBlock label='View piano logs -&gt;' href='https://github.com/LiberteI/piano-log/tree/main/logs' />
    </div>
  )
}
const Practice = () => {
  const [practiceData, setPracticeData] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadPracticeData = async () => {
      try {
        const response = await fetch(PRACTICE_DAYS_ENDPOINT)

        if (!response.ok) {
          throw new Error(`Failed to load practice data: ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          setPracticeData(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Unable to load practice data', error)
        if (isMounted) {
          setPracticeData([])
        }
      }
    }

    loadPracticeData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section
      className={`${SURFACE_CARD_CLASS} self-center min-h-[300px] w-[calc(100%-1.5rem)] max-w-[110rem] p-6 md:w-[calc(100%-3rem)] md:p-8 lg:p-10`}
    >
      <div className='flex flex-col gap-8 overflow-hidden md:gap-10'>
        <div className='flex flex-col gap-5 min-[768px]:flex-row min-[768px]:items-start min-[768px]:justify-between min-[768px]:gap-10'>
          <MusicHeader
            className='min-[768px]:min-w-0 min-[768px]:flex-1'
            number={1}
            title='Practice Streak'
            subtitle='Consistency builds mastery.'
          />

          <div className='min-w-0 min-[768px]:shrink-0'>
            <TopSummary data={practiceData} />
          </div>
        </div>

        <div className='min-w-0'>
          <ContributionBar data={practiceData} />
        </div>

        <BottomStats data={practiceData} />
      </div>
    </section>
  )
}

export default Practice

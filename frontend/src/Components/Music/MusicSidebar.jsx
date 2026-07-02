import { useNavigate } from 'react-router-dom'

const IconHome = () => (
  <svg viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.8'>
    <path d='M3 10.5 12 3l9 7.5' />
    <path d='M5.5 9.5V20h13V9.5' />
  </svg>
)

const IconUser = () => (
  <svg viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.8'>
    <circle cx='12' cy='8' r='4' />
    <path d='M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5' />
  </svg>
)

const IconCode = () => (
  <svg viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.8'>
    <path d='m8 8-4 4 4 4' />
    <path d='m16 8 4 4-4 4' />
    <path d='M13.5 5 10.5 19' />
  </svg>
)

const IconFolder = () => (
  <svg viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.8'>
    <path d='M3 7.5h6l2 2H21v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
    <path d='M3 7.5V6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1.5' />
  </svg>
)

const IconMusic = () => (
  <svg viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.8'>
    <path d='M9 18V6l10-2v12' />
    <circle cx='7' cy='18' r='3' />
    <circle cx='17' cy='16' r='3' />
  </svg>
)

const IconMail = () => (
  <svg viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.8'>
    <rect x='3' y='5' width='18' height='14' rx='2' />
    <path d='m4 7 8 6 8-6' />
  </svg>
)

const navItems = [
  { label: 'Home', icon: IconHome, action: { type: 'scroll', target: 'home' } },
  { label: 'About', icon: IconUser, action: { type: 'scroll', target: 'about' } },
  { label: 'Work', icon: IconCode, action: { type: 'route', target: '/experience' } },
  { label: 'Projects', icon: IconFolder, action: { type: 'route', target: '/projects' } },
  { label: 'Music', icon: IconMusic, action: { type: 'route', target: '/music' }, active: true },
  { label: 'Contact', icon: IconMail, action: { type: 'route', target: '/contact' } },
]

const MusicSidebar = () => {
  const navigate = useNavigate()

  const handleNav = (action) => {
    if (action.type === 'scroll') {
      navigate('/', { state: { scrollTo: action.target } })
      return
    }

    navigate(action.target)
  }

  return (
    <aside className='fixed inset-y-0 left-0 z-30 hidden w-[92px] border-r border-neutral-800/80 bg-[#050506]/95 backdrop-blur lg:flex lg:flex-col'>
      <div className='flex h-28 items-center justify-center border-b border-neutral-800/80'>
        <span className='font-serif text-6xl text-neutral-100'>Y</span>
      </div>

      <nav className='flex flex-1 flex-col justify-center'>
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              type='button'
              onClick={() => handleNav(item.action)}
              className={[
                'flex h-20 flex-col items-center justify-center gap-2 border-l-2 px-3 text-sm transition-colors duration-150',
                item.active
                  ? 'border-[#E6B870] bg-[#E6B870]/12 text-[#E6B870]'
                  : 'border-transparent text-neutral-300 hover:bg-neutral-900/70 hover:text-neutral-100',
              ].join(' ')}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default MusicSidebar

import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/LOGO_dark.png'

const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      const scrollingDown = currentY > lastScrollY && currentY > 120
      const scrollingUp = currentY < lastScrollY

      if (scrollingDown && !isHidden) {
        setIsHidden(true)
      } else if (scrollingUp && isHidden) {
        setIsHidden(false)
      }

      lastScrollY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHidden])

  return (
    <nav className={`navbar ${isHidden ? 'navbar--hidden' : ''}`}>
        <div className='navbar_logo'>
          <img src={logo} alt="" className='Logo'/>
        </div>
        
        <ul className='navbar_menu'>
          <li>About</li>
        </ul>
        <ul className='navbar_icons'>
          <li>Projects</li>
          <li>Performances</li>
          <li>Contact</li>
        </ul> 
        
    </nav>
    
  )
}

export default Navbar

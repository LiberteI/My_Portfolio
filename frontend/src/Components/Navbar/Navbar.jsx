import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/LOGO_dark.png'
const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false)
  
  const handleClick = (event, targetID) => {
    event.preventDefault()
    const element = document.getElementById(targetID)
    if(element){
      element.scrollIntoView({behavior:'smooth'})
    }
    else{
      window.scrollTo({top: 0, behavior:'smooth'})
    }
  }
  
  useEffect(() => {
    // Track scroll direction to hide the navbar when scrolling down and reveal it on scroll up.
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

  useEffect(() => {
    // when mouse touches the upper side of the viewport, show the navbar again
    const handlePointerNearTop = (event) => {
      let clientY = Infinity

      if (event.touches && event.touches.length > 0) {
        clientY = event.touches[0].clientY
      } else if (typeof event.clientY === 'number') {
        clientY = event.clientY
      }
      // show
      if (clientY <= 80) {
        if (isHidden) {
          setIsHidden(false)
        }
      // hide
      } else if (clientY > 140 && window.scrollY > 120) {
        if (!isHidden) {
          setIsHidden(true)
        }
      }
    }

    window.addEventListener('mousemove', handlePointerNearTop, { passive: true })
    window.addEventListener('touchstart', handlePointerNearTop, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handlePointerNearTop)
      window.removeEventListener('touchstart', handlePointerNearTop)
    }
  }, [isHidden])
  return (
    <nav className={`navbar ${isHidden ? 'navbar--hidden' : ''}`}>
        <a className='navbar_logo' href='#home' onClick={(e) => handleClick(e, 'home')} aria-label='Go to homepage'>
          <img src={logo} alt="Home" className='Logo'/>
        </a>
        <ul className='navbar_menu'>
          <li className='navbar_item navbar_item--left'>
            <a href="#about" onClick={(e) => handleClick(e, 'about')} aria-label='Go to about'>About</a>
          </li>
          <li className='navbar_item'>
            <a href="#projects" onClick={(e) => handleClick(e, 'projects')} aria-label='Go to projects'>Projects</a>
          </li>
          <li className='navbar_item'>
            <a href="#performance" onClick={(e) => handleClick(e, 'performance')} aria-label='Go to performances'>Performances</a>
          </li>
          <li className='navbar_item'>
            <a href="#contact" onClick={(e) => handleClick(e, 'contact')} aria-label='Go to contact'>Contact</a>
          </li>
        </ul>
        
    </nav>
    
  )
}

export default Navbar

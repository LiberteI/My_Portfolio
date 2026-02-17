import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/LOGO_dark.png'

const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleClick = (event, targetID) => {
    event.preventDefault()
    const element = document.getElementById(targetID)
    if(element){
      element.scrollIntoView({behavior:'smooth'})
    }
    else{
      navigate('/', { state: { scrollTo: targetID } })
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
    if (location.pathname !== '/' || !location.state?.scrollTo) {
      return
    }

    const targetID = location.state.scrollTo
    const targetElement = document.getElementById(targetID)

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    } 
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    navigate('.', { replace: true, state: {} })
    
  }, [location, navigate])

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
        <a className='navbar_logo' href='/' onClick={(e) => handleClick(e, 'home')} aria-label='Go to homepage'>
          <img src={logo} alt="Home" className='Logo'/>
        </a>
        

        <ul className='navbar_menu'>
          
          <li className='navbar_item navbar_item--left'>
            <a href="#about" onClick={(e) => handleClick(e, 'about')} aria-label='Go to about'>About</a>
          </li>

          <li className='navbar_item'>
            <a href="/experience" onClick={(e) => handleClick(e, 'about')} aria-label='Go to about'>Experience</a>
          </li>

          <li className='navbar_item'>
            <a 
              href="/projects" 
              onClick={(e) => {
                e.preventDefault()
                navigate('/projects')
              }} 
              aria-label='Go to projects'>
              Projects
            </a>

          </li>

          <li className='navbar_item'>
            <a href="/repertoire" 
              onClick={(e) => {
                e.preventDefault()
                navigate('/repertoire')
              }} 
              aria-label='Go to repertoire'>
              Repertoire
            </a>
          </li>

          <li className='navbar_item'>
            <a href="/contact" 
              onClick={(e) => {
                e.preventDefault()
                navigate('/contact')
              }} 
              aria-label='Go to contact'>
              Contact
            </a>
          </li>

          {/* <li className='navbar_item'>
            <a href="#testimonial" onClick={(e) => handleClick(e, 'testimonial')} aria-label='Go to testimonials'>Testimonials</a>
          </li> */}

          

        </ul>
        
    </nav>
    
  )
}

export default Navbar

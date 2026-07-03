import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

const HamburgerIcon = ({ open = false }) => {
  return (
    <div className='navbar_hamburger' aria-hidden='true'>
      <span className={open ? 'navbar_hamburger-bar navbar_hamburger-bar--top-open' : 'navbar_hamburger-bar'} />
      <span className={open ? 'navbar_hamburger-bar navbar_hamburger-bar--middle-open' : 'navbar_hamburger-bar'} />
      <span className={open ? 'navbar_hamburger-bar navbar_hamburger-bar--bottom-open' : 'navbar_hamburger-bar'} />
    </div>
  )
}

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
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

    setIsExpanded(false)
  }

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

  return (
    <nav className={`navbar ${isExpanded ? 'navbar--expanded' : 'navbar--collapsed'}`}>
        <button
          type='button'
          className='navbar_toggle'
          aria-label={isExpanded ? 'Minimize navigation' : 'Expand navigation'}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
        >
          <HamburgerIcon open={isExpanded} />
        </button>

        <ul className={`navbar_menu ${isExpanded ? 'navbar_menu--open' : 'navbar_menu--closed'}`}>
          
          <li className='navbar_item navbar_item--left'>
            <a href="#about" onClick={(e) => handleClick(e, 'about')} aria-label='Go to about'>About</a>
          </li>

          <li className='navbar_item'>
            <a 
              href="/experience" 
              onClick={(e) => {
                e.preventDefault()
                setIsExpanded(false)
                navigate('/experience')
              }} 
              aria-label='Go to experience'>
              Experience
            </a>
          </li>

          <li className='navbar_item'>
            <a 
              href="/projects" 
              onClick={(e) => {
                e.preventDefault()
                setIsExpanded(false)
                navigate('/projects')
              }} 
              aria-label='Go to projects'>
              Projects
            </a>

          </li>

          <li className='navbar_item'>
            <a
              href="/music"
              onClick={(e) => {
                e.preventDefault()
                setIsExpanded(false)
                navigate('/music')
              }}
              aria-label='Go to music'>
              Music
            </a>
          </li>

          <li className='navbar_item'>
            <a href="/contact" 
              onClick={(e) => {
                e.preventDefault()
                setIsExpanded(false)
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

import React from 'react'
import './Navbar.css'
import logo from '../../assets/LOGO_dark.png'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <div className='navbar_logo'>
          <img src={logo} alt="" className='Logo'/>
        </div>
        
        <ul className='navbar_menu'>
          <li>Home</li>
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

import React from 'react'
import './Navbar.css'
import logo from '../../assets/LOGO.png'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <img src={logo} alt="" className='Logo'/>

        <ul>
            <li>Home</li>
            <li>About</li>
            <li>Projects</li>
            <li>Interest</li>
            <li>Contact</li>
        </ul> 
        
    </nav>
    
  )
}

export default Navbar

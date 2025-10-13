import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={logo} alt="" className='Logo'/>

        <ul>
            <li>Home</li>
            <li>About</li>
            <li>Projects</li>
            <li>Interest</li>
            <li>Contact</li>
        </ul> 
        
    </div>
    
  )
}

export default Navbar

import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import Performances from './Components/Performance/Performance'
import About from './Components/About/About'

const App = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Home />
      <About />
      <Performances/>
      <Contact />
      
    </div>
  )
}

export default App

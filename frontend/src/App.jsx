import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import Performances from './Components/Performance/Performance'
import Player from './Components/Player/Player'
const App = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Home />
      <Performances/>
      <Contact />
      
    </div>
  )

}

export default App

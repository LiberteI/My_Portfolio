import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
const App = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Home />
      <Contact />
    </div>
  )

}

export default App

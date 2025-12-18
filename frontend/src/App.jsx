import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import Performances from './Components/Performance/Performance'
import About from './Components/About/About'
import Project from './Components/Project/Project'

const App = () => {
  return (
    <div className='app-container'>

      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='projects/:slug' element={<KnightGame/>}/>
      </Routes>
    </div>
  )
}
const HomePage = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Home />
      <About />
      <Project />
      <Performances />
      <Contact />
    </div>
  )
}
const KnightGame = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      
    </div>
  )
}

export default App

import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
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
      <div className='knightGame-container'>

        <video src="/knightTrailer.mp4" controls />

        <p>
          Gameplay trailer for <strong>Knight of Cinders</strong>.
          Core combat systems and logic were preserved after a local
          asset deletion incident.
        </p>

        <a href="https://drive.google.com/file/d/1QigchoK-Ckn5wDokIMy8jG526GJFgCHP/view" className="download-button">
          Download Build for Mac
        </a>
        
      </div>
    </div>
  )
}

export default App

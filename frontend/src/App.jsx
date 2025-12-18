import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import Performances from './Components/Performance/Performance'
import About from './Components/About/About'
import Project from './Components/Project/Project'
import KnightGameThumbnail from './assets/ProjectThumbnail/KnightThumbnail.png'


const App = () => {
  return (
    <div className='app-container'>

      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='projects/knight-of-cinders' element={<KnightGame/>}/>
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

        <video src="/knightTrailer.mp4" controls playsInline poster={KnightGameThumbnail}/>

        <div className='knightGame-content'>
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
    </div>
  )
}

export default App

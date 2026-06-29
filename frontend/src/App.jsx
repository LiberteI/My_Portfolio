import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Pages/Navbar/Navbar'
import Home from './Pages/Home/Home'
import Contact from './Pages/Contact/Contact'
import Comment from './Pages/Comment/Comment'
import About from './Pages/About/About'
import Project from './Pages/Project/Project'
import CommentForm from './Pages/Comment/CommentForm'
import Experience from './Pages/Experience/Experience'

import KnightGameThumbnail from './assets/ProjectThumbnail/KnightThumbnail.png'
import invocation from './assets/Animations/invocation.gif'


const App = () => {
  return (
    <div className='app-container'>

      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/projects/knight-of-cinders' element={<KnightGame/>}/>
        
        <Route path='/comment-form' element={<CommentFormPathWay/>}/>
        <Route path='/projects' element={<Projects />} />
        <Route path='/contact' element={<ContactPage />}/>
        <Route path='experience' element={<ExperiencePage />}/>
      </Routes>
    </div>
  )
}

const ExperiencePage = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Experience />
    </div>
  )
}
const ContactPage = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Contact />
    </div>
  )
}

const HomePage = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Home />
      <About />
      <Comment />
      
    </div>
  )
}

const Projects = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <Project />
    </div>
  )
}


const CommentFormPathWay = () => {
  return (
    <div className='app-container'>
      <Navbar/>
      <CommentForm />
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
          <img className='knightGame-gif' src={invocation} alt="Knight of Cinders invocation animation" />
          <p className='knightGame-description'>
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

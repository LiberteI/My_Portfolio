import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home/Home'
import Contact from './Pages/Contact/Contact'
import Comment from './Pages/Comment/Comment'
import About from './Pages/About/About'
import ShowcaseLayout from './Pages/professional/ShowcaseLayout'
import CommentForm from './Pages/Comment/CommentForm'
import MusicPage from './Pages/Music/MusicPage'

import invocation from './assets/Animations/invocation.gif'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />}/>
      <Route path='/projects/knight-of-cinders' element={<KnightGame/>}/>

      <Route path='/comment-form' element={<CommentFormPathWay/>}/>
      <Route element={<ProfessionalPage />}>
        <Route path='/projects' />
        <Route path='/experience' />
      </Route>
      <Route path='/music' element={<MusicPathway />} />
      <Route path='/contact' element={<ContactPage />}/>
    </Routes>
  )
}

const ContactPage = () => {
  return (
    <div className='app-container'>
      <Navbar activeLabel='Contact' />
      <Contact />
    </div>
  )
}

const HomePage = () => {
  return (
    <div className='app-container'>
      <Navbar activeLabel='About' />
      <Home />
      <About />
      <Comment />
      
    </div>
  )
}

const ProfessionalPage = () => {
  const location = useLocation()
  const routeValue = location.pathname === '/experience' ? 'experience' : 'projects'
  const activeLabel = routeValue === 'experience' ? 'Experience' : 'Projects'

  return (
    <div className='app-container'>
      <Navbar activeLabel={activeLabel} />
      <ShowcaseLayout routeValue={routeValue} />
    </div>
  )
}

const MusicPathway = () => {
  return (
    <div className='app-container'>
      <MusicPage />
    </div>
  )
}


const CommentFormPathWay = () => {
  return (
    <div className='app-container'>
      <Navbar />
      <CommentForm />
    </div>
  )
}

const KnightGame = () => {
  return (
    <div className='app-container'>
      <Navbar activeLabel='Projects' />
      <div className='knightGame-container'>

        <video src="/knightTrailer.mp4" controls playsInline poster="/images/project-thumbnails/KnightThumbnail.png"/>

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

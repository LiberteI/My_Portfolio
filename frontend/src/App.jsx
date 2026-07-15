import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home/Home'
import Comment from './Pages/Comment/Comment'
import About from './Pages/About/About'

const ContactPage = lazy(() => import('./Pages/Contact/ContactPage'))
const CommentFormPathway = lazy(() => import('./Pages/Comment/CommentFormPathway'))
const ProfessionalPage = lazy(() => import('./Pages/professional/ProfessionalPage'))
const MusicPathway = lazy(() => import('./Pages/Music/MusicPathway'))
const KnightGame = lazy(() => import('./Pages/projects/KnightGame'))

const RouteFallback = () => <div className='min-h-svh bg-black' />

const withSuspense = (element) => (
  <Suspense fallback={<RouteFallback />}>
    {element}
  </Suspense>
)

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />}/>
      <Route path='/projects/knight-of-cinders' element={withSuspense(<KnightGame />)}/>

      <Route path='/comment-form' element={withSuspense(<CommentFormPathway />)}/>
      <Route path='/projects' element={withSuspense(<ProfessionalPage routeValue='projects' />)} />
      <Route path='/experience' element={withSuspense(<ProfessionalPage routeValue='experience' />)} />
      <Route path='/music' element={withSuspense(<MusicPathway />)} />
      <Route path='/contact' element={withSuspense(<ContactPage />)}/>
    </Routes>
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

export default App

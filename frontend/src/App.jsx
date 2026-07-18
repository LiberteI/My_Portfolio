import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home/Home'
import Comment from './Pages/Comment/Comment'
import About from './Pages/About/About'
import { projectRecords } from './data/projects/project.data'
import { mapProjectsToDisplayModels } from './data/projects/project.mapper'

const ContactPage = lazy(() => import('./Pages/Contact/ContactPage'))
const CommentFormPathway = lazy(() => import('./Pages/Comment/CommentFormPathway'))
const ProfessionalPage = lazy(() => import('./Pages/professional/ProfessionalPage'))
const ProfessionalSceneHost = lazy(() => import('./Components/Scene/ProfessionalSceneHost'))
const MusicPathway = lazy(() => import('./Pages/Music/MusicPathway'))

const RouteFallback = () => <div className='min-h-svh bg-black' />

const withSuspense = (element) => (
  <Suspense fallback={<RouteFallback />}>
    {element}
  </Suspense>
)

const PROFESSIONAL_ROUTE_VALUES = {
  projects: 'projects',
  experience: 'experience',
}

const getProfessionalRouteValue = (pathname) => {
  if (pathname === '/projects') {
    return PROFESSIONAL_ROUTE_VALUES.projects
  }

  if (pathname === '/experience') {
    return PROFESSIONAL_ROUTE_VALUES.experience
  }

  return null
}

const App = () => {
  const location = useLocation()
  const projects = useMemo(() => mapProjectsToDisplayModels(projectRecords), [])
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [hasInitializedProfessionalScene, setHasInitializedProfessionalScene] = useState(false)
  const [lastProfessionalRouteValue, setLastProfessionalRouteValue] = useState(null)
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false)
  const [isProjectionPreviewOpen, setIsProjectionPreviewOpen] = useState(false)
  const activeProfessionalRouteValue = getProfessionalRouteValue(location.pathname)
  const resolvedProfessionalRouteValue = activeProfessionalRouteValue ?? lastProfessionalRouteValue
  const featuredProject = projects[activeProjectIndex] ?? projects[0]

  useEffect(() => {
    if (!activeProfessionalRouteValue) {
      return
    }

    setHasInitializedProfessionalScene(true)
    setLastProfessionalRouteValue(activeProfessionalRouteValue)
  }, [activeProfessionalRouteValue])

  const handleSelectProject = (nextIndex) => {
    setActiveProjectIndex((nextIndex + projects.length) % projects.length)
  }

  return (
    <>
      {hasInitializedProfessionalScene && resolvedProfessionalRouteValue ? withSuspense(
        <ProfessionalSceneHost
          isActive={Boolean(activeProfessionalRouteValue)}
          routeValue={resolvedProfessionalRouteValue}
          featuredProject={featuredProject}
          onScreenClick={() => setIsProjectionPreviewOpen(true)}
          onResumeClick={() => setIsResumePreviewOpen(true)}
        />
      ) : null}

      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/comment-form' element={withSuspense(<CommentFormPathway />)}/>
        <Route
          path='/projects'
          element={withSuspense(
            <ProfessionalPage
              routeValue={PROFESSIONAL_ROUTE_VALUES.projects}
              projects={projects}
              activeProjectIndex={activeProjectIndex}
              onSelectProject={handleSelectProject}
              isResumePreviewOpen={isResumePreviewOpen}
              onCloseResumePreview={() => setIsResumePreviewOpen(false)}
              isProjectionPreviewOpen={isProjectionPreviewOpen}
              onCloseProjectionPreview={() => setIsProjectionPreviewOpen(false)}
            />
          )}
        />
        <Route
          path='/experience'
          element={withSuspense(
            <ProfessionalPage
              routeValue={PROFESSIONAL_ROUTE_VALUES.experience}
              projects={projects}
              activeProjectIndex={activeProjectIndex}
              onSelectProject={handleSelectProject}
              isResumePreviewOpen={isResumePreviewOpen}
              onCloseResumePreview={() => setIsResumePreviewOpen(false)}
              isProjectionPreviewOpen={isProjectionPreviewOpen}
              onCloseProjectionPreview={() => setIsProjectionPreviewOpen(false)}
            />
          )}
        />
        <Route path='/music' element={withSuspense(<MusicPathway />)} />
        <Route path='/contact' element={withSuspense(<ContactPage />)}/>
      </Routes>
    </>
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

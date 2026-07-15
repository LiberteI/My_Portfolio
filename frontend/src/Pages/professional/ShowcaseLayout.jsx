import { AnimatePresence } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import ArtGalleryScene from "../../Components/Scene/ArtGalleryScene"
import { projectRecords } from "../../data/projects/project.data"
import { mapProjectsToDisplayModels } from "../../data/projects/project.mapper"
import ProjectOverlay from "./ProjectOverlay"
import ExperienceOverlay from "./ExperienceOverlay"

const PROFESSIONAL_ROUTE_VALUES = {
    projects: "projects",
    experience: "experience"
}

const isProfessionalRouteValue = (value) => Object.values(PROFESSIONAL_ROUTE_VALUES).includes(value)

const createProfessionalState = (routeValue = null) => ({
    status: routeValue ? "active" : "idle",
    routeValue
})

const PROJECT_OVERLAY_TRANSITION_MS = 450

const ShowcaseLayout = ({ routeValue }) => {
    const projects = useMemo(() => mapProjectsToDisplayModels(projectRecords), [])
    const [activeProjectIndex, setActiveProjectIndex] = useState(0)
    const [professionalState, setProfessionalState] = useState(() => (
        createProfessionalState(isProfessionalRouteValue(routeValue) ? routeValue : null)
    ))
    const [projectOverlayState, setProjectOverlayState] = useState(() => ({
        isRendered: routeValue === PROFESSIONAL_ROUTE_VALUES.projects,
        motion: "idle"
    }))
    const projectOverlayEnterFrameRef = useRef(0)
    const projectOverlayExitTimeoutRef = useRef(0)
    const featuredProject = projects[activeProjectIndex] ?? projects[0]

    const handleSelectProject = (nextIndex) => {
        const boundedIndex = (nextIndex + projects.length) % projects.length
        setActiveProjectIndex(boundedIndex)
    }

    const clearProjectOverlayTransitionHandles = () => {
        window.cancelAnimationFrame(projectOverlayEnterFrameRef.current)
        window.clearTimeout(projectOverlayExitTimeoutRef.current)
        projectOverlayEnterFrameRef.current = 0
        projectOverlayExitTimeoutRef.current = 0
    }

    useEffect(() => {
        if (!isProfessionalRouteValue(routeValue)) {
            console.log("[ShowcaseLayout] onExitProfessional:", {
                previousRouteValue: professionalState.routeValue
            })
            clearProjectOverlayTransitionHandles()
            setProjectOverlayState({
                isRendered: false,
                motion: "idle"
            })
            setProfessionalState(createProfessionalState(null))
            return
        }

        if (professionalState.routeValue === routeValue) {
            console.log("[ShowcaseLayout] onEnterProfessional no-op:", {
                currentRouteValue: professionalState.routeValue,
                nextRouteValue: routeValue
            })
            return
        }

        console.log("[ShowcaseLayout] onEnterProfessional:", {
            previousRouteValue: professionalState.routeValue,
            nextRouteValue: routeValue
        })

        if (professionalState.routeValue === PROFESSIONAL_ROUTE_VALUES.experience && routeValue === PROFESSIONAL_ROUTE_VALUES.projects) {
            clearProjectOverlayTransitionHandles()
            setProjectOverlayState({
                isRendered: true,
                motion: "entering"
            })

            projectOverlayEnterFrameRef.current = window.requestAnimationFrame(() => {
                projectOverlayEnterFrameRef.current = window.requestAnimationFrame(() => {
                    setProjectOverlayState({
                        isRendered: true,
                        motion: "idle"
                    })
                })
            })
        } else if (professionalState.routeValue === PROFESSIONAL_ROUTE_VALUES.projects && routeValue === PROFESSIONAL_ROUTE_VALUES.experience) {
            clearProjectOverlayTransitionHandles()
            setProjectOverlayState((currentState) => {
                if (!currentState.isRendered) {
                    return currentState
                }

                return {
                    isRendered: true,
                    motion: "exiting"
                }
            })

            projectOverlayExitTimeoutRef.current = window.setTimeout(() => {
                setProjectOverlayState({
                    isRendered: false,
                    motion: "idle"
                })
            }, PROJECT_OVERLAY_TRANSITION_MS)
        } else {
            clearProjectOverlayTransitionHandles()
            setProjectOverlayState({
                isRendered: routeValue === PROFESSIONAL_ROUTE_VALUES.projects,
                motion: "idle"
            })
        }

        setProfessionalState(createProfessionalState(routeValue))
    }, [routeValue, professionalState.routeValue, professionalState.status])

    useEffect(() => {
        return () => {
            window.cancelAnimationFrame(projectOverlayEnterFrameRef.current)
            window.clearTimeout(projectOverlayExitTimeoutRef.current)
            projectOverlayEnterFrameRef.current = 0
            projectOverlayExitTimeoutRef.current = 0
        }
    }, [])

    const activeProfessionalRoute = professionalState.routeValue
    const resolvedProfessionalRoute = isProfessionalRouteValue(routeValue)
        ? routeValue
        : activeProfessionalRoute

    return (
        <section className="relative h-svh overflow-hidden bg-black text-stone-100" data-project-count={projects.length}>
            <ArtGalleryScene
                className="absolute inset-0 h-full w-full bg-black"
                routeValue={resolvedProfessionalRoute}
                screenTextureUrl={featuredProject?.projectionImage}
            />

            {projectOverlayState.isRendered ? (
                <ProjectOverlay
                    featuredProject={featuredProject}
                    activeProjectIndex={activeProjectIndex}
                    projects={projects}
                    onSelectProject={handleSelectProject}
                    motionState={projectOverlayState.motion}
                />
            ) : null}

            <AnimatePresence>
                {activeProfessionalRoute === PROFESSIONAL_ROUTE_VALUES.experience ? <ExperienceOverlay key="experience-overlay" /> : null}
            </AnimatePresence>
        </section>
    )
}

export default ShowcaseLayout

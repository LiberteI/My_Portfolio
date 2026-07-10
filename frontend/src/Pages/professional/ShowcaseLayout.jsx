import { useEffect, useMemo, useState } from "react"
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

const ShowcaseLayout = ({ routeValue }) => {
    const projects = useMemo(() => mapProjectsToDisplayModels(projectRecords), [])
    const [activeProjectIndex, setActiveProjectIndex] = useState(0)
    const [professionalState, setProfessionalState] = useState(() => createProfessionalState(null))
    const featuredProject = projects[activeProjectIndex] ?? projects[0]

    const handleSelectProject = (nextIndex) => {
        const boundedIndex = (nextIndex + projects.length) % projects.length
        setActiveProjectIndex(boundedIndex)
    }

    const onEnterProfessional = (nextRouteValue) => {
        if (!isProfessionalRouteValue(nextRouteValue)) {
            return
        }

        setProfessionalState(createProfessionalState(nextRouteValue))
    }

    const onExitProfessional = () => {
        setProfessionalState(createProfessionalState(null))
    }

    const onUpdateProfessional = (nextRouteValue) => {
        if (!isProfessionalRouteValue(nextRouteValue)) {
            return
        }

        setProfessionalState((currentState) => {
            if (currentState.status === "active" && currentState.routeValue === nextRouteValue) {
                return currentState
            }

            return createProfessionalState(nextRouteValue)
        })
    }

    useEffect(() => {
        if (!isProfessionalRouteValue(routeValue)) {
            onExitProfessional()
            return
        }

        if (professionalState.status === "idle") {
            onEnterProfessional(routeValue)
            return
        }

        onUpdateProfessional(routeValue)
    }, [routeValue, professionalState.status])

    useEffect(() => {
        return () => {
            onExitProfessional()
        }
    }, [])

    const activeProfessionalRoute = professionalState.routeValue

    return (
        <section className="relative h-screen overflow-hidden bg-black text-stone-100" data-project-count={projects.length}>
            <ArtGalleryScene
                className="absolute inset-0 h-full w-full bg-black"
                screenTextureUrl={featuredProject?.projectionImage}
            />

            {activeProfessionalRoute === PROFESSIONAL_ROUTE_VALUES.projects ? (
                <ProjectOverlay
                    featuredProject={featuredProject}
                    activeProjectIndex={activeProjectIndex}
                    projects={projects}
                    onSelectProject={handleSelectProject}
                />
            ) : null}

            {activeProfessionalRoute === PROFESSIONAL_ROUTE_VALUES.experience ? <ExperienceOverlay /> : null}
        </section>
    )
}

export default ShowcaseLayout

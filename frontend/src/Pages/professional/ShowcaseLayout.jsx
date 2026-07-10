import { useMemo, useState } from "react"
import ArtGalleryScene from "../../Components/Scene/ArtGalleryScene"
import { projectRecords } from "../../data/projects/project.data"
import { mapProjectsToDisplayModels } from "../../data/projects/project.mapper"
import ProjectOverlay from "./ProjectOverlay"

const ShowcaseLayout = () => {
    const projects = useMemo(() => mapProjectsToDisplayModels(projectRecords), [])
    const [activeProjectIndex, setActiveProjectIndex] = useState(0)
    const featuredProject = projects[activeProjectIndex] ?? projects[0]

    const handleSelectProject = (nextIndex) => {
        const boundedIndex = (nextIndex + projects.length) % projects.length
        setActiveProjectIndex(boundedIndex)
    }

    return (
        <section className="relative h-screen overflow-hidden bg-black text-stone-100" data-project-count={projects.length}>
            <ArtGalleryScene
                className="absolute inset-0 h-full w-full bg-black"
                screenTextureUrl={featuredProject?.projectionImage}
            />

            <ProjectOverlay
                featuredProject={featuredProject}
                activeProjectIndex={activeProjectIndex}
                projects={projects}
                onSelectProject={handleSelectProject}
            />
        </section>
    )
}

export default ShowcaseLayout

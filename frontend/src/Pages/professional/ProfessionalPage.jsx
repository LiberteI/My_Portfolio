import Navbar from "../../Components/Navbar/Navbar"
import ShowcaseLayout from "./ShowcaseLayout"

const PROFESSIONAL_ACTIVE_LABELS = {
    projects: "Projects",
    experience: "Experience"
}

const ProfessionalPage = ({
    routeValue = "projects",
    projects = [],
    activeProjectIndex = 0,
    onSelectProject
}) => {
    const activeLabel = PROFESSIONAL_ACTIVE_LABELS[routeValue] ?? PROFESSIONAL_ACTIVE_LABELS.projects

    return (
        <div className="pointer-events-none relative z-10 min-h-screen text-inherit">
            <Navbar activeLabel={activeLabel} />
            <ShowcaseLayout
                routeValue={routeValue}
                projects={projects}
                activeProjectIndex={activeProjectIndex}
                onSelectProject={onSelectProject}
            />
        </div>
    )
}

export default ProfessionalPage

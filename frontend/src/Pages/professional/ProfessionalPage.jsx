import Navbar from "../../Components/Navbar/Navbar"
import ShowcaseLayout from "./ShowcaseLayout"

const PROFESSIONAL_ACTIVE_LABELS = {
    projects: "Projects",
    experience: "Experience"
}

const ProfessionalPage = ({ routeValue = "projects" }) => {
    const activeLabel = PROFESSIONAL_ACTIVE_LABELS[routeValue] ?? PROFESSIONAL_ACTIVE_LABELS.projects

    return (
        <div className="app-container">
            <Navbar activeLabel={activeLabel} />
            <ShowcaseLayout routeValue={routeValue} />
        </div>
    )
}

export default ProfessionalPage

import Navbar from "../../Components/Navbar/Navbar"
import ShowcaseLayout from "./ShowcaseLayout"
import resumePreviewUrl from "../../assets/resume.png"

const PROFESSIONAL_ACTIVE_LABELS = {
    projects: "Projects",
    experience: "Experience"
}

const ProfessionalPage = ({
    routeValue = "projects",
    projects = [],
    activeProjectIndex = 0,
    onSelectProject,
    isResumePreviewOpen = false,
    onCloseResumePreview,
    isProjectionPreviewOpen = false,
    onCloseProjectionPreview
}) => {
    const activeLabel = PROFESSIONAL_ACTIVE_LABELS[routeValue] ?? PROFESSIONAL_ACTIVE_LABELS.projects
    const activeProject = projects[activeProjectIndex] ?? projects[0] ?? null

    return (
        <div className="pointer-events-none relative z-10 min-h-screen text-inherit">
            <Navbar activeLabel={activeLabel} />
            <ShowcaseLayout
                routeValue={routeValue}
                projects={projects}
                activeProjectIndex={activeProjectIndex}
                onSelectProject={onSelectProject}
            />

            {isResumePreviewOpen ? (
                <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center p-6">
                    <button
                        type="button"
                        className="absolute inset-0 bg-stone-500/20"
                        aria-label="Close resume preview"
                        onClick={onCloseResumePreview}
                    />

                    <div className="relative z-10 flex justify-center">
                        <button
                            type="button"
                            className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-sm text-stone-100"
                            onClick={onCloseResumePreview}
                        >
                            Close
                        </button>

                        <img
                            src={resumePreviewUrl}
                            alt="Resume preview"
                            className="h-auto max-h-[92vh] w-auto max-w-[96vw]"
                        />
                    </div>
                </div>
            ) : null}

            {isProjectionPreviewOpen && activeProject?.projectionImage ? (
                <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center p-6">
                    <button
                        type="button"
                        className="absolute inset-0 bg-stone-500/20"
                        aria-label="Close projection preview"
                        onClick={onCloseProjectionPreview}
                    />

                    <div className="relative z-10 flex justify-center">
                        <button
                            type="button"
                            className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-sm text-stone-100"
                            onClick={onCloseProjectionPreview}
                        >
                            Close
                        </button>

                        <img
                            src={activeProject.projectionImage}
                            alt={`${activeProject.title} projection preview`}
                            className="h-auto max-h-[92vh] w-auto max-w-[96vw]"
                        />
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default ProfessionalPage

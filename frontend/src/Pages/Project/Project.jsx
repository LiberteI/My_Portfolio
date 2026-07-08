import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProjectScene from "./ProjectScene"
import ProjectPageNav from "../../Components/ProjectPageNav"
import { projectRecords } from "./project.data"
import { mapProjectsToDisplayModels } from "./project.mapper"

const ProjectScrollCard = ({ project, index, isActive, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "group flex w-40 shrink-0 flex-col gap-1 rounded-2xl border p-3 text-left transition duration-300",
                isActive
                    ? "border-stone-200/60 shadow-[0_0_36px_rgba(228,213,196,0.16)]"
                    : "border-white/0 opacity-70 hover:border-white/30 hover:opacity-100"
            ].join(" ")}
        >
            <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.28em] text-stone-300/80">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {isActive ? <span className="text-stone-100">Live</span> : null}
            </div>
            <div className="hidden overflow-hidden rounded-xl border border-white/10 min-[600px]:block">
                <img
                    src={project.image}
                    alt={project.title}
                    className="h-18 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
            </div>
            <div className="space-y-1">
                <p className="font-serif text-base text-stone-100">{project.title}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                    {project.meta.subtitle}
                </p>
            </div>
        </button>
    )
}

const ProjectMetadata = ({ label, value }) => {
    return (
        <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">{label}</p>
            <p className="text-sm leading-6 text-stone-200">{value}</p>
        </div>
    )
}

const FeaturedProjectPanel = ({ featuredProject }) => {
    return (
        <div className="pointer-events-none absolute inset-x-0 top-20 z-20 h-[70vh] px-6 md:top-10 md:px-12 lg:px-16">
            <div className="flex h-full w-full max-w-[35rem] items-start">
                <div className="max-h-full overflow-y-auto rounded-[2rem] bg-black/0 p-6 md:p-8">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[11px] uppercase tracking-[0.36em] text-stone-400">
                                {featuredProject.meta.indexLabel}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.36em] text-stone-500">
                                {featuredProject.meta.badgeLabel}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h1 className="max-w-md font-serif text-4xl leading-none text-stone-50 md:text-5xl">
                                {featuredProject.title}
                            </h1>
                            <p className="max-w-md text-sm leading-7 text-stone-300 md:text-[15px]">
                                {featuredProject.description}
                            </p>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-stone-300/40 via-stone-300/10 to-transparent" />

                        <div className="hidden gap-2 min-[770px]:grid md:grid-cols-2">
                            <ProjectMetadata label="Role" value={featuredProject.meta.roleLabel} />
                            <ProjectMetadata label="Duration" value={featuredProject.meta.durationLabel} />
                            <ProjectMetadata label="Stack" value={featuredProject.meta.stackLabel} />
                            <ProjectMetadata label="Category" value={featuredProject.meta.categoryLabel} />
                        </div>

                        <a
                            href={featuredProject.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-stone-200/40 bg-stone-100/10 px-5 py-3 text-sm uppercase tracking-[0.24em] text-stone-100 transition hover:border-stone-100 hover:bg-stone-100 hover:text-black"
                        >
                            View Project
                            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProjectCarouselDock = ({ activeProjectIndex, projects, onSelectProject }) => {
    return (
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-[20vh] min-h-[12rem] flex-col justify-end px-4 pb-6 md:px-8 md:pb-8 lg:px-10">
            <div className="mx-auto flex w-full max-w-7xl shrink-0 items-end gap-3 p-3 md:gap-4 md:p-4">
                <button
                    type="button"
                    onClick={() => onSelectProject(activeProjectIndex - 1)}
                    className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-stone-100 transition hover:border-white/30 hover:bg-white/10"
                    aria-label="Previous project"
                >
                    ←
                </button>

                <div className="custom-scrollbar-dark pointer-events-auto flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
                    {projects.map((project, index) => (
                        <ProjectScrollCard
                            key={project.slug}
                            project={project}
                            index={index}
                            isActive={index === activeProjectIndex}
                            onClick={() => onSelectProject(index)}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => onSelectProject(activeProjectIndex + 1)}
                    className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-stone-100 transition hover:border-white/30 hover:bg-white/10"
                    aria-label="Next project"
                >
                    →
                </button>
            </div>

            <div className="mt-3 flex shrink-0 items-center justify-center gap-2">
                {projects.map((project, index) => (
                    <button
                        key={project.slug}
                        type="button"
                        onClick={() => onSelectProject(index)}
                        className={[
                            "pointer-events-auto h-2.5 rounded-full transition",
                            index === activeProjectIndex ? "w-10 bg-stone-100" : "w-2.5 bg-stone-100/28 hover:bg-stone-100/45"
                        ].join(" ")}
                        aria-label={`Go to ${project.title}`}
                    />
                ))}
            </div>
        </div>
    )
}

const Project = () => {
    const projects = useMemo(() => mapProjectsToDisplayModels(projectRecords), [])
    const [activeProjectIndex, setActiveProjectIndex] = useState(0)
    const [isNavExpanded, setIsNavExpanded] = useState(false)
    const featuredProject = projects[activeProjectIndex] ?? projects[0]
    const navigate = useNavigate()

    const handleSelectProject = (nextIndex) => {
        const boundedIndex = (nextIndex + projects.length) % projects.length
        setActiveProjectIndex(boundedIndex)
    }

    const handleNavItemClick = (event, item) => {
        event.preventDefault()

        if (item.type === "scroll") {
            setIsNavExpanded(false)
            navigate("/", { state: { scrollTo: item.target } })
            return
        }

        setIsNavExpanded(false)
        navigate(item.to)
    }

    return (
        <section className="relative h-screen overflow-hidden bg-black text-stone-100" data-project-count={projects.length}>
            <ProjectScene
                className="absolute inset-0 h-full w-full bg-black"
                screenTextureUrl={featuredProject?.image}
            />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(228,213,196,0.18),transparent_50%),linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.46)_34%,rgba(0,0,0,0.14)_62%,rgba(0,0,0,0.52)_100%)]" />

            <ProjectPageNav
                isNavExpanded={isNavExpanded}
                setIsNavExpanded={setIsNavExpanded}
                onNavItemClick={handleNavItemClick}
                navigate={navigate}
            />

            <FeaturedProjectPanel featuredProject={featuredProject} />

            <ProjectCarouselDock
                activeProjectIndex={activeProjectIndex}
                projects={projects}
                onSelectProject={handleSelectProject}
            />
        </section>
    )
}

export default Project

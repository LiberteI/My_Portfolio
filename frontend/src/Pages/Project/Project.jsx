import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import shapeMorphingGif from "../../assets/ProjectThumbnail/ShapeMorphing.gif"
import astronomyGif from "../../assets/ProjectThumbnail/astronomy.gif"
import oceanGif from "../../assets/ProjectThumbnail/ocean.gif"
import ProjectScene from "./ProjectScene"

const projectThumb = "/images/project-thumbnails/KnightThumbnail.png"
const bubbleThumb = "/images/project-thumbnails/Bubble.png"
const agentThumb = "/images/project-thumbnails/agent.png"
const supervisedLearningThumb = "/images/projects/supervisedLearning.png"
const dalTutorThumb = "/images/projects/daltutor.png"
const iceSpyThumb = "/images/projects/iceSpy.png"
const portfolioThumb = "/images/projects/portfolio.png"

const projects = [
    {
        title: "My Portfolio",
        slug: "my-portfolio",
        image: portfolioThumb,
        topic: "Full-Stack Development",
        skills: "React · Node.js · MongoDB · Javascript · Full Stack",
        description: "A full-stack portfolio site with interactive 3D scenes, responsive layouts, and dynamic content.",
        githubLink: "https://github.com/LiberteI/My_Portfolio",
        isSoloProject: true,
        canLink: false
    },
    {
        title: "Housing Price Predictor",
        slug: "housing-price-predictor",
        image: supervisedLearningThumb,
        topic: "Supervised Learning",
        skills: "Python · Regression Modeling · Data Preprocessing · Model Evaluation · Data Visualization",
        description: "An end-to-end regression pipeline for predicting housing prices from real-world data.",
        githubLink: "https://github.com/LiberteI/Supervised-Learning-Workshop",
        isSoloProject: true,
        canLink: false
    },
    {
        title: "Dal Tutor",
        slug: "dal-tutor",
        image: dalTutorThumb,
        topic: "Software Development",
        skills: "Agile Development · Extreme Programming (XP) · Java · Android Studio · Team Collaboration",
        description: "An Android tutoring platform built through Agile iterations and collaborative delivery.",
        githubLink: "https://github.com/LiberteI/dalTutor",
        isSoloProject: false,
        canLink: false
    },
    {
        title: "Ocean Simulation",
        slug: "ocean-simulation",
        image: oceanGif,
        topic: "Computer Animation",
        skills: "C++ · OpenGL (GLEW) · Vertex & Fragment Shaders · Lighting · Camera & Input Systems · Real-Time Animation Systems",
        description: "A C++ OpenGL submarine simulator with lighting, fog, animated waves, and interactive navigation.",
        githubLink: "https://github.com/LiberteI/Submarine",
        canLink: false,
        isSoloProject: true
    },
    {
        title: "Astronomical Simulation",
        slug: "astronomical-simulation",
        image: astronomyGif,
        topic: "Computer Animation",
        skills: "skills: C++ · OpenGL (GLUT) · 3D Graphics & Transformations · Camera & Projection Systems · Vertex-Based Rendering · Double & Depth Buffering",
        description: "A C++ OpenGL planetary scene with animated orbits, stars, and interactive camera controls.",
        githubLink: "https://github.com/LiberteI/Astronomical_System",
        canLink: false,
        isSoloProject: true
    },
    {
        title: "Ice Spy",
        slug: "ice-spy",
        image: iceSpyThumb,
        topic: "Machine Learning",
        skills: "Machine Learning · Data Analysis · Pathfinding · Geospatial Mapping · Algorithm Design",
        description: "A hackathon project using ML and pathfinding to optimize Arctic shipping routes.",
        githubLink: "https://github.com/hongh233/NASA",
        isSoloProject: false,
        canLink: false
    },
    {
        title: "Shape Morphing",
        slug: "shape-morphing",
        image: shapeMorphingGif,
        topic: "Computer Animation",
        skills: "skills: C++ · OpenGL (GLUT) · Vertex-Based Shape Morphing · Linear Interpolation (LERP) · Modular OOP Design · Double-Buffered Rendering",
        description: "A C++ OpenGL app that morphs custom shapes through interpolation and vertex resampling.",
        githubLink: "https://github.com/LiberteI/Computer_Animation",
        canLink: false,
        isSoloProject: true
    },
    {
        title: "Easy Shop",
        slug: "easy-shop",
        image: agentThumb,
        topic: "Agentic AI",
        skills: "AI Agents · Large Language Models (LLM) · Retrieval-Augmented Generation (RAG) · MongoDB · n8n Automation · Conversational System Design",
        description: "A WhatsApp AI shopping agent with memory, inventory awareness, and automated ordering.",
        githubLink: "https://github.com/LiberteI",
        isSoloProject: true,
        canLink: false
    },
    {
        title: "Knight of Cinders",
        slug: "knight-of-cinders",
        image: projectThumb,
        canLink: true,
        topic: "Game Development",
        skills: "Unity · Tilemap · Cinemachine · Physics & Raycasting · Singleton Architecture · State-Driven Systems",
        description: "A dark 2D action game with stamina-based combat, boss fights, and cinematic atmosphere.",
        githubLink: "https://github.com/LiberteI/KnightOfCinders_firstProject",
        isSoloProject: true
    },
    {
        title: "Bubble Biologist",
        slug: "bubble-biologist",
        image: bubbleThumb,
        topic: "Game Development",
        skills: "Unity · Gameplay Programming · Physics Systems · Git Collaboration · Rapid Iteration · 2D Game Development",
        description: "A fast-paced Game Jam platformer built around bubble survival and physics-driven movement.",
        githubLink: "https://github.com/LydiaV2001/GGJ2025",
        isSoloProject: false,
        canLink: false
    }
]

const navItems = [
    { label: "Projects", type: "route", to: "/projects" },
    { label: "Experience", type: "route", to: "/experience" },
    { label: "Music", type: "route", to: "/music" },
    { label: "About", type: "scroll", target: "about" }
]

const getProjectMeta = (project) => {
    const primarySkill = project.skills
        .replace(/^skills:\s*/i, "")
        .split("·")
        .map((skill) => skill.trim())
        .filter(Boolean)[0] ?? project.topic

    return {
        indexLabel: String(projects.findIndex(({ slug }) => slug === project.slug) + 1).padStart(2, "0"),
        badgeLabel: project.canLink ? "FEATURED PROJECT" : "ARCHIVE PROJECT",
        role: project.isSoloProject ? "Independent Builder" : "Team Collaborator",
        duration: project.isSoloProject ? "Self-Directed Build" : "Team Delivery Sprint",
        stack: project.skills.replace(/^skills:\s*/i, ""),
        category: project.topic,
        subtitle: `${project.topic} · ${primarySkill}`
    }
}

const ProjectScrollCard = ({ project, index, isActive, onClick }) => {
    const meta = getProjectMeta(project)

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
            <div className="overflow-hidden rounded-xl border border-white/10">
                <img
                    src={project.image}
                    alt={project.title}
                    className="h-18 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
            </div>
            <div className="space-y-1">
                <p className="font-serif text-base text-stone-100">{project.title}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                    {meta.subtitle}
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

const ProjectPageNav = ({ isNavExpanded, setIsNavExpanded, onNavItemClick, navigate }) => {
    return (
        <nav className={`absolute inset-x-0 top-0 px-6 py-8 md:px-12 lg:px-16 ${isNavExpanded ? "z-40" : "z-20"}`}>
            <div className="flex items-center justify-between">
                <a
                    href="/"
                    onClick={(event) => {
                        event.preventDefault()
                        setIsNavExpanded(false)
                        navigate("/")
                    }}
                    className="pointer-events-auto hidden items-center rounded-full px-3 py-2 text-sm uppercase tracking-[0.34em] text-stone-200 transition hover:text-white min-[553px]:inline-flex"
                    aria-label="Go to home"
                >
                    Home
                </a>
                <button
                    type="button"
                    onClick={() => setIsNavExpanded((current) => !current)}
                    className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-stone-100 min-[553px]:hidden"
                    aria-label={isNavExpanded ? "Close navigation" : "Open navigation"}
                    aria-expanded={isNavExpanded}
                >
                    <span className="relative block h-4 w-5">
                        <span className={`absolute left-0 top-0 h-px w-5 bg-current transition ${isNavExpanded ? "translate-y-[7px] rotate-45" : ""}`} />
                        <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition ${isNavExpanded ? "opacity-0" : ""}`} />
                        <span className={`absolute left-0 top-[14px] h-px w-5 bg-current transition ${isNavExpanded ? "-translate-y-[7px] -rotate-45" : ""}`} />
                    </span>
                </button>
                <div className="pointer-events-auto hidden items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-stone-400 min-[553px]:flex md:gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.type === "scroll" ? `/#${item.target}` : item.to}
                            onClick={(event) => onNavItemClick(event, item)}
                            className={[
                                "pointer-events-auto inline-flex items-center rounded-full px-3 py-2",
                                item.label === "Projects" ? "text-stone-100" : "transition hover:text-stone-200"
                            ].join(" ")}
                            aria-label={`Go to ${item.label.toLowerCase()}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
            {isNavExpanded ? (
                <div className="pointer-events-auto absolute left-6 top-[5.5rem] w-[min(16rem,calc(100vw-3rem))] rounded-[1.5rem] border border-white/10 bg-white/1 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md min-[553px]:hidden">
                    <div className="flex flex-col items-start gap-1 text-[11px] uppercase tracking-[0.28em] text-stone-100/88">
                        <a
                            href="/"
                            onClick={(event) => {
                                event.preventDefault()
                                setIsNavExpanded(false)
                                navigate("/")
                            }}
                            className="pointer-events-auto inline-flex w-full items-center rounded-xl px-3 py-3 transition hover:bg-white/14 hover:text-white"
                            aria-label="Go to home"
                        >
                            Home
                        </a>
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.type === "scroll" ? `/#${item.target}` : item.to}
                                onClick={(event) => onNavItemClick(event, item)}
                                className={[
                                    "pointer-events-auto inline-flex w-full items-center rounded-xl px-3 py-3",
                                    item.label === "Projects" ? "bg-white/14 text-white" : "transition hover:bg-white/14 hover:text-white"
                                ].join(" ")}
                                aria-label={`Go to ${item.label.toLowerCase()}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            ) : null}
        </nav>
    )
}

const FeaturedProjectPanel = ({ featuredProject, featuredMeta }) => {
    return (
        <div className="pointer-events-none absolute inset-x-0 top-20 z-20 h-[70vh] px-6 md:top-10 md:px-12 lg:px-16">
            <div className="flex h-full w-full max-w-[35rem] items-start">
                <div className="max-h-full overflow-y-auto rounded-[2rem] bg-black/0 p-6 md:p-8">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[11px] uppercase tracking-[0.36em] text-stone-400">
                                {featuredMeta.indexLabel}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.36em] text-stone-500">
                                {featuredMeta.badgeLabel}
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
                            <ProjectMetadata label="Role" value={featuredMeta.role} />
                            <ProjectMetadata label="Duration" value={featuredMeta.duration} />
                            <ProjectMetadata label="Stack" value={featuredMeta.stack} />
                            <ProjectMetadata label="Category" value={featuredMeta.category} />
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

const ProjectCarouselDock = ({ activeProjectIndex, onSelectProject }) => {
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
    const [activeProjectIndex, setActiveProjectIndex] = useState(0)
    const [isNavExpanded, setIsNavExpanded] = useState(false)
    const featuredProject = projects[activeProjectIndex] ?? projects[0]
    const featuredMeta = useMemo(() => getProjectMeta(featuredProject), [featuredProject])
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

            <FeaturedProjectPanel featuredProject={featuredProject} featuredMeta={featuredMeta} />

            <ProjectCarouselDock
                activeProjectIndex={activeProjectIndex}
                onSelectProject={handleSelectProject}
            />
        </section>
    )
}

export default Project

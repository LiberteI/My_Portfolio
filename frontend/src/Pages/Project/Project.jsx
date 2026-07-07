import { useMemo, useState } from "react"
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
        lightColor: "#e4d5c4",
        isSoloProject: true,
        canLink: false
    },
    {
        title: "Housing Price Predictor",
        slug: "housing-price-predictor",
        image: supervisedLearningThumb,
        topic: "Supervised Learning",
        skills: "Supervised Learning · Regression Modeling · Data Preprocessing · Python · Model Evaluation · Data Visualization",
        description: "An end-to-end regression pipeline for predicting housing prices from real-world data.",
        githubLink: "https://github.com/LiberteI/Supervised-Learning-Workshop",
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
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
        lightColor: "#e4d5c4",
        isSoloProject: false,
        canLink: false
    }
]

const navItems = ["Projects", "Experience", "Music", "About"]

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
        <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">{label}</p>
            <p className="text-sm leading-6 text-stone-200">{value}</p>
        </div>
    )
}

const Project = () => {
    const [activeProjectIndex, setActiveProjectIndex] = useState(0)
    const featuredProject = projects[activeProjectIndex] ?? projects[0]
    const featuredMeta = useMemo(() => getProjectMeta(featuredProject), [featuredProject])

    const handleSelectProject = (nextIndex) => {
        const boundedIndex = (nextIndex + projects.length) % projects.length
        setActiveProjectIndex(boundedIndex)
    }

    return (
        <section className="relative h-screen overflow-hidden bg-black text-stone-100" data-project-count={projects.length}>
            <ProjectScene
                className="absolute inset-0 h-full w-full bg-black"
                projects={projects}
                featuredProject={featuredProject}
                screenTextureUrl={featuredProject?.image}
                lightColor={featuredProject?.lightColor}
            />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(228,213,196,0.18),transparent_50%),linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.46)_34%,rgba(0,0,0,0.14)_62%,rgba(0,0,0,0.52)_100%)]" />

            <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-8 md:px-12 lg:px-16">
                <button
                    type="button"
                    className="pointer-events-auto text-sm uppercase tracking-[0.34em] text-stone-200 transition hover:text-white"
                >
                    Home
                </button>
                <div className="pointer-events-auto flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-stone-400 md:gap-6">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={item === "Projects" ? "text-stone-100" : "transition hover:text-stone-200"}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="absolute left-0 top-20 z-20 w-full max-w-[30rem] px-6 pb-72
                md:top-10 md:px-12 
                lg:px-16">
                <div className="pointer-events-auto rounded-[2rem] bg-black/0 p-6 md:p-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <p className="text-[11px] uppercase tracking-[0.36em] text-stone-400">
                                {featuredMeta.indexLabel}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.36em] text-stone-500">
                                {featuredMeta.badgeLabel}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h1 className="max-w-md font-serif text-4xl leading-none text-stone-50 md:text-5xl">
                                {featuredProject.title}
                            </h1>
                            <p className="max-w-md text-sm leading-7 text-stone-300 md:text-[15px]">
                                {featuredProject.description}
                            </p>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-stone-300/40 via-stone-300/10 to-transparent" />

                        <div className="grid gap-5 md:grid-cols-2">
                            <ProjectMetadata label="Role" value={featuredMeta.role} />
                            <ProjectMetadata label="Duration" value={featuredMeta.duration} />
                            <ProjectMetadata label="Stack" value={featuredMeta.stack} />
                            <ProjectMetadata label="Category" value={featuredMeta.category} />
                        </div>

                        <a
                            href={featuredProject.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 rounded-full border border-stone-200/40 bg-stone-100/10 px-5 py-3 text-sm uppercase tracking-[0.24em] text-stone-100 transition hover:border-stone-100 hover:bg-stone-100 hover:text-black"
                        >
                            View Project
                            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-8 z-20 px-4 md:px-8 lg:px-10">
                <div className="mx-auto flex max-w-7xl items-end gap-3 p-3
                    md:gap-4 md:p-4">
                    <button
                        type="button"
                        onClick={() => handleSelectProject(activeProjectIndex - 1)}
                        className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-stone-100 transition hover:border-white/30 hover:bg-white/10"
                        aria-label="Previous project"
                    >
                        ←
                    </button>

                    <div className="pointer-events-auto flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
                        {projects.map((project, index) => (
                            <ProjectScrollCard
                                key={project.slug}
                                project={project}
                                index={index}
                                isActive={index === activeProjectIndex}
                                onClick={() => handleSelectProject(index)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => handleSelectProject(activeProjectIndex + 1)}
                        className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-stone-100 transition hover:border-white/30 hover:bg-white/10"
                        aria-label="Next project"
                    >
                        →
                    </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    {projects.map((project, index) => (
                        <button
                            key={project.slug}
                            type="button"
                            onClick={() => handleSelectProject(index)}
                            className={[
                                "pointer-events-auto h-2.5 rounded-full transition",
                                index === activeProjectIndex ? "w-10 bg-stone-100" : "w-2.5 bg-stone-100/28 hover:bg-stone-100/45"
                            ].join(" ")}
                            aria-label={`Go to ${project.title}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Project

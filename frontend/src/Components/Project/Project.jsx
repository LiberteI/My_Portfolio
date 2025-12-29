import "./Project.css"
import ProjectCard from "./ProjectCard"
import projectThumb from "../../assets/ProjectThumbnail/KnightThumbnail.png"
import deadzoneThumb from "../../assets/ProjectThumbnail/deadzone_thumbnail.png"

const projects = [
    {
        title: "Knight of Cinders",
        slug: "knight-of-cinders",
        image: projectThumb,
        canLink: true,
        topic: "Game Development",
        skills: "Unity · Tilemap · Cinemachine · Physics & Raycasting · Singleton Architecture · State-Driven Systems",
        description: "A dark 2D action game inspired by Souls-like combat, following a fallen knight driven by loss and revenge. The game features deliberate, stamina-based melee combat, multi-phase boss encounters with distinct attack patterns, and adaptive enemy behaviors. Atmospheric parallax-scrolled environments, and cinematic animations.",
        githubLink: "https://github.com/LiberteI/KnightOfCinders_firstProject",
        isSoloProject: false
    },
    {
        title: "Deadzone",
        slug: "deadzone",
        image: deadzoneThumb,
        canLink: false,
        topic: "Game Development",
        skills: "Unity · C# · Finite State Machines (FSM) · Enemy & Ally AI · Event-Driven Architecture · Gameplay Systems Design",
        description:"Designing and developing an indie 2D post-apocalyptic zombie survival shooter focused on responsive combat, barricade defense, and intelligent AI systems. Built modular, state-driven player and enemy behaviors using clean architecture to create emergent gameplay, tactical depth, and a polished, skill-based player experience.",
        githubLink:"https://github.com/LiberteI/DeadZone",
        isSoloProject: true
    }
    

]

const Project = () => {
    return (
        <section className="project-container" id="projects">

            <h1>My Projects</h1>
            
            <div className="project-grid">
                {projects.map((project) => (
                    <ProjectCard 
                        key={project.slug} 
                        projectData={project}
                    />
                        
                ))}
            </div>

        </section>
    )
}

export default Project

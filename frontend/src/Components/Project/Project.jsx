import "./Project.css"
import ProjectCard from "./ProjectCard"
import projectThumb from "../../assets/LOGO_dark.png"

const projects = [
    {
        title: "Knight of Cinders",
        slug: "knight-of-cinders",
        image: projectThumb,
        canLink: true,
        topic: "Game Development",
        skills: "Unity · Tilemap · Cinemachine · Physics & Raycasting · Singleton Architecture · State-Driven Systems",
        description: "A dark 2D action game inspired by Souls-like combat, following a fallen knight driven by loss and revenge. The game features deliberate, stamina-based melee combat, multi-phase boss encounters with distinct attack patterns, and adaptive enemy behaviors. Atmospheric environments, parallax-scrolled levels, and cinematic animations reinforce a bleak world shaped by decay and conflict."
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

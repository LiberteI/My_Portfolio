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
        skills: "#GameDev #Unity, ",
        description: "You are a noble knight who watched an evil witch, now it is your time to take revenge!"
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

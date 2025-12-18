import "./Project.css"
import ProjectCard from "./ProjectCard"
import projectThumb from "../../assets/LOGO_dark.png"

const projects = [
    {
        title: "Knight of Cinders",
        slug: "knight-of-cinders",
        image: projectThumb,
        canLink: true
    }

]

const Project = () => {
    return (
        <section className="project-container" id="projects">

            <h1>My Projects</h1>
            
            {projects.map((project) => (

                <ProjectCard 
                    key={project.slug} 
                    title={project.title}
                    slug={project.slug}
                    image={project.image} 
                    canLink={project.canLink} />
                    
            ))}

        </section>
    )
}

export default Project

import { Link } from 'react-router-dom'
import "./Project.css"
import github from "../../assets/devTools/github.png"

const ProjectCard = ({ projectData }) => {

  const { title, image, slug, canLink, description, topic, skills, githubLink, isSoloProject } = projectData
  const projectTypeLabel = isSoloProject ? 'Solo Project' : 'Group Project'
  if (canLink) {
    return (
    <div className="project-card">

        <div className='left-column'>
            <Link to={`/projects/${slug}`} className="project-thumbnail">
                <img src={image} alt={title} />
            </Link>
        </div>

        <div className='right-column'>
            <h2>{title}</h2>

            <div className='project-meta'>
              <p className='project-topic'>{topic}</p>
              <span className={`project-badge ${isSoloProject ? 'project-badge--solo' : 'project-badge--group'}`}>
                {projectTypeLabel}
              </span>
            </div>

            <p className='project-skills'>{skills}</p>

            <p className='project-description'>{description}</p>

            <a className="project-github-link" href={githubLink}>
                <img className='project-github-icon' src={github} alt="GitHub" />
            </a>

        </div>
    </div>
      
    );
  }
  

  return (
    <div className="project-card">

        <div className='left-column'>

            <div className="project-thumbnail">
                <img src={image} alt={title} />
            </div>
            
        </div>

        <div className='right-column'>
            <h2>{title}</h2>

            <div className='project-meta'>
              <p className='project-topic'>{topic}</p>
              <span className={`project-badge ${isSoloProject ? 'project-badge--solo' : 'project-badge--group'}`}>
                {projectTypeLabel}
              </span>
            </div>

            <p className='project-skills'>{skills}</p>

            <p className='project-description'>{description}</p>

            <a className="project-github-link" href={githubLink || ''}>
                <img className='project-github-icon' src={github} alt="GitHub" />
            </a>
        </div>
    </div>
  );
};

export default ProjectCard;

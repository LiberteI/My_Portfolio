import { Link } from 'react-router-dom'
import "./Project.css"
import github from "../../assets/github.png"
const ProjectCard = ({ title, image, slug, canLink, description, topic, skills}) => {
  if (canLink) {
    return (
    <div className="project-card">
        
        <div className='left-column'>
            <Link to={`/projects/${slug}`} className="project-card">
                <img src={image} alt={title} />
            </Link>
        </div>

        <div className='right-column'>
            <h2>{title}</h2>

            <p>{topic}</p>

            <p>{skills}</p>

            <p>{description}</p>

            <a href=""><img src={github} alt="" /></a>
        </div>
    </div>
      
    );
  }
  

  return (
    <div className="project-card">
      <div className='left-column'>
            <img src={image} alt={title} />
        </div>

        <div className='right-column'>
            <h2>{title}</h2>

            <p>{topic}</p>

            <p>{skills}</p>

            <p>{description}</p>

            <a href=""><img src={github} alt="" /></a>
        </div>
    </div>
  );
};

export default ProjectCard;

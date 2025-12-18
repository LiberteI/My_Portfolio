import { Link } from 'react-router-dom'
import "./Project.css"
import github from "../../assets/github.png"
const ProjectCard = ({ title, image, slug, canLink, description, topic}) => {
  if (canLink) {
    return (
      <Link to={`/projects/${slug}`} className="project-card">

        <div className='left-column'>
            <img src={image} alt={title} />
        </div>

        <div className='right-column'>
            <h2>{title}</h2>

            <p>{topic}</p>
            <p>{description}</p>

            <a href=""><img src={github} alt="" /></a>
        </div>
        
      </Link>
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
            <p>{description}</p>

            <a href=""><img src={github} alt="" /></a>
        </div>
    </div>
  );
};

export default ProjectCard;

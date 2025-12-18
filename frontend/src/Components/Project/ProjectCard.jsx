import { Link } from 'react-router-dom'
import "./Project.css"
import github from "../../assets/github.png"
const ProjectCard = ({ title, image, slug, canLink, description, topic}) => {
  if (canLink) {
    return (
      <Link to={`/projects/${slug}`} className="project-card">
        <h2>{title}</h2>
        <img src={image} alt={title} />
        <img src={github} alt="" />
        <p>{topic}</p>
        <p>{description}</p>
      </Link>
    );
  }

  return (
    <div className="project-card">
      <h2>{title}</h2>
      <img src={image} alt={title} />
      <img src={github} alt="" />
    </div>
  );
};

export default ProjectCard;

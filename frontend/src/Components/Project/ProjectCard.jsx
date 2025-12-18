import { Link } from 'react-router-dom'

const ProjectCard = ({ title, image, slug, canLink }) => {
  if (canLink) {
    return (
      <Link to={`/projects/${slug}`} className="project-card">
        <h2>{title}</h2>
        <img src={image} alt={title} />
      </Link>
    );
  }

  return (
    <div className="project-card">
      <h2>{title}</h2>
      <img src={image} alt={title} />
    </div>
  );
};

export default ProjectCard;

import './CurrentlyBuilding.css';

const CurrentlyBuildingCard = ({ thumbnail, title, shortDescription }) => {
  return (
    <article className="currently-building-card">
      {thumbnail && <img src={thumbnail} alt={`${title} thumbnail`} loading="lazy" />}
      <h3>{title}</h3>
      <p>{shortDescription}</p>
    </article>
  );
};

export default CurrentlyBuildingCard;

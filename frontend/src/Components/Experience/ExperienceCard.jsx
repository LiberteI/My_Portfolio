const ExperienceCard = ({experienceData}) => {

    const {
        logo,
        name,
        position,
        duration
    } = experienceData
    return (
        <div className="experienceCard-container">
            <img className="company-logo" src={logo} alt="" />
            <h1 className="company-name">{name}</h1>
            <h2 className="position-detail">{position}</h2>
            <h2 className="position-duration">{duration}</h2>

            <p className="position-content">upcoming</p>
        </div>
    )
}

export default ExperienceCard
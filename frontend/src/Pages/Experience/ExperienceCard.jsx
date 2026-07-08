const ExperienceCard = ({experienceData}) => {

    const {
        logo,
        logoBg,
        name,
        position,
        duration
    } = experienceData
    return (
        <div className="experience-card">
            <div className="experience-card-header" style={{ "--logo-bg": logoBg }}>
                <img className="company-logo" src={logo} alt={`${name} logo`} />
            </div>
            <h1 className="company-name">{name}</h1>
            <h2 className="position-detail">{position}</h2>
            <h3 className="position-duration">{duration}</h3>

            <p className="position-content">upcoming</p>
        </div>
    )
}

export default ExperienceCard

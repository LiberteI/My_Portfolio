import ExperienceCard from "./ExperienceCard"
import questLogo from "../../assets/icons/QuestLogo.svg"
const experiences = [

    {
        key: "quest",
        logo: questLogo,
        name: "Quest Software",
        position: "Software Developer Intern",
        duration: "May 2026 - August 2026"
    }
]

const Experience = () => {

    return(
        <section>
            <h1>My Experiences</h1>
            
            <div className="experience-grid">
                {experiences.map((experience) => (
                    <ExperienceCard 
                        key={experience.key}
                        experienceData={experience}
                    />
                ))}
            </div>
        </section>
    )
}

export default Experience

const magicianImg = "/images/magician/magician.png"
const leftArmImg = "/images/magician/left-arm.png"
const rightArmImg = "/images/magician/right-arm.png"
const questLogo = "/images/icons/QuestLogo.svg"
const experiences = [

    {
        key: "quest",
        logo: questLogo,
        logoBg: "#ffffffff",
        name: "Quest Software",
        position: "Software Developer Intern",
        duration: "May 2026 - August 2026"
    }
]

const Experience = () => {

    return(
        <section className="relative min-h-[720px] overflow-hidden bg-black">
            <div className="relative z-10">
                <h1>My Experiences</h1>
            </div>

            {/* magician background layer */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-1/2 top-0 aspect-[1000/720] w-full max-w-[1000px] -translate-x-1/2 px-4">
                    <img 
                        className="absolute inset-0 h-auto w-full z-10" 
                        src={magicianImg} alt="Magician illustration" />
                    <img 
                        className="absolute left-[-2%] top-[19%] w-[48%] z-5" 
                        src={leftArmImg} alt="" aria-hidden="true" />
                    <img 
                        className="absolute left-[56%] top-[17%] w-[48%] z-5" 
                        src={rightArmImg} alt="" aria-hidden="true" />
                </div>
            </div>

            <div className="relative z-10">
                {/* experience cards stage */}
            </div>
        </section>
    )
}

export default Experience

import { motion as Motion } from "framer-motion"
import { useEffect, useState } from "react"
import Stack from "../../Components/Stack"
import { ExperienceRecords } from "../../data/experience/experience.data"
import handTapGif from "../../assets/Animations/hand-tap.gif"

const experienceOverlayVariants = {
    hidden: {
        opacity: 0,
        y: 18,
        scale: 1.03
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    exiting: {
        opacity: 0,
        y: -18,
        scale: 1.04
    }
}

const STACK_HIDE_BREAKPOINT = 800

const ExperienceDeckCard = ({ experience, index }) => {
    return (
        <article className="rounded-[1.4rem] border border-white/10 bg-black/35 p-4 backdrop-blur-md">
            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
                    {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-xl leading-none text-stone-50">
                    {experience.title}
                </h3>
                {experience.orgName ? (
                    <p className="text-sm text-stone-300">{experience.orgName}</p>
                ) : null}
            </div>
        </article>
    )
}

const ExperienceOverlay = () => {
    const [cardDimensions, setCardDimensions] = useState({ width: 400, height: 300 })
    const [showStackCards, setShowStackCards] = useState(true)
    const [handTapCycle, setHandTapCycle] = useState(0)

    useEffect(() => {
        const resizeCards = () => {
            const viewportWidth = window.innerWidth
            setShowStackCards(viewportWidth >= STACK_HIDE_BREAKPOINT)

            if (viewportWidth >= 1280) {
                setCardDimensions({ width: 400, height: 300 })
                return
            }

            const scale = Math.max(0.7, viewportWidth / 1280)
            setCardDimensions({
                width: Math.round(400 * scale),
                height: Math.round(300 * scale)
            })
        }

        resizeCards()
        window.addEventListener("resize", resizeCards)

        return () => {
            window.removeEventListener("resize", resizeCards)
        }
    }, [])

    useEffect(() => {
        if (!showStackCards) {
            return undefined
        }

        const handTapInterval = window.setInterval(() => {
            setHandTapCycle((currentCycle) => currentCycle + 1)
        }, 8000)

        return () => {
            window.clearInterval(handTapInterval)
        }
    }, [showStackCards])

    return(
        <Motion.section
            className="pointer-events-none absolute inset-0 z-20 px-6 pb-8 pt-24 md:px-12 lg:px-16"
            initial="hidden"
            animate="visible"
            exit="exiting"
            variants={experienceOverlayVariants}
            transition={{
                duration: 0.45,
                ease: "easeOut"
            }}
        >
           <div className="flex h-full flex-col justify-between gap-8 md:flex-row md:items-start">
                <div className="pointer-events-auto max-w-xl space-y-4">
                    <h1 className="font-serif text-4xl leading-none text-stone-50 md:text-5xl">
                        My 
                        <br />
                        Experience
                    </h1>

                    <p className="max-w-md text-sm leading-7 text-stone-300 md:text-[15px]">
                        Every experience shapes
                        <br />
                        who I am today.
                    </p>

                </div>
                
                {showStackCards ? (
                    <div className="pointer-events-auto relative flex flex-1 items-center justify-center md:justify-end">
                        <Stack
                            cardDimensions={cardDimensions}
                        />
                        <Motion.img
                            key={handTapCycle}
                            src={handTapGif}
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute right-14 top-1/2 z-20 h-24 -translate-y-1/2"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                scale: [0.92, 1, 1, 0.96]
                            }}
                            transition={{
                                duration: 2.8,
                                times: [0, 0.18, 0.68, 1],
                                ease: "easeOut"
                            }}
                            style={{
                                filter: "drop-shadow(0 0 16px rgba(241, 214, 160, 0.45)) drop-shadow(0 0 28px rgba(241, 214, 160, 0.2))"
                            }}
                        />
                    </div>
                ) : null}
           </div>

            {!showStackCards ? (
                <div className="pointer-events-auto absolute inset-x-6 bottom-6 z-20 md:inset-x-12 lg:inset-x-16">
                    <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
                        <div className="custom-scrollbar-dark max-h-[25vh] overflow-y-auto pr-1">
                            <div className="flex flex-col gap-3">
                                {ExperienceRecords.map((experience, index) => (
                                    <ExperienceDeckCard
                                        key={`${experience.orgName || experience.title}-${index}`}
                                        experience={experience}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </Motion.section>
    )
}

export default ExperienceOverlay

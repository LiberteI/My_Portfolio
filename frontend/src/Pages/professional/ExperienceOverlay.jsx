import { motion } from "framer-motion"
import Stack from "../../Components/Stack"

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

const ExperienceOverlay = () => {
    return(
        <motion.section
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

                    <div className="h-px w-full max-w-md bg-gradient-to-r from-[#978063]/70 via-[#978063]/25 to-transparent" />
                    
                    <div className="flex items-center gap-3">
                        <img
                            className="h-10" 
                            src="/images/icons/click.webp" alt="Click icon" />

                        <p
                            className="text-[11px] uppercase tracking-[0.32em]"
                            style={{
                                color: "#978063",
                                textShadow: "0 0 8px rgba(151, 128, 99, 0.12)"
                            }}
                        >
                            Click cards 
                            <br />
                            to learn more.
                        </p>
                    </div>
                </div>
                
                <div className="pointer-events-auto flex flex-1 items-center justify-center md:justify-end">
                    <Stack
                        cardDimensions={{ width: 400, height: 300 }}
                        sendToBackOnClick
                    />
                </div>
           </div>
        </motion.section>
    )
}

export default ExperienceOverlay

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const slideImages = [
    "/images/project-thumbnails/KnightThumbnail.png",
    "/images/project-thumbnails/Bubble.png",
    "/images/project-thumbnails/agent.png"
]

const Ppt = () => {
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0)
    const isFirstPage = currentIndex === 0
    const isLastPage = currentIndex === slideImages.length - 1

    const goToPreviousPage = () => {
        if (isFirstPage) {
            return
        }

        setCurrentIndex((prevIndex) => prevIndex - 1)
    }

    const goToNextPage = () => {
        if (isLastPage) {
            return
        }

        setCurrentIndex((prevIndex) => prevIndex + 1)
    }

    return (
        <main className="min-h-screen bg-black px-6 py-10 md:px-12 md:py-14">
            <button
                type="button"
                onClick={() => navigate("/projects")}
                className="absolute left-6 top-6 rounded border border-neutral-700 bg-black/70 px-4 py-2 text-sm text-white transition hover:bg-neutral-900 md:left-10 md:top-10"
            >
                Back
            </button>

            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center gap-6">
                <div className="w-full overflow-hidden rounded-xl bg-neutral-950 p-4 shadow-[0_0_40px_rgba(0,0,0,0.45)] md:p-8">
                    <img
                        src={slideImages[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        className="mx-auto max-h-[75vh] w-auto max-w-full object-contain"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={goToPreviousPage}
                        disabled={isFirstPage}
                        className="rounded border border-neutral-700 px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Last Page
                    </button>

                    <span className="text-sm text-neutral-300">
                        {currentIndex + 1} / {slideImages.length}
                    </span>

                    <button
                        type="button"
                        onClick={goToNextPage}
                        disabled={isLastPage}
                        className="rounded border border-neutral-700 px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Ppt

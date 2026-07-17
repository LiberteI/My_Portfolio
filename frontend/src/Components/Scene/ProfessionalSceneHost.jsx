import ArtGalleryScene from "./ArtGalleryScene"

const ProfessionalSceneHost = ({ isActive, routeValue, featuredProject, onResumeClick }) => {
    return (
        <div
            className={[
                "fixed inset-0 z-0 transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
            ].join(" ")}
            aria-hidden={!isActive}
        >
            <ArtGalleryScene
                className="h-full w-full"
                routeValue={routeValue}
                screenTextureUrl={featuredProject?.projectionImage}
                onResumeClick={onResumeClick}
            />
        </div>
    )
}

export default ProfessionalSceneHost

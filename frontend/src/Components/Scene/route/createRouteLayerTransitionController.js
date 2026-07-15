export const createRouteLayerTransitionController = ({
    cameraView,
    clearDecorativeLoadTimeout,
    clearRouteHideTimeouts,
    resetRouteReadiness,
    activateExperienceRouteLayer,
    activateProjectRouteLayer,
    setLayerVisibility,
    experienceCoreLayerRef,
    experienceDecorativeLayerRef,
    projectCoreLayerRef,
    scheduleExperienceRouteHide,
    scheduleProjectRouteHide
}) => {
    const activate = ({ routeValue, previousRouteValue }) => {
        clearDecorativeLoadTimeout()
        clearRouteHideTimeouts()
        resetRouteReadiness()

        const isRouteTransition = previousRouteValue && previousRouteValue !== routeValue

        if (routeValue === cameraView.experience) {
            activateExperienceRouteLayer()

            if (!isRouteTransition) {
                setLayerVisibility(projectCoreLayerRef, false)
            } else if (previousRouteValue === cameraView.projects) {
                scheduleProjectRouteHide()
            }

            return
        }

        if (routeValue === cameraView.projects) {
            activateProjectRouteLayer()

            if (!isRouteTransition) {
                setLayerVisibility(experienceCoreLayerRef, false)
                setLayerVisibility(experienceDecorativeLayerRef, false)
            } else if (previousRouteValue === cameraView.experience) {
                scheduleExperienceRouteHide()
            }
        }
    }

    const dispose = () => {
        clearDecorativeLoadTimeout()
        clearRouteHideTimeouts()
    }

    return {
        activate,
        dispose
    }
}

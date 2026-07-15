export const createRouteLayerTransitionController = ({
    cameraView,
    clearDecorativeLoadTimeout,
    clearRouteHideTimeouts,
    resetRouteReadiness,
    activateExperienceRouteLayer,
    activateProjectRouteLayer,
    deactivateLayer,
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
                deactivateLayer(projectCoreLayerRef)
            } else if (previousRouteValue === cameraView.projects) {
                scheduleProjectRouteHide()
            }

            return
        }

        if (routeValue === cameraView.projects) {
            activateProjectRouteLayer()

            if (!isRouteTransition) {
                deactivateLayer(experienceCoreLayerRef)
                deactivateLayer(experienceDecorativeLayerRef)
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

import * as THREE from "three"

export const createPointerInteractionController = ({
    container,
    renderer,
    camera,
    getProjectionScreen,
    getOnScreenClick,
    getResume,
    getOnResumeClick
}) => {
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const updatePointer = (event) => {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
    }

    const handleCanvasClick = (event) => {
        const projectionScreen = getProjectionScreen()
        const onScreenClick = getOnScreenClick()
        const resume = getResume?.()
        const onResumeClick = getOnResumeClick?.()

        updatePointer(event)

        if (resume && onResumeClick) {
            const resumeIntersections = raycaster.intersectObject(resume)

            if (resumeIntersections.length > 0) {
                onResumeClick()
                return
            }
        }

        if (!projectionScreen || !onScreenClick) {
            return
        }

        const screenIntersections = raycaster.intersectObject(projectionScreen.mesh)

        if (screenIntersections.length > 0) {
            onScreenClick()
        }
    }

    const handlePointerMove = (event) => {
        const resume = getResume?.()
        const projectionScreen = getProjectionScreen()

        if (!resume && !projectionScreen) {
            container.style.cursor = ""
            return
        }

        updatePointer(event)
        const isHoveringResume = resume ? raycaster.intersectObject(resume).length > 0 : false
        const isHoveringProjection = projectionScreen ? raycaster.intersectObject(projectionScreen.mesh).length > 0 : false

        container.style.cursor = isHoveringResume || isHoveringProjection ? "pointer" : ""
    }

    const handlePointerLeave = () => {
        container.style.cursor = ""
    }

    container.addEventListener("click", handleCanvasClick)
    container.addEventListener("mousemove", handlePointerMove)
    container.addEventListener("mouseleave", handlePointerLeave)

    return {
        dispose() {
            container.removeEventListener("click", handleCanvasClick)
            container.removeEventListener("mousemove", handlePointerMove)
            container.removeEventListener("mouseleave", handlePointerLeave)
            container.style.cursor = ""
        }
    }
}

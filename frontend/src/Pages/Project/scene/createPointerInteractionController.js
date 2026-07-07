import * as THREE from "three"

export const createPointerInteractionController = ({
    container,
    renderer,
    camera,
    projectionScreen,
    onScreenClick
}) => {
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const handleCanvasClick = (event) => {
        if (!projectionScreen || !onScreenClick) {
            return
        }

        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.setFromCamera(pointer, camera)

        const intersections = raycaster.intersectObject(projectionScreen.mesh)

        if (intersections.length > 0) {
            onScreenClick()
        }
    }

    container.addEventListener("click", handleCanvasClick)

    return {
        dispose() {
            container.removeEventListener("click", handleCanvasClick)
        }
    }
}

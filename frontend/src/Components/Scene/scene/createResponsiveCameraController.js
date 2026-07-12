import { getResponsiveCameraState } from "./cameraConfig"

export const createResponsiveCameraController = ({ camera, renderer, container, getView }) => {
    const resize = () => {
        const { clientWidth, clientHeight } = container

        if (!clientWidth || !clientHeight) {
            return
        }

        const responsiveCameraState = getResponsiveCameraState(getView?.(), {
            width: clientWidth,
            height: clientHeight
        })

        camera.fov = responsiveCameraState.fov
        camera.position.copy(responsiveCameraState.position)
        camera.lookAt(responsiveCameraState.lookAt)
        camera.aspect = responsiveCameraState.aspect
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight)
    }

    window.addEventListener("resize", resize)

    return {
        resize,
        dispose() {
            window.removeEventListener("resize", resize)
        }
    }
}

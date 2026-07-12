import * as THREE from "three"
import { getCameraConfig } from "./cameraConfig"

export const createCamera = (view) => {
    const cameraConfig = getCameraConfig(view)
    const camera = new THREE.PerspectiveCamera(
        cameraConfig.fov,
        cameraConfig.aspect,
        cameraConfig.near,
        cameraConfig.far
    )
    camera.rotation.order = "YXZ"
    camera.position.copy(cameraConfig.position)
    camera.lookAt(cameraConfig.lookAt)
    camera.rotation.z = 0

    return camera
}

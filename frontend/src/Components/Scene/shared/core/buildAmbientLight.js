import * as THREE from "three"
import { lightParam } from "../../config/lightingConfig"

export const buildAmbientLight = (scene) => {
    const ambientConfig = lightParam().ambientLight

    if (!ambientConfig.enabled) {
        return null
    }

    const ambientLight = new THREE.AmbientLight(ambientConfig.color, ambientConfig.intensity)
    scene.add(ambientLight)

    return {
        light: ambientLight,
        dispose() {
            scene.remove(ambientLight)
        }
    }
}

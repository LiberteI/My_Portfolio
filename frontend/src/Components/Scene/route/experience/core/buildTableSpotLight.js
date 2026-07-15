import * as THREE from "three"
import { lightParam } from "../../../config/lightingConfig"
import { getDisplayPositions } from "../../../config/sceneConfig"

export const buildTableSpotLight = (scene) => {
    const lighting = lightParam()
    const tableSpotLightConfig = lighting.tableSpotLight
    const { tablePosition } = getDisplayPositions()

    if (!tableSpotLightConfig.enabled) {
        return null
    }

    const target = new THREE.Object3D()
    target.position.set(
        tablePosition.x,
        tablePosition.y + tableSpotLightConfig.targetYOffset,
        tablePosition.z
    )
    scene.add(target)

    const spotLight = new THREE.SpotLight(
        tableSpotLightConfig.color,
        tableSpotLightConfig.intensity,
        tableSpotLightConfig.distance,
        tableSpotLightConfig.angle,
        tableSpotLightConfig.penumbra,
        tableSpotLightConfig.decay
    )
    spotLight.position.set(
        tablePosition.x,
        tablePosition.y + tableSpotLightConfig.positionYOffset,
        tablePosition.z
    )
    spotLight.target = target
    spotLight.castShadow = false
    scene.add(spotLight)

    return {
        light: spotLight,
        target,
        dispose() {
            scene.remove(spotLight)
            scene.remove(target)
        }
    }
}

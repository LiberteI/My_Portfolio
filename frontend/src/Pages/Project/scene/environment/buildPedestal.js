import * as THREE from "three"
import museumWallTextureUrl from "../../../../assets/Museum/wall-texture.jpg"
import wallAoMapUrl from "../../../../assets/Museum/prebaked-tex/wall-ao.png"
import wallNormalMapUrl from "../../../../assets/Museum/prebaked-tex/wall-normal.png"
import wallRoughnessMapUrl from "../../../../assets/Museum/prebaked-tex/wall-roughness.png"
import { getDisplayPositions } from "../sceneConfig"
import {
    applyMaterialResponse,
    cloneUvAttribute,
    configureRepeatingTexture
} from "./materialResponse"

export const buildPedestal = (scene) => {
    const boxWidth = 1
    const boxHeight = 2
    const boxDepth = 1
    const { boxPosition } = getDisplayPositions()
    const textureLoader = new THREE.TextureLoader()
    const boxWallTexture = textureLoader.load(museumWallTextureUrl)
    const boxMaps = {
        roughnessMap: textureLoader.load(wallRoughnessMapUrl),
        aoMap: textureLoader.load(wallAoMapUrl),
        normalMap: textureLoader.load(wallNormalMapUrl)
    }

    configureRepeatingTexture(boxWallTexture, 1, 1, THREE.SRGBColorSpace)
    configureRepeatingTexture(boxMaps.roughnessMap, 1, 1)
    configureRepeatingTexture(boxMaps.aoMap, 1, 1)
    configureRepeatingTexture(boxMaps.normalMap, 1, 1)

    const boxMaterial = new THREE.MeshStandardMaterial({
        map: boxWallTexture,
        roughness: 0.86,
        metalness: 0.04
    })
    applyMaterialResponse(boxMaterial, boxMaps, {
        roughness: 0.86,
        metalness: 0.04,
        normalScale: 0.95,
        aoMapIntensity: 0.95
    })
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    cloneUvAttribute(boxGeometry)
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)

    mesh.position.set(boxPosition.x, boxPosition.y, boxPosition.z)
    scene.add(mesh)

    return {
        mesh,
        dispose() {
            scene.remove(mesh)
            mesh.geometry.dispose()
            boxMaterial.dispose()
            boxWallTexture.dispose()
            boxMaps.roughnessMap.dispose()
            boxMaps.aoMap.dispose()
            boxMaps.normalMap.dispose()
        }
    }
}

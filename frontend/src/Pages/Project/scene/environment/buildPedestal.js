import * as THREE from "three"
import museumWallTextureUrl from "../../../../assets/Museum/wall-texture.jpg"
import { getDisplayPositions } from "../sceneConfig"
import {
    applyMaterialResponse,
    cloneUvAttribute,
    configureRepeatingTexture,
    createMaterialResponseMaps
} from "./materialResponse"

export const buildPedestal = (scene) => {
    const boxWidth = 1
    const boxHeight = 2
    const boxDepth = 1
    const { boxPosition } = getDisplayPositions()
    const textureLoader = new THREE.TextureLoader()
    const materialResponseTextures = []
    let boxMaterial
    const boxWallTexture = textureLoader.load(museumWallTextureUrl, (loadedTexture) => {
        const boxMaps = createMaterialResponseMaps(loadedTexture, {
            normalStrength: 2.1,
            roughnessMin: 0.58,
            roughnessMax: 0.96,
            aoStrength: 0.7
        })

        if (!boxMaps) {
            return
        }

        materialResponseTextures.push(boxMaps.roughnessMap, boxMaps.aoMap, boxMaps.normalMap)

        applyMaterialResponse(boxMaterial, boxMaps, {
            roughness: 0.86,
            metalness: 0.04,
            normalScale: 0.95,
            aoMapIntensity: 0.95
        })
    })

    configureRepeatingTexture(boxWallTexture, 1, 1, THREE.SRGBColorSpace)

    boxMaterial = new THREE.MeshStandardMaterial({
        map: boxWallTexture,
        roughness: 0.86,
        metalness: 0.04
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
            materialResponseTextures.forEach((texture) => texture.dispose())
        }
    }
}

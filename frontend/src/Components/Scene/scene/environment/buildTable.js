import * as THREE from "three"
import tableTextureUrl from "../../../../assets/Museum/table-texture.jpg"
import wallAoMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/wall-ao.webp"
import wallNormalMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/wall-normal.webp"
import wallRoughnessMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/wall-roughness.webp"
import { getDisplayPositions } from "../sceneConfig"
import {
    applyMaterialResponse,
    cloneUvAttribute,
    configureRepeatingTexture
} from "./materialResponse"

export const buildTable = (scene) => {
    const { tablePosition } = getDisplayPositions()
    const textureLoader = new THREE.TextureLoader()
    const tableTexture = textureLoader.load(tableTextureUrl)
    const wallMaps = {
        roughnessMap: textureLoader.load(wallRoughnessMapUrl),
        aoMap: textureLoader.load(wallAoMapUrl),
        normalMap: textureLoader.load(wallNormalMapUrl)
    }

    configureRepeatingTexture(tableTexture, 1, 1, THREE.SRGBColorSpace)
    configureRepeatingTexture(wallMaps.roughnessMap, 1, 1)
    configureRepeatingTexture(wallMaps.aoMap, 1, 1)
    configureRepeatingTexture(wallMaps.normalMap, 1, 1)

    const material = new THREE.MeshStandardMaterial({
        map: tableTexture,
        roughness: 0.86,
        metalness: 0.04
    })
    applyMaterialResponse(material, wallMaps, {
        roughness: 0.86,
        metalness: 0.04,
        normalScale: 0.95,
        aoMapIntensity: 0.95
    })

    const group = new THREE.Group()

    const createPart = (width, height, depth, x, y, z) => {
        const geometry = new THREE.BoxGeometry(width, height, depth)
        cloneUvAttribute(geometry)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z)
        group.add(mesh)
        return mesh
    }

    const topThickness = 0.18
    const tableWidth = 3.6
    const tableDepth = 7.2
    const tableHeight = 1.7
    const legWidth = 0.16
    const legInsetX = tableWidth * 0.5 - legWidth
    const legInsetZ = tableDepth * 0.5 - legWidth

    const top = createPart(tableWidth, topThickness, tableDepth, 0, tableHeight, 0)
    const legHeight = tableHeight
    const legs = [
        createPart(legWidth, legHeight, legWidth, -legInsetX, legHeight * 0.5, -legInsetZ),
        createPart(legWidth, legHeight, legWidth, legInsetX, legHeight * 0.5, -legInsetZ),
        createPart(legWidth, legHeight, legWidth, -legInsetX, legHeight * 0.5, legInsetZ),
        createPart(legWidth, legHeight, legWidth, legInsetX, legHeight * 0.5, legInsetZ)
    ]

    group.position.set(tablePosition.x, tablePosition.y, tablePosition.z)
    scene.add(group)

    return {
        group,
        mesh: group,
        dispose() {
            scene.remove(group)
            top.geometry.dispose()
            legs.forEach((leg) => leg.geometry.dispose())
            material.dispose()
            tableTexture.dispose()
            wallMaps.roughnessMap.dispose()
            wallMaps.aoMap.dispose()
            wallMaps.normalMap.dispose()
        }
    }
}

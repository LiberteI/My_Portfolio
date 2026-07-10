import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import leatherTextureUrl from "../../../../assets/Museum/leather.png"
import { getDisplayPositions, getTableConfig } from "../sceneConfig"
import {
    applyMaterialResponse,
    cloneUvAttribute,
    configureRepeatingTexture,
    createMaterialResponseMaps
} from "./materialResponse"

const createContactShadowTexture = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext("2d")

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.shadowColor = "rgba(0, 0, 0, 0.34)"
    context.shadowBlur = 48
    context.shadowOffsetX = 0
    context.shadowOffsetY = 10
    context.fillStyle = "rgba(0, 0, 0, 0.22)"

    const x = 96
    const y = 144
    const width = canvas.width - x * 2
    const height = canvas.height - y * 2
    const radius = 72

    context.beginPath()
    context.moveTo(x + radius, y)
    context.lineTo(x + width - radius, y)
    context.quadraticCurveTo(x + width, y, x + width, y + radius)
    context.lineTo(x + width, y + height - radius)
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    context.lineTo(x + radius, y + height)
    context.quadraticCurveTo(x, y + height, x, y + height - radius)
    context.lineTo(x, y + radius)
    context.quadraticCurveTo(x, y, x + radius, y)
    context.closePath()
    context.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
}

export const buildLeatherDeskPad = (
    scene,
    {
        width = 2,
        depth = 2,
        thickness = 0.05,
        cornerRadius = 0.08,
        xOffset = 0.2,
        color = "#17100c",
        roughness = 0.92,
        metalness = 0.02
    } = {}
) => {
    const { tablePosition } = getDisplayPositions()
    const tableConfig = getTableConfig()
    const textureLoader = new THREE.TextureLoader()
    const leatherTexture = textureLoader.load(leatherTextureUrl)
    const leatherMaps = {
        roughnessMap: null,
        aoMap: null,
        normalMap: null
    }

    configureRepeatingTexture(leatherTexture, 3.2, 5.6, THREE.SRGBColorSpace)

    const padGeometry = new RoundedBoxGeometry(width, thickness, depth, 6, cornerRadius)
    cloneUvAttribute(padGeometry)
    const padMaterial = new THREE.MeshPhysicalMaterial({
        color,
        map: leatherTexture,
        roughness,
        metalness,
        clearcoat: 0.08,
        clearcoatRoughness: 0.88
    })

    const updateMaterialResponse = () => {
        const generatedMaps = createMaterialResponseMaps(leatherTexture, {
            normalStrength: 0.7,
            roughnessMin: 0.74,
            roughnessMax: 0.97,
            aoStrength: 0.18
        })

        if (!generatedMaps) {
            return
        }

        leatherMaps.roughnessMap = generatedMaps.roughnessMap
        leatherMaps.aoMap = generatedMaps.aoMap
        leatherMaps.normalMap = generatedMaps.normalMap
        configureRepeatingTexture(leatherMaps.roughnessMap, 3.2, 5.6)
        configureRepeatingTexture(leatherMaps.aoMap, 3.2, 5.6)
        configureRepeatingTexture(leatherMaps.normalMap, 3.2, 5.6)
        applyMaterialResponse(padMaterial, leatherMaps, {
            roughness,
            metalness,
            normalScale: 0.12,
            aoMapIntensity: 0.2,
            clearcoat: 0.08,
            clearcoatRoughness: 0.88
        })
    }

    if (leatherTexture.image) {
        updateMaterialResponse()
    } else {
        leatherTexture.onUpdate = updateMaterialResponse
    }

    const padMesh = new THREE.Mesh(padGeometry, padMaterial)
    const tableTopSurfaceY = tablePosition.y + tableConfig.height + tableConfig.topThickness * 0.5
    padMesh.position.set(
        tablePosition.x + xOffset,
        tableTopSurfaceY + thickness * 0.5 + 0.002,
        tablePosition.z
    )
    scene.add(padMesh)

    const contactShadowTexture = createContactShadowTexture()
    const contactShadowGeometry = new THREE.PlaneGeometry(width * 1.04, depth * 1.04)
    const contactShadowMaterial = new THREE.MeshBasicMaterial({
        map: contactShadowTexture,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        side: THREE.DoubleSide
    })
    const contactShadowMesh = new THREE.Mesh(contactShadowGeometry, contactShadowMaterial)
    contactShadowMesh.rotation.x = -Math.PI * 0.5
    contactShadowMesh.rotation.x = -Math.PI * 0.5
    contactShadowMesh.position.set(
        tablePosition.x + xOffset,
        tableTopSurfaceY + 0.003,
        tablePosition.z
    )
    scene.add(contactShadowMesh)

    return {
        mesh: padMesh,
        shadow: contactShadowMesh,
        dispose() {
            scene.remove(padMesh)
            scene.remove(contactShadowMesh)
            padGeometry.dispose()
            padMaterial.dispose()
            contactShadowGeometry.dispose()
            contactShadowMaterial.dispose()
            contactShadowTexture.dispose()
            leatherTexture.dispose()
            leatherMaps.roughnessMap?.dispose()
            leatherMaps.aoMap?.dispose()
            leatherMaps.normalMap?.dispose()
        }
    }
}

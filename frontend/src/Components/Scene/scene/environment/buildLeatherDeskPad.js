import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import leatherColorTextureUrl from "../../../../assets/Museum/Leather026_1K-JPG_Color.jpg"
import leatherRoughnessTextureUrl from "../../../../assets/Museum/Leather026_1K-JPG_Roughness.jpg"
import leatherNormalTextureUrl from "../../../../assets/Museum/Leather026_1K-JPG_NormalGL.jpg"
import { getDisplayPositions, getTableConfig } from "../sceneConfig"
import { cloneUvAttribute, configureRepeatingTexture } from "./materialResponse"

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
        xOffset = -0.6,
        color = "#2b1f1a",
        roughness = 0.82,
        metalness = 0.01
    } = {}
) => {
    const { tablePosition } = getDisplayPositions()
    const tableConfig = getTableConfig()
    const textureLoader = new THREE.TextureLoader()
    const leatherColorTexture = textureLoader.load(leatherColorTextureUrl)
    const leatherRoughnessTexture = textureLoader.load(leatherRoughnessTextureUrl)
    const leatherNormalTexture = textureLoader.load(leatherNormalTextureUrl)

    configureRepeatingTexture(leatherColorTexture, 3.2, 5.6, THREE.SRGBColorSpace)
    configureRepeatingTexture(leatherRoughnessTexture, 3.2, 5.6)
    configureRepeatingTexture(leatherNormalTexture, 3.2, 5.6)

    const padGeometry = new RoundedBoxGeometry(width, thickness, depth, 6, cornerRadius)
    cloneUvAttribute(padGeometry)
    const padMaterial = new THREE.MeshPhysicalMaterial({
        color,
        map: leatherColorTexture,
        roughnessMap: leatherRoughnessTexture,
        normalMap: leatherNormalTexture,
        roughness,
        metalness,
        clearcoat: 0.14,
        clearcoatRoughness: 0.9,
        emissive: "#120c09",
        emissiveIntensity: 0.08,
        normalScale: new THREE.Vector2(0.2, 0.2)
    })

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
            leatherColorTexture.dispose()
            leatherRoughnessTexture.dispose()
            leatherNormalTexture.dispose()
        }
    }
}

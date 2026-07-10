import * as THREE from "three"
import { clamp01 } from "../utils/math"
import { configureRepeatingTexture, createCanvasTexture } from "../utils/texture"

export const cloneUvAttribute = (geometry) => {
    const uvAttribute = geometry.getAttribute("uv")

    if (!uvAttribute) {
        return
    }

    const uvClone = uvAttribute.array.slice()
    geometry.setAttribute("uv1", new THREE.BufferAttribute(uvClone, 2))
    geometry.setAttribute("uv2", new THREE.BufferAttribute(uvClone.slice(), 2))
}

export { configureRepeatingTexture }

export const createMaterialResponseMaps = (
    sourceTexture,
    {
        normalStrength = 1,
        roughnessMin = 0.45,
        roughnessMax = 0.95,
        aoStrength = 0.45
    } = {}
) => {
    const sourceImage = sourceTexture.image

    if (!sourceImage) {
        return null
    }

    const sourceWidth = sourceImage.naturalWidth || sourceImage.videoWidth || sourceImage.width
    const sourceHeight = sourceImage.naturalHeight || sourceImage.videoHeight || sourceImage.height

    if (!sourceWidth || !sourceHeight) {
        return null
    }

    const targetMaxSize = 512
    const scale = Math.min(1, targetMaxSize / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(2, Math.round(sourceWidth * scale))
    const height = Math.max(2, Math.round(sourceHeight * scale))
    const sourceCanvas = document.createElement("canvas")
    sourceCanvas.width = width
    sourceCanvas.height = height
    const sourceContext = sourceCanvas.getContext("2d")
    sourceContext.drawImage(sourceImage, 0, 0, width, height)

    const { data: sourceData } = sourceContext.getImageData(0, 0, width, height)
    const luminance = new Float32Array(width * height)

    for (let index = 0; index < luminance.length; index += 1) {
        const colorIndex = index * 4
        const red = sourceData[colorIndex] / 255
        const green = sourceData[colorIndex + 1] / 255
        const blue = sourceData[colorIndex + 2] / 255
        luminance[index] = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    }

    const roughnessCanvas = document.createElement("canvas")
    roughnessCanvas.width = width
    roughnessCanvas.height = height
    const roughnessContext = roughnessCanvas.getContext("2d")
    const roughnessImage = roughnessContext.createImageData(width, height)

    const aoCanvas = document.createElement("canvas")
    aoCanvas.width = width
    aoCanvas.height = height
    const aoContext = aoCanvas.getContext("2d")
    const aoImage = aoContext.createImageData(width, height)

    const normalCanvas = document.createElement("canvas")
    normalCanvas.width = width
    normalCanvas.height = height
    const normalContext = normalCanvas.getContext("2d")
    const normalImage = normalContext.createImageData(width, height)

    const getLuminance = (x, y) => {
        const clampedX = THREE.MathUtils.clamp(x, 0, width - 1)
        const clampedY = THREE.MathUtils.clamp(y, 0, height - 1)
        return luminance[clampedY * width + clampedX]
    }

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const current = getLuminance(x, y)
            const left = getLuminance(x - 1, y)
            const right = getLuminance(x + 1, y)
            const up = getLuminance(x, y - 1)
            const down = getLuminance(x, y + 1)
            const neighborhoodAverage = (left + right + up + down) * 0.25
            const localContrast = Math.abs(current - neighborhoodAverage)
            const roughnessValue = clamp01(
                roughnessMin
                + (1 - current) * (roughnessMax - roughnessMin) * 0.65
                + localContrast * 0.9
            )
            const cavity = clamp01(
                (neighborhoodAverage - current) * aoStrength * 1.6
                + (1 - current) * aoStrength * 0.3
            )
            const aoValue = 1 - cavity
            const dx = (right - left) * normalStrength
            const dy = (down - up) * normalStrength
            const normal = new THREE.Vector3(-dx, -dy, 1).normalize()
            const pixelIndex = (y * width + x) * 4
            const roughnessChannel = Math.round(roughnessValue * 255)
            const aoChannel = Math.round(aoValue * 255)

            roughnessImage.data[pixelIndex] = roughnessChannel
            roughnessImage.data[pixelIndex + 1] = roughnessChannel
            roughnessImage.data[pixelIndex + 2] = roughnessChannel
            roughnessImage.data[pixelIndex + 3] = 255

            aoImage.data[pixelIndex] = aoChannel
            aoImage.data[pixelIndex + 1] = aoChannel
            aoImage.data[pixelIndex + 2] = aoChannel
            aoImage.data[pixelIndex + 3] = 255

            normalImage.data[pixelIndex] = Math.round((normal.x * 0.5 + 0.5) * 255)
            normalImage.data[pixelIndex + 1] = Math.round((normal.y * 0.5 + 0.5) * 255)
            normalImage.data[pixelIndex + 2] = Math.round((normal.z * 0.5 + 0.5) * 255)
            normalImage.data[pixelIndex + 3] = 255
        }
    }

    roughnessContext.putImageData(roughnessImage, 0, 0)
    aoContext.putImageData(aoImage, 0, 0)
    normalContext.putImageData(normalImage, 0, 0)

    return {
        roughnessMap: createCanvasTexture(roughnessCanvas, sourceTexture),
        aoMap: createCanvasTexture(aoCanvas, sourceTexture),
        normalMap: createCanvasTexture(normalCanvas, sourceTexture)
    }
}

export const applyMaterialResponse = (
    material,
    maps,
    {
        roughness,
        metalness,
        normalScale = 1,
        aoMapIntensity = 1,
        clearcoat,
        clearcoatRoughness
    }
) => {
    if (!maps) {
        return
    }

    material.roughnessMap = maps.roughnessMap
    material.normalMap = maps.normalMap
    material.aoMap = maps.aoMap
    material.roughness = roughness
    material.metalness = metalness
    material.aoMapIntensity = aoMapIntensity
    material.normalScale = new THREE.Vector2(normalScale, normalScale)

    if ("clearcoat" in material && typeof clearcoat === "number") {
        material.clearcoat = clearcoat
    }

    if ("clearcoatRoughness" in material && typeof clearcoatRoughness === "number") {
        material.clearcoatRoughness = clearcoatRoughness
    }

    material.needsUpdate = true
}

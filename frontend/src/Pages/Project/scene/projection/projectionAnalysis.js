import * as THREE from "three"

export const getAdaptiveProjectionLightingConfig = () => {
    return {
        brightPixelThreshold: 0.25,
        projectorIntensityMultiplier: 1.15,
        bounceIntensityMultiplier: 0.55,
        colorSaturation: 0.72,
        transitionSpeed: 0.08,
        minimumIntensity: 0.2,
        maximumIntensity: 1.35,
        bounceWarmBlend: "#f4ddc0"
    }
}

export const analyzeProjectionTexture = (texture, config) => {
    const sourceImage = texture?.image

    if (!sourceImage) {
        return null
    }

    const sourceWidth = sourceImage.naturalWidth || sourceImage.videoWidth || sourceImage.width
    const sourceHeight = sourceImage.naturalHeight || sourceImage.videoHeight || sourceImage.height

    if (!sourceWidth || !sourceHeight) {
        return null
    }

    const targetMaxSize = 256
    const scale = Math.min(1, targetMaxSize / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(2, Math.round(sourceWidth * scale))
    const height = Math.max(2, Math.round(sourceHeight * scale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    context.drawImage(sourceImage, 0, 0, width, height)

    const { data } = context.getImageData(0, 0, width, height)
    let colorWeightTotal = 0
    let brightPixelCount = 0
    let weightedRed = 0
    let weightedGreen = 0
    let weightedBlue = 0
    let brightnessTotal = 0

    for (let index = 0; index < data.length; index += 4) {
        const red = data[index] / 255
        const green = data[index + 1] / 255
        const blue = data[index + 2] / 255
        const luminance = 0.299 * red + 0.587 * green + 0.114 * blue

        if (luminance < config.brightPixelThreshold) {
            continue
        }

        brightPixelCount += 1
        colorWeightTotal += luminance
        brightnessTotal += luminance
        weightedRed += red * luminance
        weightedGreen += green * luminance
        weightedBlue += blue * luminance
    }

    if (colorWeightTotal <= 0 || brightPixelCount <= 0) {
        return {
            averageColor: new THREE.Color("#ffffff"),
            brightness: config.minimumIntensity
        }
    }

    const averageColor = new THREE.Color(
        weightedRed / colorWeightTotal,
        weightedGreen / colorWeightTotal,
        weightedBlue / colorWeightTotal
    )
    const averageBrightness = brightnessTotal / brightPixelCount

    return {
        averageColor,
        brightness: THREE.MathUtils.clamp(
            averageBrightness,
            config.minimumIntensity,
            config.maximumIntensity
        )
    }
}

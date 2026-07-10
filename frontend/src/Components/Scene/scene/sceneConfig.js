export const DEFAULT_PROJECTOR_LIGHT_COLOR = "#e4d5c4"

export const getProjectionFrameConfig = () => {
    return {
        xStart: -16,
        xEnd: 2,
        yStart: -6,
        yEnd: 5
    }
}

export const getDisplayPositions = () => {
    const position = { x: -10, y: -6.5, z: 10 }
    const tablePosition = { x: -19, y: -7.5, z: 14.28 }

    return {
        position,
        boxPosition: { x: position.x, y: position.y, z: position.z },
        tablePosition,
        projectorPosition: { x: position.x, y: position.y + 1.2, z: position.z },
        projectorBeamOrigin: { x: position.x - 0.2, y: position.y + 1.2, z: position.z - 0.5 }
    }
}

export const getProjectionRenderConfig = () => {
    return {
        projectionStrength: 100,
        exposure: 0.5,
        blackPoint: 0.005,
        whitePoint: 0.88,
        edgeSoftness: 0.08,
        opacityMultiplier: 1,
        shadowBoost: 1000,
        highlightBoost: 0.18
    }
}

export const getValidScreenTextureUrl = (screenTextureUrl) => {
    if (typeof screenTextureUrl !== "string") {
        return null
    }

    const normalizedTextureUrl = screenTextureUrl.trim()

    return normalizedTextureUrl ? normalizedTextureUrl : null
}

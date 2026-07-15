import * as THREE from "three"
import createProjectionMaterial from "../../../shaders/projection/createProjectionMaterial"
import { getProjectionFrameConfig, getProjectionRenderConfig } from "../../../config/sceneConfig"
import { analyzeProjectionTexture, getAdaptiveProjectionLightingConfig } from "./projectionAnalysis"

export const buildProjectionScreen = (scene, screenTextureUrl, options = {}) => {
    const roomZStart = -7
    const projectionFrame = getProjectionFrameConfig()
    const screenWidth = projectionFrame.xEnd - projectionFrame.xStart
    const screenHeight = projectionFrame.yEnd - projectionFrame.yStart
    const screenCenterX = (projectionFrame.xStart + projectionFrame.xEnd) / 2
    const screenCenterY = (projectionFrame.yStart + projectionFrame.yEnd) / 2
    const textureLoader = new THREE.TextureLoader()
    const screenTexture = textureLoader.load(screenTextureUrl)
    const projectionRenderConfig = getProjectionRenderConfig()

    screenTexture.onUpdate = () => {
        const analysis = analyzeProjectionTexture(screenTexture, getAdaptiveProjectionLightingConfig())

        if (analysis && options.onTextureAnalyzed) {
            options.onTextureAnalyzed(analysis)
        }
    }

    screenTexture.colorSpace = THREE.SRGBColorSpace

    const screenMaterial = createProjectionMaterial({
        projectionTexture: screenTexture,
        ...projectionRenderConfig
    })
    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(screenWidth, screenHeight),
        screenMaterial
    )

    screen.position.set(screenCenterX, screenCenterY, roomZStart + 0.04)
    scene.add(screen)

    return {
        mesh: screen,
        material: screenMaterial,
        texture: screenTexture,
        dispose() {
            scene.remove(screen)
            screen.geometry.dispose()
            screenMaterial.dispose()
            screenTexture.dispose()
        }
    }
}

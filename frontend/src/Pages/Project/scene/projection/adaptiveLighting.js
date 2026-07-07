import * as THREE from "three"
import { lightParam } from "../lightingConfig"
import { getAdaptiveProjectionLightingConfig } from "./projectionAnalysis"

export const buildAdaptiveLightingState = (analysis, featuredProjectLightColor) => {
    const config = getAdaptiveProjectionLightingConfig()
    const baseColor = new THREE.Color(featuredProjectLightColor)
    const beamColor = baseColor.clone().lerp(analysis.averageColor, config.colorSaturation)
    const bounceColor = new THREE.Color(config.bounceWarmBlend).lerp(beamColor, 0.45)

    return {
        beamColor,
        beamIntensityScale: THREE.MathUtils.clamp(
            analysis.brightness * config.projectorIntensityMultiplier,
            config.minimumIntensity,
            config.maximumIntensity
        ),
        bounceColor,
        bounceIntensityScale: THREE.MathUtils.clamp(
            analysis.brightness * config.bounceIntensityMultiplier,
            config.minimumIntensity,
            config.maximumIntensity
        )
    }
}

export const initializeAdaptiveProjectorLighting = (projectorRig, featuredProjectLightColor) => {
    const baseColor = new THREE.Color(featuredProjectLightColor)
    projectorRig.adaptiveLightingState = {
        current: {
            beamColor: baseColor.clone(),
            beamIntensityScale: 1,
            bounceColor: baseColor.clone(),
            bounceIntensityScale: 1
        },
        target: {
            beamColor: baseColor.clone(),
            beamIntensityScale: 1,
            bounceColor: baseColor.clone(),
            bounceIntensityScale: 1
        }
    }
}

export const applyAdaptiveLightingTargets = (projectorRig, analysis, featuredProjectLightColor) => {
    if (!projectorRig?.adaptiveLightingState || !analysis) {
        return
    }

    projectorRig.adaptiveLightingState.target = buildAdaptiveLightingState(analysis, featuredProjectLightColor)
}

export const updateAdaptiveProjectorLighting = (projectorRig) => {
    if (!projectorRig?.adaptiveLightingState) {
        return
    }

    const config = getAdaptiveProjectionLightingConfig()
    const lighting = lightParam()
    const { current, target } = projectorRig.adaptiveLightingState

    current.beamColor.lerp(target.beamColor, config.transitionSpeed)
    current.bounceColor.lerp(target.bounceColor, config.transitionSpeed)
    current.beamIntensityScale = THREE.MathUtils.lerp(current.beamIntensityScale, target.beamIntensityScale, config.transitionSpeed)
    current.bounceIntensityScale = THREE.MathUtils.lerp(current.bounceIntensityScale, target.bounceIntensityScale, config.transitionSpeed)

    if (projectorRig.projectorSpotLightToWall) {
        projectorRig.projectorSpotLightToWall.color.copy(current.beamColor)
        projectorRig.projectorSpotLightToWall.intensity = lighting.projectorSpotLightToWall.intensity * current.beamIntensityScale
    }

    if (projectorRig.projectorOriginPointLight) {
        projectorRig.projectorOriginPointLight.color.copy(current.beamColor)
        projectorRig.projectorOriginPointLight.intensity = lighting.projectorOriginPointLight.intensity * current.beamIntensityScale
    }

    if (projectorRig.beamPyramidMaterial) {
        projectorRig.beamPyramidMaterial.color.copy(current.beamColor)
        projectorRig.beamPyramidMaterial.opacity = lighting.beamPyramid.opacity * current.beamIntensityScale
    }

    if (projectorRig.beamPyramidFillMaterial?.uniforms) {
        projectorRig.beamPyramidFillMaterial.uniforms.beamColor.value.copy(current.beamColor)
        projectorRig.beamPyramidFillMaterial.uniforms.beamOpacity.value = lighting.beamPyramidFill.opacity * current.beamIntensityScale
    }

    if (projectorRig.emissionLight) {
        projectorRig.emissionLight.color.copy(current.bounceColor)
        projectorRig.emissionLight.intensity = lighting.emissionLight.intensity * current.bounceIntensityScale
    }

    if (projectorRig.projectorBackRectAreaLight) {
        projectorRig.projectorBackRectAreaLight.color.copy(current.bounceColor)
        projectorRig.projectorBackRectAreaLight.intensity = lighting.projectorBackRectAreaLight.intensity * current.bounceIntensityScale
    }

    if (projectorRig.wallGlowMaterial) {
        projectorRig.wallGlowMaterial.color.copy(current.beamColor)
        projectorRig.wallGlowMaterial.opacity = lighting.wallGlowPlane.opacity * current.bounceIntensityScale
    }
}

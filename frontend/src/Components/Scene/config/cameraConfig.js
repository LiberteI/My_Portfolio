import * as THREE from "three"
import { clamp01 } from "../utils/math"

export const CAMERA_VIEW = {
    projects: "projects",
    experience: "experience"
}

const cameraConfigs = {
    [CAMERA_VIEW.projects]: {
        fov: 60,
        aspect: 1,
        near: 0.1,
        far: 500,
        position: new THREE.Vector3(-16.24, -4.8, 14.27),
        lookAt: new THREE.Vector3(-14.81, -4.9, 9.48)
    },
    [CAMERA_VIEW.experience]: {
        fov: 60,
        aspect: 1,
        near: 0.1,
        far: 500,
        position: new THREE.Vector3(-22.49, -4.37, 13.97),
        lookAt: new THREE.Vector3(-23.44, -4.67, 14.09)
    }
}

export const getCameraConfig = (view = CAMERA_VIEW.projects) => {
    return cameraConfigs[view] ?? cameraConfigs[CAMERA_VIEW.projects]
}

export const interpolateCameraPosition = (
    fromView = CAMERA_VIEW.projects,
    toView = CAMERA_VIEW.experience,
    progress = 0,
    viewport = {}
) => {
    const { position: fromPosition } = getResponsiveCameraState(fromView, viewport)
    const { position: toPosition } = getResponsiveCameraState(toView, viewport)
    const alpha = THREE.MathUtils.clamp(progress, 0, 1)

    return new THREE.Vector3().copy(fromPosition).lerp(toPosition, alpha)
}

const responsiveResizeConfigs = {
    [CAMERA_VIEW.projects]: {
        widthResponse: {
            threshold: 1280,
            ramp: 480,
            maxFov: 78,
            backwardOffset: 6
        },
        mediumYaw: {
            maxWidth: 1280,
            minWidth: 770,
            lookAtRightOffset: -1.4,
            positionRightOffset: 1.4
        },
        compactYaw: {
            threshold: 770,
            ramp: 220,
            lookAtRightOffset: 7,
            positionRightOffset: 8
        },
        ultraNarrow: {
            threshold: 570,
            ramp: 180,
            positionRightOffset: 1.2,
            lookAtRightOffset: 1.8
        },
        compactPitch: {
            threshold: 770,
            ramp: 220,
            lookAtYOffset: 6
        },
        compactViewport: {
            threshold: 770,
            ramp: 220,
            positionYOffset: 5.5
        }
    },
    [CAMERA_VIEW.experience]: {
        widthResponse: {
            threshold: 1280,
            ramp: 480,
            maxFov: 78,
            backwardOffset: 0
        },
        mediumYaw: {
            maxWidth: 1280,
            minWidth: 770,
            lookAtRightOffset: 0,
            positionRightOffset: 0
        },
        compactYaw: {
            threshold: 770,
            ramp: 220,
            lookAtRightOffset: 0,
            positionRightOffset: 0
        },
        ultraNarrow: {
            threshold: 570,
            ramp: 180,
            positionRightOffset: 0,
            lookAtRightOffset: 0
        },
        compactPitch: {
            threshold: 770,
            ramp: 220,
            lookAtYOffset: 0
        },
        compactViewport: {
            threshold: 770,
            ramp: 220,
            positionYOffset: 0
        }
    }
}

export const getResponsiveResizeConfig = (view = CAMERA_VIEW.projects) => {
    return responsiveResizeConfigs[view] ?? responsiveResizeConfigs[CAMERA_VIEW.projects]
}

const getViewportSize = (viewport = {}) => {
    const fallbackWidth = typeof window !== "undefined" ? window.innerWidth : 1
    const fallbackHeight = typeof window !== "undefined" ? window.innerHeight : 1

    return {
        width: viewport.width ?? fallbackWidth,
        height: viewport.height ?? fallbackHeight
    }
}

export const getResponsiveCameraState = (view = CAMERA_VIEW.projects, viewport = {}) => {
    const { width, height } = getViewportSize(viewport)
    const cameraConfig = getCameraConfig(view)
    const resizeConfig = getResponsiveResizeConfig(view)
    const aspect = width / height
    const widthResponseFactor = clamp01(
        (resizeConfig.widthResponse.threshold - width) / resizeConfig.widthResponse.ramp
    )
    const mediumYawFactor = clamp01(
        (resizeConfig.mediumYaw.maxWidth - width)
        / (resizeConfig.mediumYaw.maxWidth - resizeConfig.mediumYaw.minWidth)
    )
    const compactYawFactor = clamp01(
        (resizeConfig.compactYaw.threshold - width) / resizeConfig.compactYaw.ramp
    )
    const ultraNarrowViewportFactor = clamp01(
        (resizeConfig.ultraNarrow.threshold - width) / resizeConfig.ultraNarrow.ramp
    )
    const compactPitchFactor = clamp01(
        (resizeConfig.compactPitch.threshold - width) / resizeConfig.compactPitch.ramp
    )
    const compactViewportFactor = clamp01(
        (resizeConfig.compactViewport.threshold - width) / resizeConfig.compactViewport.ramp
    )
    const fov = THREE.MathUtils.lerp(
        cameraConfig.fov,
        resizeConfig.widthResponse.maxFov,
        widthResponseFactor
    )
    const backwardDirection = new THREE.Vector3()
        .subVectors(cameraConfig.position, cameraConfig.lookAt)
        .normalize()
    const responsivePosition = cameraConfig.position.clone().addScaledVector(
        backwardDirection,
        resizeConfig.widthResponse.backwardOffset * widthResponseFactor
    )
    const cameraRight = new THREE.Vector3()
        .crossVectors(new THREE.Vector3(0, 1, 0), backwardDirection)
        .normalize()
    const position = responsivePosition.clone().addScaledVector(
        cameraRight,
        resizeConfig.mediumYaw.positionRightOffset * mediumYawFactor
    ).addScaledVector(
        cameraRight,
        resizeConfig.compactYaw.positionRightOffset * compactYawFactor
    ).addScaledVector(
        cameraRight,
        resizeConfig.ultraNarrow.positionRightOffset * ultraNarrowViewportFactor
    )
    position.y += resizeConfig.compactViewport.positionYOffset * compactViewportFactor
    const lookAt = cameraConfig.lookAt.clone().addScaledVector(
        cameraRight,
        resizeConfig.mediumYaw.lookAtRightOffset * mediumYawFactor
    ).addScaledVector(
        cameraRight,
        resizeConfig.compactYaw.lookAtRightOffset * compactYawFactor
    ).addScaledVector(
        cameraRight,
        resizeConfig.ultraNarrow.lookAtRightOffset * ultraNarrowViewportFactor
    )
    lookAt.y += resizeConfig.compactPitch.lookAtYOffset * compactPitchFactor

    return {
        fov,
        aspect,
        position,
        lookAt
    }
}

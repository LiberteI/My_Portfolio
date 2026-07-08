import * as THREE from "three"
import { getCameraConfig, getResponsiveResizeConfig } from "./cameraConfig"
import { clamp01 } from "./utils/math"

export const createResponsiveCameraController = ({ camera, renderer, container }) => {
    const resize = () => {
        const { clientWidth, clientHeight } = container

        if (!clientWidth || !clientHeight) {
            return
        }

        const aspect = clientWidth / clientHeight
        const cameraConfig = getCameraConfig()
        const resizeConfig = getResponsiveResizeConfig()
        const widthResponseFactor = clamp01(
            (resizeConfig.widthResponse.threshold - clientWidth) / resizeConfig.widthResponse.ramp
        )
        const mediumYawFactor = clamp01(
            (resizeConfig.mediumYaw.maxWidth - clientWidth)
            / (resizeConfig.mediumYaw.maxWidth - resizeConfig.mediumYaw.minWidth)
        )
        const compactYawFactor = clamp01(
            (resizeConfig.compactYaw.threshold - clientWidth) / resizeConfig.compactYaw.ramp
        )
        const ultraNarrowViewportFactor = clamp01(
            (resizeConfig.ultraNarrow.threshold - clientWidth) / resizeConfig.ultraNarrow.ramp
        )
        const compactPitchFactor = clamp01(
            (resizeConfig.compactPitch.threshold - clientWidth) / resizeConfig.compactPitch.ramp
        )
        const compactViewportFactor = clamp01(
            (resizeConfig.compactViewport.threshold - clientWidth) / resizeConfig.compactViewport.ramp
        )
        const responsiveFov = THREE.MathUtils.lerp(
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
        const shiftedPosition = responsivePosition.clone().addScaledVector(
            cameraRight,
            resizeConfig.mediumYaw.positionRightOffset * mediumYawFactor
        ).addScaledVector(
            cameraRight,
            resizeConfig.compactYaw.positionRightOffset * compactYawFactor
        ).addScaledVector(
            cameraRight,
            resizeConfig.ultraNarrow.positionRightOffset * ultraNarrowViewportFactor
        )
        shiftedPosition.y += resizeConfig.compactViewport.positionYOffset * compactViewportFactor
        const shiftedLookAt = cameraConfig.lookAt.clone().addScaledVector(
            cameraRight,
            resizeConfig.mediumYaw.lookAtRightOffset * mediumYawFactor
        ).addScaledVector(
            cameraRight,
            resizeConfig.compactYaw.lookAtRightOffset * compactYawFactor
        ).addScaledVector(
            cameraRight,
            resizeConfig.ultraNarrow.lookAtRightOffset * ultraNarrowViewportFactor
        )
        shiftedLookAt.y += resizeConfig.compactPitch.lookAtYOffset * compactPitchFactor

        camera.fov = responsiveFov
        camera.position.copy(shiftedPosition)
        camera.lookAt(shiftedLookAt)
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        renderer.setSize(clientWidth, clientHeight)
    }

    window.addEventListener("resize", resize)

    return {
        resize,
        dispose() {
            window.removeEventListener("resize", resize)
        }
    }
}

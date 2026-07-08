import * as THREE from "three"

export const getCameraConfig = () => {
    return {
        fov: 60,
        aspect: 1,
        near: 0.1,
        far: 500,
        position: new THREE.Vector3(-16.24, -4.8, 14.27),
        lookAt: new THREE.Vector3(-14.81, -4.9, 9.48)
    }
}

export const getResponsiveResizeConfig = () => {
    return {
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
    }
}

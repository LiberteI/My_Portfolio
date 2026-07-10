import * as THREE from "three"

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
        position: new THREE.Vector3(-16.24, -4.8, 14.27),
        lookAt: new THREE.Vector3(-17.23, -4.7, 14.28)
    }
}

export const getCameraConfig = (view = CAMERA_VIEW.projects) => {
    return cameraConfigs[view] ?? cameraConfigs[CAMERA_VIEW.projects]
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
        // widthResponse: {
        //     threshold: 1280,
        //     ramp: 480,
        //     maxFov: 78,
        //     backwardOffset: 6
        // },
        // mediumYaw: {
        //     maxWidth: 1280,
        //     minWidth: 770,
        //     lookAtRightOffset: 0,
        //     positionRightOffset: 0
        // },
        // compactYaw: {
        //     threshold: 770,
        //     ramp: 220,
        //     lookAtRightOffset: 0,
        //     positionRightOffset: 0
        // },
        // ultraNarrow: {
        //     threshold: 570,
        //     ramp: 180,
        //     positionRightOffset: 0,
        //     lookAtRightOffset: 0
        // },
        // compactPitch: {
        //     threshold: 770,
        //     ramp: 220,
        //     lookAtYOffset: 0
        // },
        // compactViewport: {
        //     threshold: 770,
        //     ramp: 220,
        //     positionYOffset: 0
        // }
    }
}

export const getResponsiveResizeConfig = (view = CAMERA_VIEW.projects) => {
    return responsiveResizeConfigs[view] ?? responsiveResizeConfigs[CAMERA_VIEW.projects]
}

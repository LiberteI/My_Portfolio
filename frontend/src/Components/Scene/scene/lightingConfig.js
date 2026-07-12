export const lightParam = () => {
    return {
        ambientLight: {
            name: "ambientLight",
            role: "Base fill light for the whole room so unlit surfaces do not fall completely into black.",
            enabled: true,
            color: "#ffffff",
            intensity: 0.35
        },
        tableSpotLight: {
            name: "tableSpotLight",
            role: "Top-down spotlight dedicated to the table area to create a focused pool of light.",
            enabled: true,
            color: "#f5e6c8",
            intensity: 14,
            distance: 18,
            angle: 1,
            penumbra: 0.42,
            decay: 1.2,
            positionYOffset: 6.5,
            targetYOffset: 1.36
        },
        projectorSpotLightToWall: {
            name: "projectorSpotLightToWall",
            role: "Primary projector spotlight aimed at the projection wall. This is the main direct light source.",
            enabled: true,
            debugEnabled: false,
            colorSource: "lightColor",
            baseIntensity: 0.1,
            distance: 25,
            angle: 0.55,
            penumbra: 0.35,
            decay: 1
        },
        projectorSpotLightToFloor: {
            name: "projectorSpotLightToFloor",
            role: "Secondary projector spotlight aimed at the floor area near the wall.",
            enabled: false,
            debugEnabled: false,
            colorSource: "lightColor",
            baseIntensity: 0.1,
            distance: 20,
            angle: 0.6,
            penumbra: 0.35,
            decay: 0.5,
            targetYOffset: -2,
            targetZOffset: 0.1
        },
        projectorOriginPointLight: {
            name: "projectorOriginPointLight",
            role: "Small point light at the projector lens to brighten the projector head and nearby space.",
            enabled: true,
            debugEnabled: false,
            colorSource: "lightColor",
            baseIntensity: 0.08,
            distance: 20,
            decay: 2
        },
        projectorBackRectAreaLight: {
            name: "projectorBackRectAreaLight",
            role: "Rect area light placed above the projector rear side to softly lift the projector body and pedestal.",
            enabled: true,
            color: "#fff1dc",
            intensity: 4,
            width: 2,
            height: 1.4,
            positionYOffset: 1.8,
            positionZOffset: 1.6,
            lookAtYOffset: 0.3,
            lookAtZOffset: -2.4
        },
        emissionLight: {
            name: "emissionLight",
            role: "Point light placed just in front of the screen to lift the nearby ceiling and floor.",
            enabled: true,
            debugEnabled: false,
            colorSource: "lightColor",
            baseIntensity: 0.03,
            distance: 24,
            decay: 0.1,
            positionZOffset: 0.9
        },
        wallGlowPlane: {
            name: "wallGlowPlane",
            role: "Additive glow card placed in front of the wall to fake projector bloom and soft center falloff.",
            enabled: true,
            colorSource: "lightColor",
            widthScale: 2.2,
            heightScale: 2.2,
            opacity: 0,
            gradientStops: [
                { offset: 0, alpha: 0.9 },
                { offset: 0.35, alpha: 0.38 },
                { offset: 0.72, alpha: 0.12 },
                { offset: 1, alpha: 0 }
            ],
            zOffset: 0.03
        },
        beamPyramid: {
            name: "beamPyramid",
            role: "Wireframe outline of the projector frustum. Useful for debugging beam shape.",
            enabled: false,
            colorSource: "lightColor",
            opacity: 0.7,
            visible: false
        },
        beamPyramidFill: {
            name: "beamPyramidFill",
            role: "Visible volumetric beam mesh between projector and wall, rendered with the custom beam shader.",
            enabled: true,
            colorSource: "lightColor",
            opacity: 0.28
        },
        spotLightDebug: {
            name: "spotLightDebug",
            role: "Reusable spotlight debugger showing the light center and a pyramid-like frustum.",
            color: "#22d3ee",
            markerRadius: 0.2,
            markerOpacity: 0.95,
            targetColor: "#ff4d4f",
            targetMarkerRadius: 0.16,
            targetMarkerOpacity: 0.98,
            sphereWidthSegments: 24,
            sphereHeightSegments: 16,
            sphereOpacity: 0.22,
            fallbackDistance: 12
        },
        pointLightDebug: {
            name: "pointLightDebug",
            role: "Reusable point light debugger showing the light center and a spherical range skeleton.",
            color: "#22d3ee",
            markerRadius: 0.2,
            markerOpacity: 0.95,
            sphereWidthSegments: 24,
            sphereHeightSegments: 16,
            sphereOpacity: 0.22,
            fallbackDistance: 12
        }
    }
}

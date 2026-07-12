import * as THREE from "three"
import createBeamMaterial from "../../shaders/beamShaders/createBeamMaterial"
import { lightParam } from "../lightingConfig"
import { getDisplayPositions, getProjectionFrameConfig, DEFAULT_PROJECTOR_LIGHT_COLOR } from "../sceneConfig"
import { getRgbaColor } from "../utils/color"
import { createPointLightDebugger, createSpotLightDebugger } from "./debugLightHelpers"
import {
    applyAdaptiveLightingTargets,
    initializeAdaptiveProjectorLighting,
    updateAdaptiveProjectorLighting
} from "../projection/adaptiveLighting"

const buildProjectBeamOrigin = (scene, lightColor = DEFAULT_PROJECTOR_LIGHT_COLOR) => {
    const lighting = lightParam()
    const projectorSpotLightToWallConfig = lighting.projectorSpotLightToWall
    const projectorSpotLightToFloorConfig = lighting.projectorSpotLightToFloor
    const projectorOriginPointLightConfig = lighting.projectorOriginPointLight
    const pointLightDebugConfig = lighting.pointLightDebug
    const { projectorBeamOrigin } = getDisplayPositions()

    const projectorSpotLightToWall = projectorSpotLightToWallConfig.enabled
        ? new THREE.SpotLight(
            lightColor,
            projectorSpotLightToWallConfig.baseIntensity,
            projectorSpotLightToWallConfig.distance,
            projectorSpotLightToWallConfig.angle,
            projectorSpotLightToWallConfig.penumbra,
            projectorSpotLightToWallConfig.decay
        )
        : null
    if (projectorSpotLightToWall) {
        projectorSpotLightToWall.position.set(projectorBeamOrigin.x, projectorBeamOrigin.y, projectorBeamOrigin.z)
        scene.add(projectorSpotLightToWall)
    }

    const projectorSpotLightToFloor = projectorSpotLightToFloorConfig.enabled
        ? new THREE.SpotLight(
            lightColor,
            projectorSpotLightToFloorConfig.baseIntensity,
            projectorSpotLightToFloorConfig.distance,
            projectorSpotLightToFloorConfig.angle,
            projectorSpotLightToFloorConfig.penumbra,
            projectorSpotLightToFloorConfig.decay
        )
        : null
    if (projectorSpotLightToFloor) {
        projectorSpotLightToFloor.position.set(projectorBeamOrigin.x, projectorBeamOrigin.y, projectorBeamOrigin.z)
        scene.add(projectorSpotLightToFloor)
    }

    const projectorOriginPointLight = projectorOriginPointLightConfig.enabled
        ? new THREE.PointLight(
            lightColor,
            projectorOriginPointLightConfig.baseIntensity,
            projectorOriginPointLightConfig.distance,
            projectorOriginPointLightConfig.decay
        )
        : null
    if (projectorOriginPointLight) {
        projectorOriginPointLight.position.set(projectorBeamOrigin.x, projectorBeamOrigin.y, projectorBeamOrigin.z)
        scene.add(projectorOriginPointLight)
    }

    const projectorOriginPointLightDebug = createPointLightDebugger(scene, projectorOriginPointLight, {
        ...pointLightDebugConfig,
        enabled: projectorOriginPointLightConfig.debugEnabled
    })

    return {
        projectorSpotLightToWall,
        projectorSpotLightToFloor,
        projectorOriginPointLight,
        projectorOriginPointLightDebug,
        projectorBeamOrigin
    }
}

export const buildProjectorRig = (scene, lightColor = DEFAULT_PROJECTOR_LIGHT_COLOR) => {
    const lighting = lightParam()
    const projectorBackRectAreaLightConfig = lighting.projectorBackRectAreaLight
    const emissionLightConfig = lighting.emissionLight
    const wallGlowPlaneConfig = lighting.wallGlowPlane
    const beamPyramidConfig = lighting.beamPyramid
    const beamPyramidFillConfig = lighting.beamPyramidFill
    const spotLightDebugConfig = lighting.spotLightDebug
    const roomZStart = -7
    const projectionFrame = getProjectionFrameConfig()
    const { projectorPosition } = getDisplayPositions()
    const projectionFrameCenter = {
        x: (projectionFrame.xStart + projectionFrame.xEnd) / 2,
        y: (projectionFrame.yStart + projectionFrame.yEnd) / 2,
        z: roomZStart
    }
    const beamOriginAssets = buildProjectBeamOrigin(scene, lightColor)
    const {
        projectorSpotLightToWall,
        projectorSpotLightToFloor,
        projectorOriginPointLight,
        projectorOriginPointLightDebug,
        projectorBeamOrigin
    } = beamOriginAssets

    const beamTarget = new THREE.Object3D()
    beamTarget.position.set(projectionFrameCenter.x, projectionFrameCenter.y, projectionFrameCenter.z)
    scene.add(beamTarget)
    if (projectorSpotLightToWall) {
        projectorSpotLightToWall.target = beamTarget
    }

    const floorTarget = new THREE.Object3D()
    floorTarget.position.set(
        projectionFrameCenter.x,
        projectionFrameCenter.y + lighting.projectorSpotLightToFloor.targetYOffset,
        roomZStart + lighting.projectorSpotLightToFloor.targetZOffset
    )
    scene.add(floorTarget)
    if (projectorSpotLightToFloor) {
        projectorSpotLightToFloor.target = floorTarget
    }

    const projectorSpotLightToWallDebug = createSpotLightDebugger(scene, projectorSpotLightToWall, {
        ...spotLightDebugConfig,
        enabled: lighting.projectorSpotLightToWall.debugEnabled
    })
    const projectorSpotLightToFloorDebug = createSpotLightDebugger(scene, projectorSpotLightToFloor, {
        ...spotLightDebugConfig,
        enabled: lighting.projectorSpotLightToFloor.debugEnabled
    })

    const projectorBackRectAreaLight = projectorBackRectAreaLightConfig.enabled
        ? new THREE.RectAreaLight(
            projectorBackRectAreaLightConfig.color,
            projectorBackRectAreaLightConfig.intensity,
            projectorBackRectAreaLightConfig.width,
            projectorBackRectAreaLightConfig.height
        )
        : null
    if (projectorBackRectAreaLight) {
        projectorBackRectAreaLight.position.set(
            projectorPosition.x,
            projectorPosition.y + projectorBackRectAreaLightConfig.positionYOffset,
            projectorPosition.z + projectorBackRectAreaLightConfig.positionZOffset
        )
        projectorBackRectAreaLight.lookAt(
            projectorPosition.x,
            projectorPosition.y + projectorBackRectAreaLightConfig.lookAtYOffset,
            projectorPosition.z + projectorBackRectAreaLightConfig.lookAtZOffset
        )
        scene.add(projectorBackRectAreaLight)
    }

    const emissionLight = emissionLightConfig.enabled
        ? new THREE.PointLight(
            lightColor,
            emissionLightConfig.baseIntensity,
            emissionLightConfig.distance,
            emissionLightConfig.decay
        )
        : null
    if (emissionLight) {
        emissionLight.position.set(
            projectionFrameCenter.x,
            projectionFrameCenter.y,
            roomZStart + emissionLightConfig.positionZOffset
        )
        scene.add(emissionLight)
    }
    const emissionLightDebug = createPointLightDebugger(scene, emissionLight, {
        ...lighting.pointLightDebug,
        enabled: emissionLightConfig.debugEnabled
    })

    const wallGlowCanvas = wallGlowPlaneConfig.enabled ? document.createElement("canvas") : null
    let wallGlowTexture = null
    let wallGlowMaterial = null
    let wallGlowPlane = null

    if (wallGlowCanvas) {
        wallGlowCanvas.width = 1024
        wallGlowCanvas.height = 1024
        const wallGlowContext = wallGlowCanvas.getContext("2d")
        const wallGlowGradient = wallGlowContext.createRadialGradient(512, 512, 90, 512, 512, 512)
        wallGlowPlaneConfig.gradientStops.forEach(({ offset, alpha }) => {
            wallGlowGradient.addColorStop(offset, getRgbaColor(lightColor, alpha))
        })
        wallGlowContext.fillStyle = wallGlowGradient
        wallGlowContext.fillRect(0, 0, 1024, 1024)

        wallGlowTexture = new THREE.CanvasTexture(wallGlowCanvas)
        wallGlowMaterial = new THREE.MeshBasicMaterial({
            map: wallGlowTexture,
            transparent: true,
            opacity: wallGlowPlaneConfig.opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        })
        wallGlowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(
                (projectionFrame.xEnd - projectionFrame.xStart) * wallGlowPlaneConfig.widthScale,
                (projectionFrame.yEnd - projectionFrame.yStart) * wallGlowPlaneConfig.heightScale
            ),
            wallGlowMaterial
        )
        wallGlowPlane.position.set(
            projectionFrameCenter.x,
            projectionFrameCenter.y,
            roomZStart + wallGlowPlaneConfig.zOffset
        )
        scene.add(wallGlowPlane)
    }

    const beamOrigin = new THREE.Vector3(projectorBeamOrigin.x, projectorBeamOrigin.y, projectorBeamOrigin.z)
    const beamAxis = new THREE.Vector3().subVectors(projectionFrameCenter, beamOrigin).normalize()
    const beamLength = beamOrigin.distanceTo(new THREE.Vector3(projectionFrameCenter.x, projectionFrameCenter.y, projectionFrameCenter.z))
    const projectionTopLeft = new THREE.Vector3(projectionFrame.xStart, projectionFrame.yEnd, roomZStart)
    const projectionTopRight = new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yEnd, roomZStart)
    const projectionBottomRight = new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yStart, roomZStart)
    const projectionBottomLeft = new THREE.Vector3(projectionFrame.xStart, projectionFrame.yStart, roomZStart)

    const beamPyramidMaterial = beamPyramidConfig.enabled
        ? new THREE.LineBasicMaterial({
            color: lightColor,
            transparent: true,
            opacity: beamPyramidConfig.opacity
        })
        : null
    const beamPyramidGeometry = beamPyramidConfig.enabled
        ? new THREE.BufferGeometry().setFromPoints([
            beamOrigin, projectionTopLeft,
            beamOrigin, projectionTopRight,
            beamOrigin, projectionBottomRight,
            beamOrigin, projectionBottomLeft,
            projectionTopLeft, projectionTopRight,
            projectionTopRight, projectionBottomRight,
            projectionBottomRight, projectionBottomLeft,
            projectionBottomLeft, projectionTopLeft
        ])
        : null
    const beamPyramid = beamPyramidGeometry && beamPyramidMaterial
        ? new THREE.LineSegments(beamPyramidGeometry, beamPyramidMaterial)
        : null
    if (beamPyramid) {
        beamPyramid.visible = beamPyramidConfig.visible
        scene.add(beamPyramid)
    }

    const beamPyramidFillGeometry = beamPyramidFillConfig.enabled ? new THREE.BufferGeometry() : null
    const beamPyramidFillVertices = beamPyramidFillConfig.enabled
        ? new Float32Array([
            beamOrigin.x, beamOrigin.y, beamOrigin.z,
            projectionTopLeft.x, projectionTopLeft.y, projectionTopLeft.z,
            projectionTopRight.x, projectionTopRight.y, projectionTopRight.z,

            beamOrigin.x, beamOrigin.y, beamOrigin.z,
            projectionTopRight.x, projectionTopRight.y, projectionTopRight.z,
            projectionBottomRight.x, projectionBottomRight.y, projectionBottomRight.z,

            beamOrigin.x, beamOrigin.y, beamOrigin.z,
            projectionBottomRight.x, projectionBottomRight.y, projectionBottomRight.z,
            projectionBottomLeft.x, projectionBottomLeft.y, projectionBottomLeft.z,

            beamOrigin.x, beamOrigin.y, beamOrigin.z,
            projectionBottomLeft.x, projectionBottomLeft.y, projectionBottomLeft.z,
            projectionTopLeft.x, projectionTopLeft.y, projectionTopLeft.z
        ])
        : null
    if (beamPyramidFillGeometry && beamPyramidFillVertices) {
        beamPyramidFillGeometry.setAttribute("position", new THREE.BufferAttribute(beamPyramidFillVertices, 3))
    }
    const beamPyramidFillMaterial = beamPyramidFillConfig.enabled
        ? createBeamMaterial({
            beamColor: lightColor,
            beamOrigin,
            beamAxis,
            beamLength,
            beamOpacity: beamPyramidFillConfig.opacity
        })
        : null
    const beamPyramidFill = beamPyramidFillGeometry && beamPyramidFillMaterial
        ? new THREE.Mesh(beamPyramidFillGeometry, beamPyramidFillMaterial)
        : null
    if (beamPyramidFill) {
        scene.add(beamPyramidFill)
    }

    const projectorRig = {
        projectorSpotLightToWall,
        projectorOriginPointLight,
        projectorSpotLightToWallDebug,
        projectorSpotLightToFloor,
        projectorSpotLightToFloorDebug,
        projectorOriginPointLightDebug,
        projectorBackRectAreaLight,
        beamTarget,
        floorTarget,
        emissionLight,
        emissionLightDebug,
        wallGlowPlane,
        wallGlowMaterial,
        wallGlowTexture,
        beamPyramid,
        beamPyramidGeometry,
        beamPyramidMaterial,
        beamPyramidFill,
        beamPyramidFillGeometry,
        beamPyramidFillMaterial,
        applyAdaptiveTargets(analysis) {
            applyAdaptiveLightingTargets(projectorRig, analysis, lightColor)
        },
        update() {
            updateAdaptiveProjectorLighting(projectorRig)
        },
        dispose() {
            if (projectorSpotLightToWall) {
                scene.remove(projectorSpotLightToWall)
            }
            if (projectorSpotLightToFloor) {
                scene.remove(projectorSpotLightToFloor)
            }
            if (projectorOriginPointLight) {
                scene.remove(projectorOriginPointLight)
            }
            if (projectorBackRectAreaLight) {
                scene.remove(projectorBackRectAreaLight)
            }
            if (beamPyramid) {
                scene.remove(beamPyramid)
            }
            if (beamPyramidFill) {
                scene.remove(beamPyramidFill)
            }
            scene.remove(beamTarget)
            scene.remove(floorTarget)
            if (emissionLight) {
                scene.remove(emissionLight)
            }
            if (wallGlowPlane) {
                scene.remove(wallGlowPlane)
                wallGlowPlane.geometry.dispose()
            }
            projectorSpotLightToWallDebug?.dispose()
            projectorSpotLightToFloorDebug?.dispose()
            projectorOriginPointLightDebug?.dispose()
            emissionLightDebug?.dispose()
            beamPyramidGeometry?.dispose()
            beamPyramidMaterial?.dispose()
            beamPyramidFillGeometry?.dispose()
            beamPyramidFillMaterial?.dispose()
            wallGlowMaterial?.dispose()
            wallGlowTexture?.dispose()
        }
    }

    initializeAdaptiveProjectorLighting(projectorRig, lightColor)

    return projectorRig
}

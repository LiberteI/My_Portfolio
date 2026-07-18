import { useEffect, useRef } from "react"
import * as THREE from "three"
import { createCamera } from "./controllers/createCamera"
import { buildRoom } from "./shared/core/buildRoom"
import { buildPedestal } from "./route/project/core/buildPedestal"
import { buildLeatherDeskPad } from "./route/experience/core/buildLeatherDeskPad"
import { buildResume } from "./route/experience/core/buildResume"
import { buildTable } from "./route/experience/core/buildTable"
import { buildTableFigures } from "./route/experience/decorative/buildTableFigures"
import { buildRoomWallFigures } from "./route/experience/decorative/buildRoomWallFigures"
import { buildAmbientLight } from "./shared/core/buildAmbientLight"
import { buildProjectorRig } from "./route/project/lighting/buildProjectorRig"
import { buildTableSpotLight } from "./route/experience/core/buildTableSpotLight"
import { buildProjectionScreen } from "./route/project/projection/buildProjectionScreen"
import { createResponsiveCameraController } from "./controllers/createResponsiveCameraController"
import { createPointerInteractionController } from "./controllers/createPointerInteractionController"
import { createMovementController } from "./controllers/createMovementController"
import { getExperienceDecorativeRuleSet } from "./config/decorativeConfig"
import { DEFAULT_PROJECTOR_LIGHT_COLOR, getValidScreenTextureUrl } from "./config/sceneConfig"
import { createProjectorModel } from "./route/project/core/loadProjectorModel"
import { createRouteLayerTransitionController } from "./route/createRouteLayerTransitionController"
import { CAMERA_VIEW, getResponsiveCameraState, interpolateCameraPosition } from "./config/cameraConfig"
import {
    beginLayerLoad,
    completeLayerLoad,
    createLayerState,
    createResolvedLayerPromise,
    deactivateLayer,
    disposeLayerRuntime,
    isLayerLoaded,
    isLayerLoading,
    setLayerVisibility,
    LAYER_LOAD_STATE,
    LAYER_VISIBILITY_STATE
} from "./runtime/layerRuntime"

/* eslint-disable react-hooks/exhaustive-deps */

const CAMERA_TRANSITION_DURATION_MS = 700
const EXPERIENCE_DECORATIVE_LOAD_DELAY_MS = 220
const ROUTE_LAYER_HIDE_DELAY_MS = CAMERA_TRANSITION_DURATION_MS

const ArtGalleryScene = ({ className = "", screenTextureUrl, onScreenClick, onResumeClick, routeValue }) => {
    const canvasRef = useRef(null)
    const cameraRef = useRef(null)
    const pressedKeysRef = useRef(new Set())
    const cameraRotationRef = useRef({ yaw: 0, pitch: 0 })
    const sceneRef = useRef(null)
    const rendererRef = useRef(null)
    const projectorRigRef = useRef(null)
    const projectionScreenRef = useRef(null)
    const responsiveCameraControllerRef = useRef(null)
    const cameraTransitionFrameRef = useRef(0)
    const decorativeLoadTimeoutRef = useRef(0)
    const hideExperienceRouteTimeoutRef = useRef(0)
    const hideProjectRouteTimeoutRef = useRef(0)
    const sharedCoreLayerRef = useRef(createLayerState())
    const experienceCoreLayerRef = useRef(createLayerState())
    const experienceDecorativeLayerRef = useRef(createLayerState())
    const projectCoreLayerRef = useRef(createLayerState())
    const sceneReadinessRef = useRef({
        sharedCoreReady: false,
        activeRouteCoreReadyFor: null,
        routeUsableFor: null,
        decorativeEligibleFor: null
    })
    const onScreenClickRef = useRef(onScreenClick)
    const onResumeClickRef = useRef(onResumeClick)
    const requestedRouteValueRef = useRef(routeValue)
    const routeValueRef = useRef(routeValue)
    const previousRouteValueRef = useRef(routeValue)
    const validScreenTextureUrlRef = useRef(getValidScreenTextureUrl(screenTextureUrl))
    const lightColor = DEFAULT_PROJECTOR_LIGHT_COLOR
    const validScreenTextureUrl = getValidScreenTextureUrl(screenTextureUrl)
    const enableCameraMovement = false

    useEffect(() => {
        onScreenClickRef.current = onScreenClick
    }, [onScreenClick])

    useEffect(() => {
        onResumeClickRef.current = onResumeClick
    }, [onResumeClick])

    useEffect(() => {
        requestedRouteValueRef.current = routeValue
    }, [routeValue])

    useEffect(() => {
        validScreenTextureUrlRef.current = validScreenTextureUrl
    }, [validScreenTextureUrl])

    const clearDecorativeLoadTimeout = () => {
        window.clearTimeout(decorativeLoadTimeoutRef.current)
        decorativeLoadTimeoutRef.current = 0
    }

    const clearRouteHideTimeouts = () => {
        window.clearTimeout(hideExperienceRouteTimeoutRef.current)
        window.clearTimeout(hideProjectRouteTimeoutRef.current)
        hideExperienceRouteTimeoutRef.current = 0
        hideProjectRouteTimeoutRef.current = 0
    }

    const scheduleExperienceRouteHide = () => {
        window.clearTimeout(hideExperienceRouteTimeoutRef.current)
        hideExperienceRouteTimeoutRef.current = window.setTimeout(() => {
            deactivateLayer(experienceCoreLayerRef)
            deactivateLayer(experienceDecorativeLayerRef)
            hideExperienceRouteTimeoutRef.current = 0
        }, ROUTE_LAYER_HIDE_DELAY_MS)
    }

    const scheduleProjectRouteHide = () => {
        window.clearTimeout(hideProjectRouteTimeoutRef.current)
        hideProjectRouteTimeoutRef.current = window.setTimeout(() => {
            deactivateLayer(projectCoreLayerRef)
            hideProjectRouteTimeoutRef.current = 0
        }, ROUTE_LAYER_HIDE_DELAY_MS)
    }

    const markSharedCoreReady = () => {
        sceneReadinessRef.current.sharedCoreReady = true
    }

    const markRouteCoreReady = (route) => {
        sceneReadinessRef.current.activeRouteCoreReadyFor = route
    }

    const markRouteUsable = (route) => {
        sceneReadinessRef.current.routeUsableFor = route
    }

    const markDecorativeEligible = (route) => {
        sceneReadinessRef.current.decorativeEligibleFor = route
    }

    const resetRouteReadiness = () => {
        sceneReadinessRef.current.activeRouteCoreReadyFor = null
        sceneReadinessRef.current.routeUsableFor = null
        sceneReadinessRef.current.decorativeEligibleFor = null
    }

    const getDecorativeViewportWidth = () => {
        return canvasRef.current?.clientWidth ?? window.innerWidth
    }

    const getExperienceDecorativeRuleSetForViewport = () => {
        return getExperienceDecorativeRuleSet(getDecorativeViewportWidth())
    }

    const syncProjectionScreen = () => {
        const nextScreenTextureUrl = validScreenTextureUrlRef.current
        const projectorRig = projectorRigRef.current
        const projectLayerGroup = projectCoreLayerRef.current.group

        if (!projectorRig || !projectLayerGroup || !isLayerLoaded(projectCoreLayerRef)) {
            return
        }

        projectionScreenRef.current?.dispose()
        projectionScreenRef.current = null

        if (!nextScreenTextureUrl) {
            return
        }

        projectionScreenRef.current = buildProjectionScreen(projectLayerGroup, nextScreenTextureUrl, {
            onTextureAnalyzed: (analysis) => {
                projectorRig.applyAdaptiveTargets(analysis)
            }
        })
    }

    const ensureExperienceCoreLayerLoaded = () => {
        const layerState = experienceCoreLayerRef.current

        if (!sceneRef.current || isLayerLoaded(experienceCoreLayerRef)) {
            return layerState.loadingPromise ?? Promise.resolve()
        }

        if (isLayerLoading(experienceCoreLayerRef) && layerState.loadingPromise) {
            return layerState.loadingPromise
        }

        beginLayerLoad(experienceCoreLayerRef)
        const group = layerState.group
        const table = buildTable(group)
        const leatherDeskPad = buildLeatherDeskPad(group)
        const resume = buildResume(group)
        const tableSpotLight = buildTableSpotLight(group)

        layerState.handles = {
            table,
            leatherDeskPad,
            resume,
            tableSpotLight
        }

        return createResolvedLayerPromise(experienceCoreLayerRef)
    }

    const ensureExperienceDecorativeLayerLoaded = () => {
        const layerState = experienceDecorativeLayerRef.current

        if (!sceneRef.current || isLayerLoaded(experienceDecorativeLayerRef)) {
            return layerState.loadingPromise ?? Promise.resolve()
        }

        if (isLayerLoading(experienceDecorativeLayerRef) && layerState.loadingPromise) {
            return layerState.loadingPromise
        }

        beginLayerLoad(experienceDecorativeLayerRef)
        const group = layerState.group
        const decorativeRuleSet = getExperienceDecorativeRuleSetForViewport()
        const tableFigures = decorativeRuleSet.tableFigureNames.length > 0
            ? buildTableFigures(group, {
                includeNames: decorativeRuleSet.tableFigureNames
            })
            : null
        const roomWallFigures = buildRoomWallFigures(group, {
            includeNames: decorativeRuleSet.roomWallFigureNames
        })

        layerState.handles = {
            tableFigures,
            roomWallFigures
        }
        layerState.loadingPromise = Promise.all([
            tableFigures?.loadPromise ?? Promise.resolve(),
            roomWallFigures.loadPromise
        ]).finally(() => {
            completeLayerLoad(experienceDecorativeLayerRef)
        })

        return layerState.loadingPromise
    }

    const ensureProjectCoreLayerLoaded = () => {
        const layerState = projectCoreLayerRef.current

        if (!sceneRef.current || isLayerLoaded(projectCoreLayerRef)) {
            return layerState.loadingPromise ?? Promise.resolve()
        }

        if (isLayerLoading(projectCoreLayerRef) && layerState.loadingPromise) {
            return layerState.loadingPromise
        }

        beginLayerLoad(projectCoreLayerRef)
        const group = layerState.group
        const pedestal = buildPedestal(group)
        const projectorRig = buildProjectorRig(group, lightColor)
        const projectorModel = createProjectorModel(group)

        projectorRigRef.current = projectorRig
        layerState.handles = {
            pedestal,
            projectorRig,
            projectorModel
        }
        layerState.loadingPromise = Promise.all([
            projectorModel.loadPromise
        ]).finally(() => {
            completeLayerLoad(projectCoreLayerRef)
            syncProjectionScreen()
        })

        return layerState.loadingPromise
    }

    const activateExperienceRouteLayer = () => {
        if (!sceneReadinessRef.current.sharedCoreReady) {
            return
        }

        ensureExperienceCoreLayerLoaded().then(() => {
            if (requestedRouteValueRef.current !== CAMERA_VIEW.experience) {
                return
            }

            markRouteCoreReady(CAMERA_VIEW.experience)
            setLayerVisibility(experienceCoreLayerRef, true)
            markRouteUsable(CAMERA_VIEW.experience)

            clearDecorativeLoadTimeout()
            decorativeLoadTimeoutRef.current = window.setTimeout(() => {
                if (requestedRouteValueRef.current !== CAMERA_VIEW.experience) {
                    return
                }

                markDecorativeEligible(CAMERA_VIEW.experience)
                ensureExperienceDecorativeLayerLoaded().then(() => {
                    if (requestedRouteValueRef.current !== CAMERA_VIEW.experience) {
                        return
                    }

                    setLayerVisibility(experienceDecorativeLayerRef, true)
                })
            }, EXPERIENCE_DECORATIVE_LOAD_DELAY_MS)
        })
    }

    const activateProjectRouteLayer = () => {
        if (!sceneReadinessRef.current.sharedCoreReady) {
            return
        }

        ensureProjectCoreLayerLoaded().then(() => {
            if (requestedRouteValueRef.current !== CAMERA_VIEW.projects) {
                return
            }

            markRouteCoreReady(CAMERA_VIEW.projects)
            setLayerVisibility(projectCoreLayerRef, true)
            markRouteUsable(CAMERA_VIEW.projects)
        })
    }

    const routeLayerTransitionController = createRouteLayerTransitionController({
        cameraView: CAMERA_VIEW,
        clearDecorativeLoadTimeout,
        clearRouteHideTimeouts,
        resetRouteReadiness,
        activateExperienceRouteLayer,
        activateProjectRouteLayer,
        deactivateLayer,
        experienceCoreLayerRef,
        experienceDecorativeLayerRef,
        projectCoreLayerRef,
        scheduleExperienceRouteHide,
        scheduleProjectRouteHide
    })

    useEffect(() => {
        const camera = cameraRef.current
        const responsiveCameraController = responsiveCameraControllerRef.current
        const previousRouteValue = previousRouteValueRef.current

        if (!camera || !responsiveCameraController) {
            routeValueRef.current = routeValue
            previousRouteValueRef.current = routeValue
            return
        }

        if (!previousRouteValue || previousRouteValue === routeValue) {
            routeValueRef.current = routeValue
            previousRouteValueRef.current = routeValue
            responsiveCameraController.resize()
            return
        }

        const container = canvasRef.current
        const viewport = {
            width: container?.clientWidth,
            height: container?.clientHeight
        }
        const fromCameraState = getResponsiveCameraState(previousRouteValue, viewport)
        const toCameraState = getResponsiveCameraState(routeValue, viewport)
        const startTime = performance.now()

        window.cancelAnimationFrame(cameraTransitionFrameRef.current)

        const animateCameraTransition = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / CAMERA_TRANSITION_DURATION_MS, 1)
            const lookAt = fromCameraState.lookAt.clone().lerp(toCameraState.lookAt, progress)
            const fov = THREE.MathUtils.lerp(fromCameraState.fov, toCameraState.fov, progress)

            camera.position.copy(interpolateCameraPosition(previousRouteValue, routeValue, progress, viewport))
            camera.lookAt(lookAt)
            camera.fov = fov
            camera.aspect = toCameraState.aspect
            camera.rotation.z = 0
            camera.updateProjectionMatrix()

            if (progress < 1) {
                cameraTransitionFrameRef.current = window.requestAnimationFrame(animateCameraTransition)
                return
            }

            routeValueRef.current = routeValue
            previousRouteValueRef.current = routeValue
            responsiveCameraController.resize()
        }

        cameraTransitionFrameRef.current = window.requestAnimationFrame(animateCameraTransition)
    }, [routeValue])

    useEffect(() => {
        const enableAxesDebug = false
        const container = canvasRef.current

        if (!container) {
            return
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color("#000000")
        sceneRef.current = scene

        const sharedCoreGroup = new THREE.Group()
        const experienceCoreGroup = new THREE.Group()
        const experienceDecorativeGroup = new THREE.Group()
        const projectCoreGroup = new THREE.Group()

        experienceCoreGroup.visible = false
        experienceDecorativeGroup.visible = false
        projectCoreGroup.visible = false

        scene.add(sharedCoreGroup)
        scene.add(experienceCoreGroup)
        scene.add(experienceDecorativeGroup)
        scene.add(projectCoreGroup)

        sharedCoreLayerRef.current = {
            ...createLayerState(),
            group: sharedCoreGroup,
            loadState: LAYER_LOAD_STATE.loaded,
            visibilityState: LAYER_VISIBILITY_STATE.visible,
            loadingPromise: Promise.resolve()
        }
        experienceCoreLayerRef.current = { ...createLayerState(), group: experienceCoreGroup }
        experienceDecorativeLayerRef.current = { ...createLayerState(), group: experienceDecorativeGroup }
        projectCoreLayerRef.current = { ...createLayerState(), group: projectCoreGroup }

        const camera = createCamera(routeValueRef.current)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1
        container.appendChild(renderer.domElement)
        rendererRef.current = renderer

        const room = buildRoom(sharedCoreGroup)
        const ambientLight = buildAmbientLight(sharedCoreGroup)
        sharedCoreLayerRef.current.handles = {
            room,
            ambientLight
        }
        markSharedCoreReady()

        const debugAxes = enableAxesDebug ? new THREE.AxesHelper(4) : null
        if (debugAxes) {
            scene.add(debugAxes)
        }

        const pressedKeys = pressedKeysRef.current
        const initialForward = new THREE.Vector3()
        camera.getWorldDirection(initialForward)
        cameraRotationRef.current = {
            yaw: Math.atan2(-initialForward.x, -initialForward.z),
            pitch: Math.asin(THREE.MathUtils.clamp(initialForward.y, -1, 1))
        }

        let animationFrameId = 0
        const responsiveCameraController = createResponsiveCameraController({
            camera,
            renderer,
            container,
            getView: () => routeValueRef.current
        })
        responsiveCameraControllerRef.current = responsiveCameraController

        const pointerInteractionController = createPointerInteractionController({
            container,
            renderer,
            camera,
            getProjectionScreen: () => projectionScreenRef.current,
            getOnScreenClick: () => onScreenClickRef.current,
            getResume: () => experienceCoreLayerRef.current.handles?.resume?.resume ?? null,
            getOnResumeClick: () => onResumeClickRef.current
        })

        const animate = () => {
            projectorRigRef.current?.update()
            renderer.render(scene, camera)
            animationFrameId = window.requestAnimationFrame(animate)
        }

        responsiveCameraController.resize()

        if (routeValueRef.current === CAMERA_VIEW.experience) {
            activateExperienceRouteLayer()
        } else if (routeValueRef.current === CAMERA_VIEW.projects) {
            activateProjectRouteLayer()
        }

        animationFrameId = window.requestAnimationFrame(animate)

        return () => {
            pressedKeys.clear()
            window.cancelAnimationFrame(animationFrameId)
            window.cancelAnimationFrame(cameraTransitionFrameRef.current)
            clearDecorativeLoadTimeout()
            clearRouteHideTimeouts()
            responsiveCameraController.dispose()
            pointerInteractionController.dispose()
            projectionScreenRef.current?.dispose()
            projectionScreenRef.current = null
            disposeLayerRuntime(sharedCoreLayerRef)
            disposeLayerRuntime(experienceCoreLayerRef)
            disposeLayerRuntime(experienceDecorativeLayerRef)
            disposeLayerRuntime(projectCoreLayerRef)

            if (debugAxes) {
                scene.remove(debugAxes)
                debugAxes.geometry.dispose()
                if (Array.isArray(debugAxes.material)) {
                    debugAxes.material.forEach((material) => material.dispose())
                } else {
                    debugAxes.material.dispose()
                }
            }

            renderer.dispose()
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }

            scene.remove(sharedCoreGroup)
            scene.remove(experienceCoreGroup)
            scene.remove(experienceDecorativeGroup)
            scene.remove(projectCoreGroup)

            cameraRef.current = null
            sceneRef.current = null
            rendererRef.current = null
            projectorRigRef.current = null
            projectionScreenRef.current = null
            responsiveCameraControllerRef.current = null
            cameraTransitionFrameRef.current = 0
            decorativeLoadTimeoutRef.current = 0
            hideExperienceRouteTimeoutRef.current = 0
            hideProjectRouteTimeoutRef.current = 0
            sceneReadinessRef.current = {
                sharedCoreReady: false,
                activeRouteCoreReadyFor: null,
                routeUsableFor: null,
                decorativeEligibleFor: null
            }
        }
    }, [lightColor])

    useEffect(() => {
        if (!sceneRef.current) {
            return
        }

        routeLayerTransitionController.activate({
            routeValue,
            previousRouteValue: previousRouteValueRef.current
        })

        return () => {
            routeLayerTransitionController.dispose()
        }
    }, [routeValue, lightColor])

    useEffect(() => {
        syncProjectionScreen()

        return () => {
            projectionScreenRef.current?.dispose()
            projectionScreenRef.current = null
        }
    }, [validScreenTextureUrl])

    useEffect(() => {
        const container = canvasRef.current

        if (!enableCameraMovement || !container) {
            return
        }

        const movementController = createMovementController({
            container,
            cameraRef,
            cameraRotationRef,
            pressedKeysRef
        })

        return () => {
            movementController.dispose()
        }
    }, [enableCameraMovement])

    return (
        <div
            ref={canvasRef}
            className={className}
        />
    )
}

export default ArtGalleryScene

/* eslint-enable react-hooks/exhaustive-deps */

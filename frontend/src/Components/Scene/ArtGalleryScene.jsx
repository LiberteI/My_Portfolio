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
import { DEFAULT_PROJECTOR_LIGHT_COLOR, getValidScreenTextureUrl } from "./config/sceneConfig"
import { createProjectorModel } from "./route/project/core/loadProjectorModel"
import { CAMERA_VIEW, getResponsiveCameraState, interpolateCameraPosition } from "./config/cameraConfig"

/* eslint-disable react-hooks/exhaustive-deps */

const CAMERA_TRANSITION_DURATION_MS = 700
const EXPERIENCE_DECORATIVE_LOAD_DELAY_MS = 220
const MOBILE_DECORATIVE_VIEWPORT_WIDTH = 800
const ROUTE_LAYER_HIDE_DELAY_MS = CAMERA_TRANSITION_DURATION_MS

const LAYER_LOAD_STATE = {
    notLoaded: "not_loaded",
    loading: "loading",
    loaded: "loaded"
}

const LAYER_VISIBILITY_STATE = {
    hidden: "hidden",
    visible: "visible"
}

const createLayerState = () => ({
    group: null,
    loadState: LAYER_LOAD_STATE.notLoaded,
    visibilityState: LAYER_VISIBILITY_STATE.hidden,
    loadingPromise: null,
    handles: {}
})

const ArtGalleryScene = ({ className = "", screenTextureUrl, onScreenClick, routeValue }) => {
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
    const onScreenClickRef = useRef(onScreenClick)
    const routeValueRef = useRef(routeValue)
    const previousRouteValueRef = useRef(routeValue)
    const validScreenTextureUrlRef = useRef(getValidScreenTextureUrl(screenTextureUrl))
    const lightColor = DEFAULT_PROJECTOR_LIGHT_COLOR
    const validScreenTextureUrl = getValidScreenTextureUrl(screenTextureUrl)
    const enableCameraMovement = true

    useEffect(() => {
        onScreenClickRef.current = onScreenClick
    }, [onScreenClick])

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
            setLayerVisibility(experienceCoreLayerRef, false)
            setLayerVisibility(experienceDecorativeLayerRef, false)
            hideExperienceRouteTimeoutRef.current = 0
        }, ROUTE_LAYER_HIDE_DELAY_MS)
    }

    const scheduleProjectRouteHide = () => {
        window.clearTimeout(hideProjectRouteTimeoutRef.current)
        hideProjectRouteTimeoutRef.current = window.setTimeout(() => {
            setLayerVisibility(projectCoreLayerRef, false)
            hideProjectRouteTimeoutRef.current = 0
        }, ROUTE_LAYER_HIDE_DELAY_MS)
    }

    const setLayerVisibility = (layerRef, isVisible) => {
        const layerState = layerRef.current
        layerState.visibilityState = isVisible
            ? LAYER_VISIBILITY_STATE.visible
            : LAYER_VISIBILITY_STATE.hidden

        if (!layerState.group) {
            return
        }

        layerState.group.visible = isVisible
    }

    const beginLayerLoad = (layerRef) => {
        layerRef.current.loadState = LAYER_LOAD_STATE.loading
    }

    const completeLayerLoad = (layerRef) => {
        layerRef.current.loadState = LAYER_LOAD_STATE.loaded
    }

    const isLayerLoaded = (layerRef) => layerRef.current.loadState === LAYER_LOAD_STATE.loaded

    const isLayerLoading = (layerRef) => layerRef.current.loadState === LAYER_LOAD_STATE.loading

    const createResolvedLayerPromise = (layerRef) => {
        completeLayerLoad(layerRef)
        layerRef.current.loadingPromise = Promise.resolve()
        return layerRef.current.loadingPromise
    }

    const isMobileDecorativeViewport = () => {
        const viewportWidth = canvasRef.current?.clientWidth ?? window.innerWidth
        return viewportWidth < MOBILE_DECORATIVE_VIEWPORT_WIDTH
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
        const isMobileViewport = isMobileDecorativeViewport()
        const tableFigures = isMobileViewport
            ? null
            : buildTableFigures(group)
        const roomWallFigures = buildRoomWallFigures(group, {
            includeNames: isMobileViewport ? ["shelf"] : undefined
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
            getOnScreenClick: () => onScreenClickRef.current
        })

        const animate = () => {
            projectorRigRef.current?.update()
            renderer.render(scene, camera)
            animationFrameId = window.requestAnimationFrame(animate)
        }

        responsiveCameraController.resize()

        if (routeValueRef.current === CAMERA_VIEW.experience) {
            ensureExperienceCoreLayerLoaded()
            setLayerVisibility(experienceCoreLayerRef, true)
            decorativeLoadTimeoutRef.current = window.setTimeout(() => {
                ensureExperienceDecorativeLayerLoaded()
                setLayerVisibility(experienceDecorativeLayerRef, true)
            }, EXPERIENCE_DECORATIVE_LOAD_DELAY_MS)
        } else if (routeValueRef.current === CAMERA_VIEW.projects) {
            ensureProjectCoreLayerLoaded()
            setLayerVisibility(projectCoreLayerRef, true)
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
            sharedCoreLayerRef.current.handles.ambientLight?.dispose?.()
            sharedCoreLayerRef.current.handles.room?.dispose?.()
            experienceCoreLayerRef.current.handles.tableSpotLight?.dispose?.()
            experienceCoreLayerRef.current.handles.resume?.dispose?.()
            experienceCoreLayerRef.current.handles.leatherDeskPad?.dispose?.()
            experienceCoreLayerRef.current.handles.table?.dispose?.()
            experienceDecorativeLayerRef.current.handles.tableFigures?.dispose?.()
            experienceDecorativeLayerRef.current.handles.roomWallFigures?.dispose?.()
            projectCoreLayerRef.current.handles.projectorModel?.dispose?.()
            projectCoreLayerRef.current.handles.projectorRig?.dispose?.()
            projectCoreLayerRef.current.handles.pedestal?.dispose?.()

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
            sharedCoreLayerRef.current = createLayerState()
            experienceCoreLayerRef.current = createLayerState()
            experienceDecorativeLayerRef.current = createLayerState()
            projectCoreLayerRef.current = createLayerState()
        }
    }, [lightColor])

    useEffect(() => {
        if (!sceneRef.current) {
            return
        }

        clearDecorativeLoadTimeout()
        clearRouteHideTimeouts()
        const previousRouteValue = previousRouteValueRef.current
        const isRouteTransition = previousRouteValue && previousRouteValue !== routeValue

        if (routeValue === CAMERA_VIEW.experience) {
            ensureExperienceCoreLayerLoaded()
            setLayerVisibility(experienceCoreLayerRef, true)
            if (!isRouteTransition) {
                setLayerVisibility(projectCoreLayerRef, false)
            } else if (previousRouteValue === CAMERA_VIEW.projects) {
                scheduleProjectRouteHide()
            }
            decorativeLoadTimeoutRef.current = window.setTimeout(() => {
                ensureExperienceDecorativeLayerLoaded()
                setLayerVisibility(experienceDecorativeLayerRef, true)
            }, EXPERIENCE_DECORATIVE_LOAD_DELAY_MS)
            return
        }

        if (routeValue === CAMERA_VIEW.projects) {
            ensureProjectCoreLayerLoaded()
            setLayerVisibility(projectCoreLayerRef, true)
            if (!isRouteTransition) {
                setLayerVisibility(experienceCoreLayerRef, false)
                setLayerVisibility(experienceDecorativeLayerRef, false)
            } else if (previousRouteValue === CAMERA_VIEW.experience) {
                scheduleExperienceRouteHide()
            }
        }

        return () => {
            clearDecorativeLoadTimeout()
            clearRouteHideTimeouts()
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

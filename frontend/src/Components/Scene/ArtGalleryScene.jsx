import { useEffect, useRef } from "react"
import * as THREE from "three"
import { createCamera } from "./scene/createCamera"
import { buildRoom } from "./scene/environment/buildRoom"
import { buildPedestal } from "./scene/environment/buildPedestal"
import { buildTable } from "./scene/environment/buildTable"
import { buildAmbientLight } from "./scene/lighting/buildAmbientLight"
import { buildProjectorRig } from "./scene/lighting/buildProjectorRig"
import { buildTableSpotLight } from "./scene/lighting/buildTableSpotLight"
import { buildProjectionScreen } from "./scene/projection/buildProjectionScreen"
import { createResponsiveCameraController } from "./scene/createResponsiveCameraController"
import { createPointerInteractionController } from "./scene/createPointerInteractionController"
import { createMovementController } from "./scene/createMovementController"
// import { createCameraDebugVisuals } from "./scene/createCameraDebugVisuals"
import { DEFAULT_PROJECTOR_LIGHT_COLOR, getValidScreenTextureUrl } from "./scene/sceneConfig"
import { createProjectorModel } from "./scene/loadProjectorModel"
import { CAMERA_VIEW, getResponsiveCameraState, interpolateCameraPosition } from "./scene/cameraConfig"

const CAMERA_TRANSITION_DURATION_MS = 700

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
    const pedestalRef = useRef(null)
    const tableRef = useRef(null)
    const onScreenClickRef = useRef(onScreenClick)
    const routeValueRef = useRef(routeValue)
    const previousRouteValueRef = useRef(routeValue)
    const lightColor = DEFAULT_PROJECTOR_LIGHT_COLOR
    const validScreenTextureUrl = getValidScreenTextureUrl(screenTextureUrl)
    const enableCameraMovement = true

    useEffect(() => {
        onScreenClickRef.current = onScreenClick
    }, [onScreenClick])

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

    // initialize and render the 3D scene once
    useEffect(() => {
        const enableAxesDebug = false

        const container = canvasRef.current

        if (!container) {
            return
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color("#000000")
        sceneRef.current = scene

        const camera = createCamera(routeValueRef.current)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1
        container.appendChild(renderer.domElement)
        rendererRef.current = renderer

        const room = buildRoom(scene)
        const ambientLight = buildAmbientLight(scene)
        const tableSpotLight = buildTableSpotLight(scene)
        const projectorRig = buildProjectorRig(scene, lightColor)
        projectorRigRef.current = projectorRig
        const pedestal = buildPedestal(scene)
        pedestalRef.current = pedestal
        const table = buildTable(scene)
        tableRef.current = table
        const debugAxes = enableAxesDebug ? new THREE.AxesHelper(4) : null
        if (debugAxes) {
            scene.add(debugAxes)
        }
        // const cameraDebugVisuals = createCameraDebugVisuals(scene)
        const pressedKeys = pressedKeysRef.current
        const initialForward = new THREE.Vector3()
        camera.getWorldDirection(initialForward)
        cameraRotationRef.current = {
            yaw: Math.atan2(-initialForward.x, -initialForward.z),
            pitch: Math.asin(THREE.MathUtils.clamp(initialForward.y, -1, 1))
        }
        let animationFrameId = 0
        const projectorModel = createProjectorModel(scene)
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
            // cameraDebugVisuals.update(camera)
            projectorRig.update()
            renderer.render(scene, camera)
            animationFrameId = window.requestAnimationFrame(animate)
        }

        responsiveCameraController.resize()
        // cameraDebugVisuals.update(camera)
        animationFrameId = window.requestAnimationFrame(animate)

        return () => {
            pressedKeys.clear()
            window.cancelAnimationFrame(animationFrameId)
            window.cancelAnimationFrame(cameraTransitionFrameRef.current)
            responsiveCameraController.dispose()
            pointerInteractionController.dispose()
            ambientLight?.dispose()
            tableSpotLight?.dispose()
            projectorRig.dispose()
            projectionScreenRef.current?.dispose()
            projectorModel.dispose()
            pedestal.dispose()
            table.dispose()
            room.dispose()
            // cameraDebugVisuals.dispose()
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

            cameraRef.current = null
            sceneRef.current = null
            rendererRef.current = null
            projectorRigRef.current = null
            projectionScreenRef.current = null
            responsiveCameraControllerRef.current = null
            cameraTransitionFrameRef.current = 0
            pedestalRef.current = null
            tableRef.current = null
        }
    }, [lightColor])

    useEffect(() => {
        const scene = sceneRef.current
        const projectorRig = projectorRigRef.current

        if (!scene || !projectorRig) {
            return
        }

        projectionScreenRef.current?.dispose()
        projectionScreenRef.current = null

        if (!validScreenTextureUrl) {
            return
        }

        projectionScreenRef.current = buildProjectionScreen(scene, validScreenTextureUrl, {
            onTextureAnalyzed: (analysis) => {
                projectorRig.applyAdaptiveTargets(analysis)
            }
        })

        return () => {
            projectionScreenRef.current?.dispose()
            projectionScreenRef.current = null
        }
    }, [validScreenTextureUrl])

    // user input handling for camera movement
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

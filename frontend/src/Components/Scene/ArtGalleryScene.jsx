import { useEffect, useRef } from "react"
import * as THREE from "three"
import { createCamera } from "./scene/createCamera"
import { buildRoom } from "./scene/environment/buildRoom"
import { buildPedestal } from "./scene/environment/buildPedestal"
import { buildAmbientLight } from "./scene/lighting/buildAmbientLight"
import { buildProjectorRig } from "./scene/lighting/buildProjectorRig"
import { buildProjectionScreen } from "./scene/projection/buildProjectionScreen"
import { createResponsiveCameraController } from "./scene/createResponsiveCameraController"
import { createPointerInteractionController } from "./scene/createPointerInteractionController"
import { createMovementController } from "./scene/createMovementController"
// import { createCameraDebugVisuals } from "./scene/createCameraDebugVisuals"
import { DEFAULT_PROJECTOR_LIGHT_COLOR, getValidScreenTextureUrl } from "./scene/sceneConfig"
import { createProjectorModel } from "./scene/loadProjectorModel"

const ArtGalleryScene = ({ className = "", screenTextureUrl, onScreenClick }) => {
    const canvasRef = useRef(null)
    const cameraRef = useRef(null)
    const pressedKeysRef = useRef(new Set())
    const cameraRotationRef = useRef({ yaw: 0, pitch: 0 })
    const sceneRef = useRef(null)
    const rendererRef = useRef(null)
    const projectorRigRef = useRef(null)
    const projectionScreenRef = useRef(null)
    const onScreenClickRef = useRef(onScreenClick)
    const lightColor = DEFAULT_PROJECTOR_LIGHT_COLOR
    const validScreenTextureUrl = getValidScreenTextureUrl(screenTextureUrl)
    const enableCameraMovement = false

    useEffect(() => {
        onScreenClickRef.current = onScreenClick
    }, [onScreenClick])

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

        const camera = createCamera()
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1
        container.appendChild(renderer.domElement)
        rendererRef.current = renderer

        const room = buildRoom(scene)
        const ambientLight = buildAmbientLight(scene)
        const projectorRig = buildProjectorRig(scene, lightColor)
        projectorRigRef.current = projectorRig
        const pedestal = buildPedestal(scene)
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
        const responsiveCameraController = createResponsiveCameraController({ camera, renderer, container })
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
            responsiveCameraController.dispose()
            pointerInteractionController.dispose()
            ambientLight?.dispose()
            projectorRig.dispose()
            projectionScreenRef.current?.dispose()
            projectorModel.dispose()
            pedestal.dispose()
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

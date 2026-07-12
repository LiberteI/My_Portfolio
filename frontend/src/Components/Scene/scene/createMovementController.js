import * as THREE from "three"

export const createMovementController = ({
    container,
    cameraRef,
    cameraRotationRef,
    pressedKeysRef
}) => {
    const moveSpeed = 6
    const lookSensitivity = 0.0025
    const pressedKeys = pressedKeysRef.current
    const clock = new THREE.Clock()
    let animationFrameId = 0

    const handleKeyDown = (event) => {
        pressedKeysRef.current.add(event.code)
    }

    const handleKeyUp = (event) => {
        pressedKeysRef.current.delete(event.code)
    }

    const handleCanvasMouseDown = (event) => {
        if (event.button !== 0) {
            return
        }

        const camera = cameraRef.current

        if (!camera) {
            return
        }

        const lookDirection = new THREE.Vector3()
        camera.getWorldDirection(lookDirection)

        console.log("Camera params", {
            fov: camera.fov,
            aspect: camera.aspect,
            near: camera.near,
            far: camera.far,
            position: {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z
            },
            rotation: {
                x: camera.rotation.x,
                y: camera.rotation.y,
                z: camera.rotation.z
            },
            lookDirection: {
                x: lookDirection.x,
                y: lookDirection.y,
                z: lookDirection.z
            }
        })

        container.requestPointerLock?.()
    }

    const handleMouseMove = (event) => {
        const camera = cameraRef.current

        if (!camera || document.pointerLockElement !== container) {
            return
        }

        const nextRotation = cameraRotationRef.current
        nextRotation.yaw -= event.movementX * lookSensitivity
        nextRotation.pitch -= event.movementY * lookSensitivity
        nextRotation.pitch = THREE.MathUtils.clamp(nextRotation.pitch, -1.45, 1.45)
        camera.rotation.y = nextRotation.yaw
        camera.rotation.x = nextRotation.pitch
        camera.rotation.z = 0
    }

    const animateMovement = () => {
        const camera = cameraRef.current

        if (camera) {
            const delta = clock.getDelta()
            const forward = new THREE.Vector3()
            camera.getWorldDirection(forward)
            const forwardFlat = new THREE.Vector3(forward.x, 0, forward.z)
            const right = new THREE.Vector3(-forwardFlat.z, 0, forwardFlat.x)
            const movement = new THREE.Vector3()

            if (forwardFlat.lengthSq() > 0) {
                forwardFlat.normalize()
            }

            if (right.lengthSq() > 0) {
                right.normalize()
            }

            if (pressedKeysRef.current.has("KeyW")) {
                movement.add(forwardFlat)
            }
            if (pressedKeysRef.current.has("KeyS")) {
                movement.sub(forwardFlat)
            }
            if (pressedKeysRef.current.has("KeyA")) {
                movement.sub(right)
            }
            if (pressedKeysRef.current.has("KeyD")) {
                movement.add(right)
            }
            if (pressedKeysRef.current.has("ArrowUp")) {
                movement.y += 1
            }
            if (pressedKeysRef.current.has("ArrowDown")) {
                movement.y -= 1
            }

            if (movement.lengthSq() > 0) {
                movement.normalize().multiplyScalar(moveSpeed * delta)
                camera.position.add(movement)
            }
        }

        animationFrameId = window.requestAnimationFrame(animateMovement)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mousedown", handleCanvasMouseDown)
    animationFrameId = window.requestAnimationFrame(animateMovement)

    return {
        dispose() {
            pressedKeys.clear()
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
            window.removeEventListener("mousemove", handleMouseMove)
            container.removeEventListener("mousedown", handleCanvasMouseDown)
            window.cancelAnimationFrame(animationFrameId)
        }
    }
}

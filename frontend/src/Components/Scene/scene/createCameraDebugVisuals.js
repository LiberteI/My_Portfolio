import * as THREE from "three"

export const createCameraDebugVisuals = (scene) => {
    const markerMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" })
    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        markerMaterial
    )
    scene.add(marker)

    const lineMaterial = new THREE.LineBasicMaterial({ color: "#facc15" })
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(54)
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3))
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lineSegments)

    return {
        update(camera) {
            const viewRange = 6
            const up = new THREE.Vector3(0, 1, 0)
            const forward = new THREE.Vector3()
            camera.getWorldDirection(forward)
            const right = new THREE.Vector3().crossVectors(forward, up).normalize()
            const viewUp = new THREE.Vector3().crossVectors(right, forward).normalize()
            const farCenter = new THREE.Vector3().copy(camera.position).addScaledVector(forward, viewRange)
            const farHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * viewRange
            const farWidth = farHeight * camera.aspect
            const halfFarWidth = farWidth / 2
            const halfFarHeight = farHeight / 2

            const topLeft = new THREE.Vector3()
                .copy(farCenter)
                .addScaledVector(right, -halfFarWidth)
                .addScaledVector(viewUp, halfFarHeight)
            const topRight = new THREE.Vector3()
                .copy(farCenter)
                .addScaledVector(right, halfFarWidth)
                .addScaledVector(viewUp, halfFarHeight)
            const bottomRight = new THREE.Vector3()
                .copy(farCenter)
                .addScaledVector(right, halfFarWidth)
                .addScaledVector(viewUp, -halfFarHeight)
            const bottomLeft = new THREE.Vector3()
                .copy(farCenter)
                .addScaledVector(right, -halfFarWidth)
                .addScaledVector(viewUp, -halfFarHeight)

            marker.position.copy(camera.position)

            const points = [
                camera.position, farCenter,
                camera.position, topLeft,
                camera.position, topRight,
                camera.position, bottomRight,
                camera.position, bottomLeft,
                topLeft, topRight,
                topRight, bottomRight,
                bottomRight, bottomLeft,
                bottomLeft, topLeft
            ]

            points.forEach((point, index) => {
                const offset = index * 3
                linePositions[offset] = point.x
                linePositions[offset + 1] = point.y
                linePositions[offset + 2] = point.z
            })

            lineGeometry.attributes.position.needsUpdate = true
        },
        dispose() {
            scene.remove(marker)
            scene.remove(lineSegments)
            marker.geometry.dispose()
            markerMaterial.dispose()
            lineGeometry.dispose()
            lineMaterial.dispose()
        }
    }
}

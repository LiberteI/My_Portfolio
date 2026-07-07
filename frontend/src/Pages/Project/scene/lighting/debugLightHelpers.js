import * as THREE from "three"

export const createSpotLightDebugger = (scene, light, debugConfig) => {
    if (!debugConfig?.enabled || !light) {
        return null
    }

    const markerMaterial = new THREE.MeshBasicMaterial({
        color: debugConfig.color,
        transparent: true,
        opacity: debugConfig.markerOpacity,
        depthWrite: false
    })
    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(
            debugConfig.markerRadius,
            debugConfig.sphereWidthSegments,
            debugConfig.sphereHeightSegments
        ),
        markerMaterial
    )
    marker.position.copy(light.position)
    scene.add(marker)

    const targetMarkerMaterial = new THREE.MeshBasicMaterial({
        color: debugConfig.targetColor,
        transparent: true,
        opacity: debugConfig.targetMarkerOpacity,
        depthWrite: false
    })
    const targetMarker = new THREE.Mesh(
        new THREE.SphereGeometry(
            debugConfig.targetMarkerRadius,
            debugConfig.sphereWidthSegments,
            debugConfig.sphereHeightSegments
        ),
        targetMarkerMaterial
    )
    const targetPosition = new THREE.Vector3()
    light.target?.getWorldPosition(targetPosition)
    targetMarker.position.copy(targetPosition)
    scene.add(targetMarker)

    const rangeDistance = light.distance > 0 ? light.distance : debugConfig.fallbackDistance
    const coneRadius = Math.tan(light.angle) * rangeDistance
    const tip = new THREE.Vector3(0, 0, 0)
    const frontTopLeft = new THREE.Vector3(-coneRadius, coneRadius, -rangeDistance)
    const frontTopRight = new THREE.Vector3(coneRadius, coneRadius, -rangeDistance)
    const frontBottomRight = new THREE.Vector3(coneRadius, -coneRadius, -rangeDistance)
    const frontBottomLeft = new THREE.Vector3(-coneRadius, -coneRadius, -rangeDistance)
    const rangeGeometry = new THREE.BufferGeometry().setFromPoints([
        tip, frontTopLeft,
        tip, frontTopRight,
        tip, frontBottomRight,
        tip, frontBottomLeft,
        frontTopLeft, frontTopRight,
        frontTopRight, frontBottomRight,
        frontBottomRight, frontBottomLeft,
        frontBottomLeft, frontTopLeft
    ])
    const rangeMaterial = new THREE.LineBasicMaterial({
        color: debugConfig.color,
        transparent: true,
        opacity: debugConfig.sphereOpacity
    })
    const range = new THREE.LineSegments(rangeGeometry, rangeMaterial)
    range.position.copy(light.position)
    range.quaternion.copy(light.quaternion)
    scene.add(range)

    return {
        marker,
        markerMaterial,
        targetMarker,
        targetMarkerMaterial,
        range,
        rangeGeometry,
        rangeMaterial,
        dispose() {
            scene.remove(marker)
            scene.remove(targetMarker)
            scene.remove(range)
            marker.geometry.dispose()
            markerMaterial.dispose()
            targetMarker.geometry.dispose()
            targetMarkerMaterial.dispose()
            rangeGeometry.dispose()
            rangeMaterial.dispose()
        }
    }
}

export const createPointLightDebugger = (scene, light, debugConfig) => {
    if (!debugConfig?.enabled || !light) {
        return null
    }

    const markerMaterial = new THREE.MeshBasicMaterial({
        color: debugConfig.color,
        transparent: true,
        opacity: debugConfig.markerOpacity,
        depthWrite: false
    })
    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(
            debugConfig.markerRadius,
            debugConfig.sphereWidthSegments,
            debugConfig.sphereHeightSegments
        ),
        markerMaterial
    )
    marker.position.copy(light.position)
    scene.add(marker)

    const rangeRadius = light.distance > 0 ? light.distance : debugConfig.fallbackDistance
    const rangeGeometry = new THREE.WireframeGeometry(
        new THREE.SphereGeometry(
            rangeRadius,
            debugConfig.sphereWidthSegments,
            debugConfig.sphereHeightSegments
        )
    )
    const rangeMaterial = new THREE.LineBasicMaterial({
        color: debugConfig.color,
        transparent: true,
        opacity: debugConfig.sphereOpacity
    })
    const range = new THREE.LineSegments(rangeGeometry, rangeMaterial)
    range.position.copy(light.position)
    scene.add(range)

    return {
        marker,
        markerMaterial,
        range,
        rangeGeometry,
        rangeMaterial,
        dispose() {
            scene.remove(marker)
            scene.remove(range)
            marker.geometry.dispose()
            markerMaterial.dispose()
            rangeGeometry.dispose()
            rangeMaterial.dispose()
        }
    }
}

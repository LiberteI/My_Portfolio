import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import projectorModelUrl from "../../../assets/Projector/generic_white_digital_projector.glb"
import { getDisplayPositions } from "./sceneConfig"

export const createProjectorModel = (scene) => {
    const { projectorPosition } = getDisplayPositions()
    const projectorScale = 0.25
    const projectorRotationY = Math.PI
    const loader = new GLTFLoader()
    let projector = null
    let disposed = false

    const disposeProjector = (projectorNode) => {
        projectorNode.traverse((child) => {
            if (!child.isMesh) {
                return
            }

            child.geometry?.dispose()

            if (Array.isArray(child.material)) {
                child.material.forEach((material) => material?.dispose())
            } else {
                child.material?.dispose()
            }
        })
    }

    const loadPromise = loader.loadAsync(projectorModelUrl)
        .then((gltf) => {
            if (disposed) {
                disposeProjector(gltf.scene)
                return null
            }

            projector = gltf.scene

            projector.traverse((child) => {
                if (!child.isMesh) {
                    return
                }

                child.castShadow = true
                child.receiveShadow = true

                const originalMaterials = Array.isArray(child.material) ? child.material : [child.material]
                const upgradedMaterials = originalMaterials.map((sourceMaterial) => {
                    if (!sourceMaterial) {
                        return sourceMaterial
                    }

                    return new THREE.MeshPhysicalMaterial({
                        name: sourceMaterial.name,
                        color: sourceMaterial.color?.clone() ?? new THREE.Color("#d9d9d9"),
                        map: sourceMaterial.map ?? null,
                        normalMap: sourceMaterial.normalMap ?? null,
                        roughnessMap: sourceMaterial.roughnessMap ?? null,
                        metalnessMap: sourceMaterial.metalnessMap ?? null,
                        aoMap: sourceMaterial.aoMap ?? null,
                        emissiveMap: sourceMaterial.emissiveMap ?? null,
                        emissive: sourceMaterial.emissive?.clone() ?? new THREE.Color("#000000"),
                        emissiveIntensity: sourceMaterial.emissiveIntensity ?? 1,
                        transparent: sourceMaterial.transparent ?? false,
                        opacity: sourceMaterial.opacity ?? 1,
                        alphaTest: sourceMaterial.alphaTest ?? 0,
                        side: sourceMaterial.side ?? THREE.FrontSide,
                        roughness: Math.min(sourceMaterial.roughness ?? 0.55, 0.42),
                        metalness: Math.max(sourceMaterial.metalness ?? 0.1, 0.68),
                        envMapIntensity: 0.8,
                        clearcoat: 0.22,
                        clearcoatRoughness: 0.35
                    })
                })

                child.material = Array.isArray(child.material) ? upgradedMaterials : upgradedMaterials[0]
                originalMaterials.forEach((material) => material?.dispose())
            })

            projector.position.set(projectorPosition.x, projectorPosition.y, projectorPosition.z)
            projector.scale.setScalar(projectorScale)
            projector.rotation.y = projectorRotationY
            scene.add(projector)

            return projector
        })
        .catch((error) => {
            console.error("Failed to load projector model", error)
            return null
        })

    return {
        loadPromise,
        dispose() {
            disposed = true

            if (projector) {
                scene.remove(projector)
                disposeProjector(projector)
            }
        }
    }
}

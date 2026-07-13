import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import pianoModelUrl from "../../../../assets/Meshes/dusty_old_piano.glb"
import shelfModelUrl from "../../../../assets/Meshes/shelf.glb"
import titanicLampModelUrl from "../../../../assets/Meshes/titanic_lamp.glb"
import { getRoomBounds } from "../sceneConfig"

const roomWallFigureConfigs = [
    {
        name: "piano",
        modelUrl: pianoModelUrl,
        zOffset: 20,
        yOffset: 0,
        xInset: 2,
        targetHeight: 4,
        rotationY: 0
    },
    {
        name: "shelf",
        modelUrl: shelfModelUrl,
        zOffset: 14,
        yOffset: 0,
        xInset: 1,
        targetHeight: 8,
        rotationY: 0
    },
    {
        name: "titanicLamp",
        modelUrl: titanicLampModelUrl,
        zOffset: 20,
        yOffset: 4,
        xInset: 0.7,
        targetHeight: 0.7,
        rotationY: Math.PI * 0.15,
        pointLight: {
            color: "#ffd59a",
            intensity: 2.8,
            distance: 7,
            decay: 1.5,
            xOffset: 0,
            yOffset: 0.75,
            zOffset: 0
        }
    }
]

const disposeSceneNode = (sceneNode) => {
    sceneNode.traverse((child) => {
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

const createNormalizedWallPivotGroup = (model, config) => {
    const pivotGroup = new THREE.Group()
    const roomBounds = getRoomBounds()
    const box = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3()
    box.getSize(size)

    if (size.y > 0) {
        const scale = config.targetHeight / size.y
        model.scale.setScalar(scale)
    }

    model.updateMatrixWorld(true)

    const scaledBox = new THREE.Box3().setFromObject(model)
    const scaledCenter = new THREE.Vector3()
    const scaledSize = new THREE.Vector3()
    scaledBox.getCenter(scaledCenter)
    scaledBox.getSize(scaledSize)

    const bottomY = scaledCenter.y - scaledSize.y * 0.5
    model.position.set(
        -scaledCenter.x,
        -bottomY,
        -scaledCenter.z
    )

    pivotGroup.position.set(
        roomBounds.xStart + config.xInset,
        roomBounds.yStart + (config.yOffset ?? 0),
        config.zOffset
    )
    pivotGroup.rotation.y = config.rotationY
    pivotGroup.add(model)

    return pivotGroup
}

export const buildRoomWallFigures = (scene) => {
    const loader = new GLTFLoader()
    let disposed = false
    const loadedFigures = []

    const loadPromise = Promise.all(
        roomWallFigureConfigs.map((config) => (
            loader.loadAsync(config.modelUrl)
                .then((gltf) => {
                    if (disposed) {
                        disposeSceneNode(gltf.scene)
                        return null
                    }

                    const model = gltf.scene
                    model.name = config.name

                    model.traverse((child) => {
                        if (!child.isMesh) {
                            return
                        }

                        child.castShadow = true
                        child.receiveShadow = true
                    })

                    const pivotGroup = createNormalizedWallPivotGroup(model, config)
                    pivotGroup.name = `${config.name}WallPivot`

                    if (config.pointLight) {
                        const pointLight = new THREE.PointLight(
                            config.pointLight.color,
                            config.pointLight.intensity,
                            config.pointLight.distance,
                            config.pointLight.decay
                        )
                        pointLight.position.set(
                            config.pointLight.xOffset ?? 0,
                            config.pointLight.yOffset ?? 0,
                            config.pointLight.zOffset ?? 0
                        )
                        pivotGroup.add(pointLight)
                    }

                    scene.add(pivotGroup)
                    loadedFigures.push({ pivotGroup, model })

                    return pivotGroup
                })
                .catch((error) => {
                    console.error(`Failed to load room wall figure: ${config.name}`, error)
                    return null
                })
        ))
    )

    return {
        loadPromise,
        dispose() {
            disposed = true

            loadedFigures.forEach(({ pivotGroup, model }) => {
                scene.remove(pivotGroup)
                disposeSceneNode(model)
            })
        }
    }
}

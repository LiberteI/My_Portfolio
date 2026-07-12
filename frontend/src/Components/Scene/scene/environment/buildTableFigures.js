import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import winnieThePoohModelUrl from "../../../../assets/Meshes/winnie_the_pooh.glb"
import presidentXiJingPingModelUrl from "../../../../assets/Meshes/president_xi_jing_ping.glb"
import beethovenModelUrl from "../../../../assets/Meshes/ludwig_van_beethoven.glb"
import flowerPotModelUrl from "../../../../assets/Meshes/flower_pot.glb"
import { getDisplayPositions, getTableConfig } from "../sceneConfig"

const tableFigureConfigs = [
    {
        name: "winnieThePooh",
        modelUrl: winnieThePoohModelUrl,
        xOffset: 0,
        yOffset: 0,
        zOffset: 1.2,
        targetHeight: 0.3,
        rotationY: Math.PI * 0.6
    },
    {
        name: "presidentXiJingPing",
        modelUrl: presidentXiJingPingModelUrl,
        xOffset: -0.2,
        yOffset: 0.22,
        zOffset: 1.5,
        targetHeight: 0.6,
        rotationY: Math.PI * 0.7
    },
    {
        name: "beethoven",
        modelUrl: beethovenModelUrl,
        xOffset: -1,
        yOffset: 0,
        zOffset: 1.4,
        targetHeight: 1.6,
        rotationY: Math.PI * 0.7
    },
    {
        name: "flowerPot",
        modelUrl: flowerPotModelUrl,
        xOffset: -0.2,
        yOffset: 0,
        zOffset: 1.5,
        targetHeight: 0.42,
        rotationY: Math.PI * 0.1
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

const createNormalizedPivotGroup = (model, config) => {
    const pivotGroup = new THREE.Group()
    const { tablePosition } = getDisplayPositions()
    const tableConfig = getTableConfig()
    const box = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

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

    const tableTopSurfaceY = tablePosition.y + tableConfig.height + tableConfig.topThickness * 0.5
    const bottomY = scaledCenter.y - scaledSize.y * 0.5

    model.position.set(
        -scaledCenter.x,
        -bottomY,
        -scaledCenter.z
    )

    pivotGroup.position.set(
        tablePosition.x + config.xOffset,
        tableTopSurfaceY + 0.01 + (config.yOffset ?? 0),
        tablePosition.z + config.zOffset
    )
    pivotGroup.rotation.y = config.rotationY
    pivotGroup.add(model)

    return pivotGroup
}

export const buildTableFigures = (scene) => {
    const loader = new GLTFLoader()
    let disposed = false
    const loadedFigures = []

    const loadPromise = Promise.all(
        tableFigureConfigs.map((config) => (
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

                    const pivotGroup = createNormalizedPivotGroup(model, config)
                    pivotGroup.name = `${config.name}Pivot`
                    scene.add(pivotGroup)
                    loadedFigures.push({ pivotGroup, model })

                    return pivotGroup
                })
                .catch((error) => {
                    console.error(`Failed to load table figure: ${config.name}`, error)
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

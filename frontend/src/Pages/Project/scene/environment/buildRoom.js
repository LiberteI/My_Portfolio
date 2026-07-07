import * as THREE from "three"
import museumWallTextureUrl from "../../../../assets/Museum/wall-texture.jpg"
import museumFloorTextureUrl from "../../../../assets/Museum/floor-texture.jpg"
import { getProjectionFrameConfig } from "../sceneConfig"
import {
    applyMaterialResponse,
    cloneUvAttribute,
    configureRepeatingTexture,
    createMaterialResponseMaps
} from "./materialResponse"

export const buildRoom = (scene) => {
    const roomXStart = -30
    const roomXEnd = 30
    const roomYStart = -7.5
    const roomYEnd = 7.5
    const roomZStart = -7
    const roomZEnd = 30
    const projectionFrame = getProjectionFrameConfig()
    const projectionFrameZ = roomZStart + 0.02

    const roomWidth = roomXEnd - roomXStart
    const roomHeight = roomYEnd - roomYStart
    const roomDepth = roomZEnd - roomZStart
    const roomXCenter = (roomXStart + roomXEnd) / 2
    const roomYCenter = (roomYStart + roomYEnd) / 2
    const roomZCenter = (roomZStart + roomZEnd) / 2
    const textureLoader = new THREE.TextureLoader()
    const materialResponseTextures = []
    let wallMaterial
    let floorMaterial
    let ceilingMaterial
    let backWallMaterial

    const wallTexture = textureLoader.load(museumWallTextureUrl, (loadedTexture) => {
        const wallMaps = createMaterialResponseMaps(loadedTexture, {
            normalStrength: 2.1,
            roughnessMin: 0.58,
            roughnessMax: 0.96,
            aoStrength: 0.7
        })

        if (!wallMaps) {
            return
        }

        materialResponseTextures.push(wallMaps.roughnessMap, wallMaps.aoMap, wallMaps.normalMap)

        applyMaterialResponse(wallMaterial, wallMaps, {
            roughness: 0.86,
            metalness: 0.04,
            normalScale: 0.95,
            aoMapIntensity: 0.95
        })
        applyMaterialResponse(backWallMaterial, wallMaps, {
            roughness: 0.84,
            metalness: 0.04,
            normalScale: 1,
            aoMapIntensity: 1
        })
        applyMaterialResponse(ceilingMaterial, wallMaps, {
            roughness: 0.9,
            metalness: 0.02,
            normalScale: 0.55,
            aoMapIntensity: 0.55
        })
    })
    const floorTexture = textureLoader.load(museumFloorTextureUrl, (loadedTexture) => {
        const floorMaps = createMaterialResponseMaps(loadedTexture, {
            normalStrength: 1.7,
            roughnessMin: 0.28,
            roughnessMax: 0.8,
            aoStrength: 0.5
        })

        if (!floorMaps) {
            return
        }

        materialResponseTextures.push(floorMaps.roughnessMap, floorMaps.aoMap, floorMaps.normalMap)

        applyMaterialResponse(floorMaterial, floorMaps, {
            roughness: 1,
            metalness: 0,
            normalScale: 0.1,
            aoMapIntensity: 0.7
        })
    })
    const ceilingTexture = textureLoader.load(museumWallTextureUrl)

    configureRepeatingTexture(wallTexture, 6, 2, THREE.SRGBColorSpace)
    configureRepeatingTexture(floorTexture, 6, 4, THREE.SRGBColorSpace)
    configureRepeatingTexture(ceilingTexture, 6, 4, THREE.SRGBColorSpace)

    wallMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture,
        side: THREE.DoubleSide,
        roughness: 0.88,
        metalness: 0
    })
    floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0
    })
    ceilingMaterial = new THREE.MeshStandardMaterial({
        map: ceilingTexture,
        side: THREE.DoubleSide,
        roughness: 0.92,
        metalness: 0.01
    })
    const backWallTexture = wallTexture.clone()
    configureRepeatingTexture(backWallTexture, 6, 2, THREE.SRGBColorSpace)
    backWallMaterial = new THREE.MeshStandardMaterial({
        map: backWallTexture,
        side: THREE.DoubleSide,
        roughness: 0.86,
        metalness: 0.03
    })

    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
    cloneUvAttribute(floorGeometry)
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(roomXCenter, roomYStart, roomZCenter)
    scene.add(floor)

    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
    cloneUvAttribute(ceilingGeometry)
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.set(roomXCenter, roomYEnd, roomZCenter)
    scene.add(ceiling)

    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
    cloneUvAttribute(backWallGeometry)
    const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial)
    backWall.position.set(roomXCenter, roomYCenter, roomZStart)
    scene.add(backWall)

    const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
    cloneUvAttribute(leftWallGeometry)
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.set(roomXStart, roomYCenter, roomZCenter)
    scene.add(leftWall)

    const rightWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
    cloneUvAttribute(rightWallGeometry)
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial)
    rightWall.rotation.y = -Math.PI / 2
    rightWall.position.set(roomXEnd, roomYCenter, roomZCenter)
    scene.add(rightWall)

    const frontWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
    cloneUvAttribute(frontWallGeometry)
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial)
    frontWall.rotation.y = Math.PI
    frontWall.position.set(roomXCenter, roomYCenter, roomZEnd)
    scene.add(frontWall)

    const projectionFrameMaterial = new THREE.LineBasicMaterial({ color: "#decdbb" })
    const projectionFrameGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(projectionFrame.xStart, projectionFrame.yStart, projectionFrameZ),
        new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yStart, projectionFrameZ),
        new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yEnd, projectionFrameZ),
        new THREE.Vector3(projectionFrame.xStart, projectionFrame.yEnd, projectionFrameZ)
    ])
    const projectionFrameOutline = new THREE.LineLoop(projectionFrameGeometry, projectionFrameMaterial)
    scene.add(projectionFrameOutline)

    const meshes = [floor, ceiling, backWall, leftWall, rightWall, frontWall]
    const materials = [wallMaterial, floorMaterial, ceilingMaterial, backWallMaterial]
    const textures = [wallTexture, floorTexture, ceilingTexture, backWallMaterial.map, ...materialResponseTextures]
    const lineGeometries = [projectionFrameGeometry]
    const lineMaterials = [projectionFrameMaterial]
    const lineObjects = [projectionFrameOutline]

    return {
        meshes,
        materials,
        textures,
        lineGeometries,
        lineMaterials,
        dispose() {
            meshes.forEach((mesh) => {
                scene.remove(mesh)
                mesh.geometry.dispose()
            })
            lineObjects.forEach((lineObject) => scene.remove(lineObject))
            materials.forEach((material) => material.dispose())
            textures.forEach((texture) => texture.dispose())
            lineGeometries.forEach((geometry) => geometry.dispose())
            lineMaterials.forEach((material) => material.dispose())
        }
    }
}

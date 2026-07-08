import * as THREE from "three"
import museumWallTextureUrl from "../../../../assets/Museum/compressed-img/wall-texture.webp"
import museumFloorTextureUrl from "../../../../assets/Museum/compressed-img/floor-texture.webp"
import wallAoMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/wall-ao.webp"
import wallNormalMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/wall-normal.webp"
import wallRoughnessMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/wall-roughness.webp"
import floorAoMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/floor-ao.webp"
import floorNormalMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/floor-normal.webp"
import floorRoughnessMapUrl from "../../../../assets/Museum/prebaked-tex/compressed-img/floor-roughness.webp"
import { getProjectionFrameConfig } from "../sceneConfig"
import {
    applyMaterialResponse,
    cloneUvAttribute,
    configureRepeatingTexture
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
    let wallMaterial
    let floorMaterial
    let ceilingMaterial
    let backWallMaterial

    const wallTexture = textureLoader.load(museumWallTextureUrl)
    const wallMaps = {
        roughnessMap: textureLoader.load(wallRoughnessMapUrl),
        aoMap: textureLoader.load(wallAoMapUrl),
        normalMap: textureLoader.load(wallNormalMapUrl)
    }
    const floorTexture = textureLoader.load(museumFloorTextureUrl)
    const floorMaps = {
        roughnessMap: textureLoader.load(floorRoughnessMapUrl),
        aoMap: textureLoader.load(floorAoMapUrl),
        normalMap: textureLoader.load(floorNormalMapUrl)
    }
    const ceilingTexture = textureLoader.load(museumWallTextureUrl)

    configureRepeatingTexture(wallTexture, 6, 2, THREE.SRGBColorSpace)
    configureRepeatingTexture(floorTexture, 6, 4, THREE.SRGBColorSpace)
    configureRepeatingTexture(ceilingTexture, 6, 4, THREE.SRGBColorSpace)
    configureRepeatingTexture(wallMaps.roughnessMap, 6, 2)
    configureRepeatingTexture(wallMaps.aoMap, 6, 2)
    configureRepeatingTexture(wallMaps.normalMap, 6, 2)
    configureRepeatingTexture(floorMaps.roughnessMap, 6, 4)
    configureRepeatingTexture(floorMaps.aoMap, 6, 4)
    configureRepeatingTexture(floorMaps.normalMap, 6, 4)

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
    applyMaterialResponse(floorMaterial, floorMaps, {
        roughness: 1,
        metalness: 0,
        normalScale: 0.1,
        aoMapIntensity: 0.7
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


    const projectionFrameGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(projectionFrame.xStart, projectionFrame.yStart, projectionFrameZ),
        new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yStart, projectionFrameZ),
        new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yEnd, projectionFrameZ),
        new THREE.Vector3(projectionFrame.xStart, projectionFrame.yEnd, projectionFrameZ)
    ])
    

    const meshes = [floor, ceiling, backWall, leftWall, rightWall, frontWall]
    const materials = [wallMaterial, floorMaterial, ceilingMaterial, backWallMaterial]
    const textures = [
        wallTexture,
        floorTexture,
        ceilingTexture,
        backWallMaterial.map,
        wallMaps.roughnessMap,
        wallMaps.aoMap,
        wallMaps.normalMap,
        floorMaps.roughnessMap,
        floorMaps.aoMap,
        floorMaps.normalMap
    ]
    const lineGeometries = [projectionFrameGeometry]
  

    return {
        meshes,
        materials,
        textures,
        lineGeometries,
        
        dispose() {
            meshes.forEach((mesh) => {
                scene.remove(mesh)
                mesh.geometry.dispose()
            })
            
            materials.forEach((material) => material.dispose())
            textures.forEach((texture) => texture.dispose())
            lineGeometries.forEach((geometry) => geometry.dispose())
            
        }
    }
}

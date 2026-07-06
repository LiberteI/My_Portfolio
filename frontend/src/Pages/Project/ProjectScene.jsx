import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import createBeamMaterial from "./shaders/createBeamMaterial"
import museumWallTextureUrl from "../../assets/Museum/wall-texture.jpg"
import museumFloorTextureUrl from "../../assets/Museum/floor-texture.jpg"
import projectorModelUrl from "../../assets/Projector/generic_white_digital_projector.glb"

const getProjectionFrameConfig = () => {
    return {
        xStart: -16,
        xEnd: 2,
        yStart: -6,
        yEnd: 5
    }
}

const getDisplayPositions = () => {
    const position = { x: -10, y: -6.5, z: 10 }

    return {
        position,
        boxPosition: { x: position.x, y: position.y, z: position.z },
        projectorPosition: { x: position.x, y: position.y+1.2, z: position.z },
        projectorBeamOrigin: { x: position.x-0.2, y: position.y+1.2, z: position.z-0.5 }
    }
}

const clamp01 = (value) => {
    return THREE.MathUtils.clamp(value, 0, 1)
}

const cloneUvAttribute = (geometry) => {
    const uvAttribute = geometry.getAttribute("uv")

    if (!uvAttribute) {
        return
    }

    const uvClone = uvAttribute.array.slice()
    geometry.setAttribute("uv1", new THREE.BufferAttribute(uvClone, 2))
    geometry.setAttribute("uv2", new THREE.BufferAttribute(uvClone.slice(), 2))
}

const configureRepeatingTexture = (texture, repeatX, repeatY, colorSpace = null) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeatX, repeatY)

    if (colorSpace) {
        texture.colorSpace = colorSpace
    }
}

const inheritTextureTransform = (texture, sourceTexture) => {
    texture.wrapS = sourceTexture.wrapS
    texture.wrapT = sourceTexture.wrapT
    texture.repeat.copy(sourceTexture.repeat)
    texture.offset.copy(sourceTexture.offset)
    texture.center.copy(sourceTexture.center)
    texture.rotation = sourceTexture.rotation
}

const createCanvasTexture = (canvas, sourceTexture) => {
    const texture = new THREE.CanvasTexture(canvas)
    inheritTextureTransform(texture, sourceTexture)
    return texture
}

const createMaterialResponseMaps = (
    sourceTexture,
    {
        normalStrength = 1,
        roughnessMin = 0.45,
        roughnessMax = 0.95,
        aoStrength = 0.45
    } = {}
) => {
    const sourceImage = sourceTexture.image

    if (!sourceImage) {
        return null
    }

    const sourceWidth = sourceImage.naturalWidth || sourceImage.videoWidth || sourceImage.width
    const sourceHeight = sourceImage.naturalHeight || sourceImage.videoHeight || sourceImage.height

    if (!sourceWidth || !sourceHeight) {
        return null
    }

    const targetMaxSize = 512
    const scale = Math.min(1, targetMaxSize / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(2, Math.round(sourceWidth * scale))
    const height = Math.max(2, Math.round(sourceHeight * scale))
    const sourceCanvas = document.createElement("canvas")
    sourceCanvas.width = width
    sourceCanvas.height = height
    const sourceContext = sourceCanvas.getContext("2d")
    sourceContext.drawImage(sourceImage, 0, 0, width, height)

    const { data: sourceData } = sourceContext.getImageData(0, 0, width, height)
    const luminance = new Float32Array(width * height)

    for (let index = 0; index < luminance.length; index += 1) {
        const colorIndex = index * 4
        const red = sourceData[colorIndex] / 255
        const green = sourceData[colorIndex + 1] / 255
        const blue = sourceData[colorIndex + 2] / 255
        luminance[index] = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    }

    const roughnessCanvas = document.createElement("canvas")
    roughnessCanvas.width = width
    roughnessCanvas.height = height
    const roughnessContext = roughnessCanvas.getContext("2d")
    const roughnessImage = roughnessContext.createImageData(width, height)

    const aoCanvas = document.createElement("canvas")
    aoCanvas.width = width
    aoCanvas.height = height
    const aoContext = aoCanvas.getContext("2d")
    const aoImage = aoContext.createImageData(width, height)

    const normalCanvas = document.createElement("canvas")
    normalCanvas.width = width
    normalCanvas.height = height
    const normalContext = normalCanvas.getContext("2d")
    const normalImage = normalContext.createImageData(width, height)

    const getLuminance = (x, y) => {
        const clampedX = THREE.MathUtils.clamp(x, 0, width - 1)
        const clampedY = THREE.MathUtils.clamp(y, 0, height - 1)
        return luminance[clampedY * width + clampedX]
    }

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const current = getLuminance(x, y)
            const left = getLuminance(x - 1, y)
            const right = getLuminance(x + 1, y)
            const up = getLuminance(x, y - 1)
            const down = getLuminance(x, y + 1)
            const neighborhoodAverage = (left + right + up + down) * 0.25
            const localContrast = Math.abs(current - neighborhoodAverage)
            const roughnessValue = clamp01(
                roughnessMin
                + (1 - current) * (roughnessMax - roughnessMin) * 0.65
                + localContrast * 0.9
            )
            const cavity = clamp01(
                (neighborhoodAverage - current) * aoStrength * 1.6
                + (1 - current) * aoStrength * 0.3
            )
            const aoValue = 1 - cavity
            const dx = (right - left) * normalStrength
            const dy = (down - up) * normalStrength
            const normal = new THREE.Vector3(-dx, -dy, 1).normalize()
            const pixelIndex = (y * width + x) * 4
            const roughnessChannel = Math.round(roughnessValue * 255)
            const aoChannel = Math.round(aoValue * 255)

            roughnessImage.data[pixelIndex] = roughnessChannel
            roughnessImage.data[pixelIndex + 1] = roughnessChannel
            roughnessImage.data[pixelIndex + 2] = roughnessChannel
            roughnessImage.data[pixelIndex + 3] = 255

            aoImage.data[pixelIndex] = aoChannel
            aoImage.data[pixelIndex + 1] = aoChannel
            aoImage.data[pixelIndex + 2] = aoChannel
            aoImage.data[pixelIndex + 3] = 255

            normalImage.data[pixelIndex] = Math.round((normal.x * 0.5 + 0.5) * 255)
            normalImage.data[pixelIndex + 1] = Math.round((normal.y * 0.5 + 0.5) * 255)
            normalImage.data[pixelIndex + 2] = Math.round((normal.z * 0.5 + 0.5) * 255)
            normalImage.data[pixelIndex + 3] = 255
        }
    }

    roughnessContext.putImageData(roughnessImage, 0, 0)
    aoContext.putImageData(aoImage, 0, 0)
    normalContext.putImageData(normalImage, 0, 0)

    return {
        roughnessMap: createCanvasTexture(roughnessCanvas, sourceTexture),
        aoMap: createCanvasTexture(aoCanvas, sourceTexture),
        normalMap: createCanvasTexture(normalCanvas, sourceTexture)
    }
}

const applyMaterialResponse = (
    material,
    maps,
    {
        roughness,
        metalness,
        normalScale = 1,
        aoMapIntensity = 1,
        clearcoat,
        clearcoatRoughness
    }
) => {
    if (!maps) {
        return
    }

    material.roughnessMap = maps.roughnessMap
    material.normalMap = maps.normalMap
    material.aoMap = maps.aoMap
    material.roughness = roughness
    material.metalness = metalness
    material.aoMapIntensity = aoMapIntensity
    material.normalScale = new THREE.Vector2(normalScale, normalScale)

    if ("clearcoat" in material && typeof clearcoat === "number") {
        material.clearcoat = clearcoat
    }

    if ("clearcoatRoughness" in material && typeof clearcoatRoughness === "number") {
        material.clearcoatRoughness = clearcoatRoughness
    }

    material.needsUpdate = true
}

const buildRoom = (scene) => {
    const roomXStart = -30
    const roomXEnd = 30
    const roomYStart = -7.5
    const roomYEnd = 7.5
    const roomZStart = -7
    const roomZEnd = 15
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
            roughness: 0.42,
            metalness: 0.08,
            normalScale: 0.75,
            aoMapIntensity: 0.7,
            clearcoat: 0.18,
            clearcoatRoughness: 0.74
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
        metalness: 0.03
    })
    floorMaterial = new THREE.MeshPhysicalMaterial({
        map: floorTexture,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.06,
        clearcoat: 0.14,
        clearcoatRoughness: 0.78
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

    return {
        meshes: [floor, ceiling, backWall, leftWall, rightWall, frontWall],
        materials: [wallMaterial, floorMaterial, ceilingMaterial, backWallMaterial],
        textures: [wallTexture, floorTexture, ceilingTexture, backWallMaterial.map, ...materialResponseTextures],
        lineGeometries: [projectionFrameGeometry],
        lineMaterials: [projectionFrameMaterial]
    }
}

const buildProjectionScreen = (scene, screenTextureUrl) => {
    const roomZStart = -7
    const projectionFrame = getProjectionFrameConfig()
    const screenWidth = projectionFrame.xEnd - projectionFrame.xStart
    const screenHeight = projectionFrame.yEnd - projectionFrame.yStart
    const screenCenterX = (projectionFrame.xStart + projectionFrame.xEnd) / 2
    const screenCenterY = (projectionFrame.yStart + projectionFrame.yEnd) / 2
    const textureLoader = new THREE.TextureLoader()
    const screenTexture = textureLoader.load(screenTextureUrl)

    screenTexture.colorSpace = THREE.SRGBColorSpace

    const screenMaterial = new THREE.MeshBasicMaterial({
        map: screenTexture,
        toneMapped: false
    })
    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(screenWidth, screenHeight),
        screenMaterial
    )

    screen.position.set(screenCenterX, screenCenterY, roomZStart + 0.04)
    scene.add(screen)

    return { mesh: screen, material: screenMaterial, texture: screenTexture }
}

const getValidScreenTextureUrl = (screenTextureUrl) => {
    if (typeof screenTextureUrl !== "string") {
        return null
    }

    const normalizedTextureUrl = screenTextureUrl.trim()

    return normalizedTextureUrl ? normalizedTextureUrl : null
}

const getRgbaColor = (hexColor, alpha) => {
    const color = new THREE.Color(hexColor)
    const red = Math.round(color.r * 255)
    const green = Math.round(color.g * 255)
    const blue = Math.round(color.b * 255)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const buildAmbientLight = (scene) => {
    // AmbientLight takes (color, intensity)
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.1)
    scene.add(ambientLight)

    return ambientLight
}

const buildProjectBeamOrigin = (scene, lightColor = "#e4d5c4") => {
    const { projectorBeamOrigin } = getDisplayPositions()

    // SpotLight takes (color, intensity, distance, angle, penumbra, decay)
    const beamLight = new THREE.SpotLight(lightColor, 8, 40, 0.55, 0.35, 1)
    beamLight.position.set(
        projectorBeamOrigin.x,
        projectorBeamOrigin.y,
        projectorBeamOrigin.z
    )
    scene.add(beamLight)

    // PointLight takes (color, intensity, distance, decay)
    const beamPointLight = new THREE.PointLight(lightColor, 10, 20, 2)
    beamPointLight.position.set(
        projectorBeamOrigin.x,
        projectorBeamOrigin.y,
        projectorBeamOrigin.z
    )
    scene.add(beamPointLight)

    const beamPointLightMarkerMaterial = new THREE.MeshBasicMaterial({
        color: lightColor,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
    })
    const beamPointLightMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        beamPointLightMarkerMaterial
    )
    beamPointLightMarker.position.copy(beamPointLight.position)
    scene.add(beamPointLightMarker)

    return { beamLight, beamPointLight, beamPointLightMarker, beamPointLightMarkerMaterial, projectorBeamOrigin }
}

const buildProjectorBeam = (scene, lightColor = "#e4d5c4") => {
    const roomZStart = -7
    const projectionFrame = getProjectionFrameConfig()
    const projectionFrameCenter = {
        x: (projectionFrame.xStart + projectionFrame.xEnd) / 2,
        y: (projectionFrame.yStart + projectionFrame.yEnd) / 2,
        z: roomZStart
    }
    const beamOriginAssets = buildProjectBeamOrigin(scene, lightColor)
    const { beamLight, beamPointLight, beamPointLightMarker, beamPointLightMarkerMaterial, projectorBeamOrigin } = beamOriginAssets

    const beamTarget = new THREE.Object3D()
    beamTarget.position.set(
        projectionFrameCenter.x,
        projectionFrameCenter.y,
        projectionFrameCenter.z
    )
    scene.add(beamTarget)
    beamLight.target = beamTarget

    // SpotLight takes (color, intensity, distance, angle, penumbra, decay)
    const wallSpillLight = new THREE.SpotLight(lightColor, 3.5, 42, 0.95, 0.8, 1)
    wallSpillLight.position.set(
        projectorBeamOrigin.x,
        projectorBeamOrigin.y,
        projectorBeamOrigin.z
    )
    wallSpillLight.target = beamTarget
    scene.add(wallSpillLight)

    const wallGlowCanvas = document.createElement("canvas")
    wallGlowCanvas.width = 1024
    wallGlowCanvas.height = 1024
    const wallGlowContext = wallGlowCanvas.getContext("2d")
    const wallGlowGradient = wallGlowContext.createRadialGradient(512, 512, 90, 512, 512, 512)
    wallGlowGradient.addColorStop(0, getRgbaColor(lightColor, 0.9))
    wallGlowGradient.addColorStop(0.35, getRgbaColor(lightColor, 0.38))
    wallGlowGradient.addColorStop(0.72, getRgbaColor(lightColor, 0.12))
    wallGlowGradient.addColorStop(1, getRgbaColor(lightColor, 0))
    wallGlowContext.fillStyle = wallGlowGradient
    wallGlowContext.fillRect(0, 0, 1024, 1024)

    const wallGlowTexture = new THREE.CanvasTexture(wallGlowCanvas)
    const wallGlowMaterial = new THREE.MeshBasicMaterial({
        map: wallGlowTexture,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    })
    const wallGlowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            (projectionFrame.xEnd - projectionFrame.xStart) * 2.2,
            (projectionFrame.yEnd - projectionFrame.yStart) * 2.2
        ),
        wallGlowMaterial
    )
    wallGlowPlane.position.set(
        projectionFrameCenter.x,
        projectionFrameCenter.y,
        roomZStart + 0.03
    )
    scene.add(wallGlowPlane)

    const beamOrigin = new THREE.Vector3(
        projectorBeamOrigin.x,
        projectorBeamOrigin.y,
        projectorBeamOrigin.z
    )
    const beamAxis = new THREE.Vector3().subVectors(projectionFrameCenter, beamOrigin).normalize()
    const beamLength = beamOrigin.distanceTo(new THREE.Vector3(
        projectionFrameCenter.x,
        projectionFrameCenter.y,
        projectionFrameCenter.z
    ))
    const projectionTopLeft = new THREE.Vector3(projectionFrame.xStart, projectionFrame.yEnd, roomZStart)
    const projectionTopRight = new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yEnd, roomZStart)
    const projectionBottomRight = new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yStart, roomZStart)
    const projectionBottomLeft = new THREE.Vector3(projectionFrame.xStart, projectionFrame.yStart, roomZStart)

    const beamPyramidMaterial = new THREE.LineBasicMaterial({
        color: lightColor,
        transparent: true,
        opacity: 0.7
    })
    const beamPyramidGeometry = new THREE.BufferGeometry().setFromPoints([
        beamOrigin, projectionTopLeft,
        beamOrigin, projectionTopRight,
        beamOrigin, projectionBottomRight,
        beamOrigin, projectionBottomLeft,
        projectionTopLeft, projectionTopRight,
        projectionTopRight, projectionBottomRight,
        projectionBottomRight, projectionBottomLeft,
        projectionBottomLeft, projectionTopLeft
    ])
    const beamPyramid = new THREE.LineSegments(beamPyramidGeometry, beamPyramidMaterial)
    beamPyramid.visible = false
    scene.add(beamPyramid)

    const beamPyramidFillGeometry = new THREE.BufferGeometry()
    const beamPyramidFillVertices = new Float32Array([
        beamOrigin.x, beamOrigin.y, beamOrigin.z,
        projectionTopLeft.x, projectionTopLeft.y, projectionTopLeft.z,
        projectionTopRight.x, projectionTopRight.y, projectionTopRight.z,

        beamOrigin.x, beamOrigin.y, beamOrigin.z,
        projectionTopRight.x, projectionTopRight.y, projectionTopRight.z,
        projectionBottomRight.x, projectionBottomRight.y, projectionBottomRight.z,

        beamOrigin.x, beamOrigin.y, beamOrigin.z,
        projectionBottomRight.x, projectionBottomRight.y, projectionBottomRight.z,
        projectionBottomLeft.x, projectionBottomLeft.y, projectionBottomLeft.z,

        beamOrigin.x, beamOrigin.y, beamOrigin.z,
        projectionBottomLeft.x, projectionBottomLeft.y, projectionBottomLeft.z,
        projectionTopLeft.x, projectionTopLeft.y, projectionTopLeft.z
    ])
    beamPyramidFillGeometry.setAttribute("position", new THREE.BufferAttribute(beamPyramidFillVertices, 3))
    const beamPyramidFillMaterial = createBeamMaterial({
        beamColor: lightColor,
        beamOrigin,
        beamAxis,
        beamLength,
        beamOpacity: 0.28
    })
    const beamPyramidFill = new THREE.Mesh(beamPyramidFillGeometry, beamPyramidFillMaterial)
    scene.add(beamPyramidFill)

    return {
        beamLight,
        beamPointLight,
        beamPointLightMarker,
        beamPointLightMarkerMaterial,
        beamTarget,
        wallSpillLight,
        wallGlowPlane,
        wallGlowMaterial,
        wallGlowTexture,
        beamPyramid,
        beamPyramidGeometry,
        beamPyramidMaterial,
        beamPyramidFill,
        beamPyramidFillGeometry,
        beamPyramidFillMaterial
    }
}

const buildBox = (scene) => {
    const boxWidth = 1
    const boxHeight = 2
    const boxDepth = 1
    const { boxPosition } = getDisplayPositions()
    const textureLoader = new THREE.TextureLoader()
    const boxWallTexture = textureLoader.load(museumWallTextureUrl)

    boxWallTexture.wrapS = THREE.RepeatWrapping
    boxWallTexture.wrapT = THREE.RepeatWrapping
    boxWallTexture.repeat.set(1, 1)

    const boxMaterial = new THREE.MeshStandardMaterial({ map: boxWallTexture })
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth),
        boxMaterial
    )

    box.position.set(boxPosition.x, boxPosition.y, boxPosition.z)
    scene.add(box)

    return { mesh: box, material: boxMaterial, texture: boxWallTexture }
}

const buildDebugAxes = (scene) => {
    const axesHelper = new THREE.AxesHelper(4)
    scene.add(axesHelper)

    return axesHelper
}

const loadProjector = async (scene) => {
    const { projectorPosition } = getDisplayPositions()
    const projectorScale = 0.25
    const projectorRotationY = Math.PI

    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(projectorModelUrl)
    const projector = gltf.scene

    projector.position.set(projectorPosition.x, projectorPosition.y, projectorPosition.z)
    projector.scale.setScalar(projectorScale)
    projector.rotation.y = projectorRotationY
    scene.add(projector)

    return projector
}

const buildCamera = () => {
    const cameraFov = 60
    const cameraAspect = 1
    const cameraNear = 0.1
    const cameraFar = 500
    const cameraPosition = { x: -16.24, y: -4.8, z: 14.27 }
    const cameraLookAt = { x: -14.81, y: -4.9, z: 9.48 }

    const camera = new THREE.PerspectiveCamera(cameraFov, cameraAspect, cameraNear, cameraFar)
    camera.rotation.order = "YXZ"
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    camera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z)
    camera.rotation.z = 0

    return camera
}

const buildCameraDebugVisuals = (scene) => {
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
        marker,
        markerMaterial,
        lineGeometry,
        lineMaterial,
        linePositions,
        lineSegments
    }
}

const updateCameraDebugVisuals = (camera, debugVisuals) => {
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

    debugVisuals.marker.position.copy(camera.position)

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
        debugVisuals.linePositions[offset] = point.x
        debugVisuals.linePositions[offset + 1] = point.y
        debugVisuals.linePositions[offset + 2] = point.z
    })

    debugVisuals.lineGeometry.attributes.position.needsUpdate = true
}

const ProjectScene = ({ className = "", projects = [], screenTextureUrl, onScreenClick, lightColor = "#e4d5c4" }) => {
    const canvasRef = useRef(null)
    const cameraRef = useRef(null)
    const pressedKeysRef = useRef(new Set())
    const cameraRotationRef = useRef({ yaw: 0, pitch: 0 })
    void projects
    const validScreenTextureUrl = getValidScreenTextureUrl(screenTextureUrl)
    const enableCameraMovement = false

    // initialize and render the 3D scene
    useEffect(() => {
        const enableAxesDebug = false

        const container = canvasRef.current

        if (!container) {
            return
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color("#000000")

        const camera = buildCamera()
        cameraRef.current = camera
        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1
        container.appendChild(renderer.domElement)

        const room = buildRoom(scene)
        const projectionScreen = validScreenTextureUrl
            ? buildProjectionScreen(scene, validScreenTextureUrl)
            : null
        const ambientLight = buildAmbientLight(scene)
        const projectorBeam = buildProjectorBeam(scene, lightColor)
        const box = buildBox(scene)
        const debugAxes = enableAxesDebug ? buildDebugAxes(scene) : null
        const debugVisuals = buildCameraDebugVisuals(scene)
        const initialForward = new THREE.Vector3()
        camera.getWorldDirection(initialForward)
        cameraRotationRef.current = {
            yaw: Math.atan2(-initialForward.x, -initialForward.z),
            pitch: Math.asin(THREE.MathUtils.clamp(initialForward.y, -1, 1))
        }
        let animationFrameId = 0
        let projector = null
        let disposed = false

        loadProjector(scene)
            .then((loadedProjector) => {
                if (disposed) {
                    loadedProjector.traverse((child) => {
                        if (child.isMesh) {
                            child.geometry?.dispose()

                            if (Array.isArray(child.material)) {
                                child.material.forEach((material) => material.dispose())
                            } else {
                                child.material?.dispose()
                            }
                        }
                    })
                    return
                }

                projector = loadedProjector
            })
            .catch((error) => {
                console.error("Failed to load projector model", error)
            })

        const resize = () => {
            const { clientWidth, clientHeight } = container

            if (!clientWidth || !clientHeight) {
                return
            }

            camera.aspect = clientWidth / clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(clientWidth, clientHeight)
        }

        const handleCanvasClick = (event) => {
            if (!projectionScreen || !onScreenClick) {
                return
            }

            const rect = renderer.domElement.getBoundingClientRect()
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

            raycaster.setFromCamera(pointer, camera)

            const intersections = raycaster.intersectObject(projectionScreen.mesh)

            if (intersections.length > 0) {
                onScreenClick()
            }
        }

        const animate = () => {
            updateCameraDebugVisuals(camera, debugVisuals)
            renderer.render(scene, camera)
            animationFrameId = window.requestAnimationFrame(animate)
        }

        resize()
        updateCameraDebugVisuals(camera, debugVisuals)
        window.addEventListener("resize", resize)
        container.addEventListener("click", handleCanvasClick)
        animationFrameId = window.requestAnimationFrame(animate)

        return () => {
            disposed = true
            cameraRef.current = null
            pressedKeysRef.current.clear()
            window.removeEventListener("resize", resize)
            container.removeEventListener("click", handleCanvasClick)
            window.cancelAnimationFrame(animationFrameId)
            scene.remove(ambientLight)
            scene.remove(projectorBeam.beamLight)
            scene.remove(projectorBeam.beamPointLight)
            scene.remove(projectorBeam.beamPointLightMarker)
            scene.remove(projectorBeam.beamPyramid)
            scene.remove(projectorBeam.beamPyramidFill)
            scene.remove(projectorBeam.beamTarget)
            scene.remove(projectorBeam.wallSpillLight)
            scene.remove(projectorBeam.wallGlowPlane)
            if (debugAxes) {
                scene.remove(debugAxes)
            }
            if (projectionScreen) {
                scene.remove(projectionScreen.mesh)
            }
            scene.remove(debugVisuals.marker)
            scene.remove(debugVisuals.lineSegments)
            if (projector) {
                scene.remove(projector)
                projector.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry?.dispose()

                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => material.dispose())
                        } else {
                            child.material?.dispose()
                        }
                    }
                })
            }
            box.mesh.geometry.dispose()
            box.material.dispose()
            box.texture.dispose()
            if (projectionScreen) {
                projectionScreen.mesh.geometry.dispose()
                projectionScreen.material.dispose()
                projectionScreen.texture.dispose()
            }
            projectorBeam.beamPointLightMarker.geometry.dispose()
            projectorBeam.beamPointLightMarkerMaterial.dispose()
            projectorBeam.beamPyramidGeometry.dispose()
            projectorBeam.beamPyramidMaterial.dispose()
            projectorBeam.beamPyramidFillGeometry.dispose()
            projectorBeam.beamPyramidFillMaterial.dispose()
            projectorBeam.wallGlowPlane.geometry.dispose()
            projectorBeam.wallGlowMaterial.dispose()
            projectorBeam.wallGlowTexture.dispose()
            debugVisuals.marker.geometry.dispose()
            debugVisuals.markerMaterial.dispose()
            debugVisuals.lineGeometry.dispose()
            debugVisuals.lineMaterial.dispose()
            room.meshes.forEach((mesh) => mesh.geometry.dispose())
            room.materials.forEach((material) => material.dispose())
            room.textures.forEach((texture) => texture.dispose())
            room.lineGeometries.forEach((geometry) => geometry.dispose())
            room.lineMaterials.forEach((material) => material.dispose())
            renderer.dispose()

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [enableCameraMovement, lightColor, onScreenClick, validScreenTextureUrl])

    // user input handling for camera movement
    useEffect(() => {
        const container = canvasRef.current
        const moveSpeed = 6
        const lookSensitivity = 0.0025

        if (!enableCameraMovement || !container) {
            return
        }

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

        return () => {
            pressedKeysRef.current.clear()
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
            window.removeEventListener("mousemove", handleMouseMove)
            container.removeEventListener("mousedown", handleCanvasMouseDown)
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [enableCameraMovement])

    return (
        <div
            ref={canvasRef}
            className={className}
        />
    )
}

export default ProjectScene

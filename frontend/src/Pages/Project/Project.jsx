
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import shapeMorphingGif from "../../assets/ProjectThumbnail/ShapeMorphing.gif"
import astronomyGif from "../../assets/ProjectThumbnail/astronomy.gif"
import oceanGif from "../../assets/ProjectThumbnail/ocean.gif"
import projectorModelUrl from "../../assets/Projector/generic_white_digital_projector.glb"

const projectThumb = "/images/project-thumbnails/KnightThumbnail.png"
const bubbleThumb = "/images/project-thumbnails/Bubble.png"
const agentThumb = "/images/project-thumbnails/agent.png"
const supervisedLearningThumb = "/images/projects/supervisedLearning.png"
const dalTutorThumb = "/images/projects/daltutor.png"
const iceSpyThumb = "/images/projects/iceSpy.png"
const portfolioThumb = "/images/projects/portfolio.png"

const projects = [
    {
        title: "My Portfolio",
        slug: "my-portfolio",
        image: portfolioThumb,
        topic: "Full-Stack Development",
        skills: "React · Node.js · MongoDB · Javascript · Full Stack",
        description: "A full-stack portfolio showcasing game development, interactive OpenGL animations, and responsive web experiences. Features bold theming, animated hero, project badges, performance reels, testimonials, and contact flow. Built with React, smooth scroll, and backend integrations to keep content dynamic and personal.",
        githubLink: "https://github.com/LiberteI/My_Portfolio",
        isSoloProject: true,
        canLink: false
    },
    {
        title: "Housing Price Predictor",
        slug: "housing-price-predictor",
        image: supervisedLearningThumb,
        topic: "Supervised Learning",
        skills: "Supervised Learning · Regression Modeling · Data Preprocessing · Python · Model Evaluation · Data Visualization",
        description: "Completed an end-to-end supervised learning project predicting housing prices using real-world data. Built a reproducible scikit-learn pipeline covering data cleaning, preprocessing, regression modeling, evaluation with RMSE and MAE, visualization, and result interpretation across the full machine learning workflow.",
        githubLink: "https://github.com/LiberteI/Supervised-Learning-Workshop",
        isSoloProject: true,
        canLink: false
    },
    
    {
        title: "Dal Tutor",
        slug: "dal-tutor",
        image: dalTutorThumb,
        topic: "Software Development",
        skills: "Agile Development · Extreme Programming (XP) · Java · Android Studio · Team Collaboration",
        description: "Developed Dal Tutor over four months using Agile and XP practices. Planned and delivered features across two iterations using user stories, story points, and burndown charts, emphasizing continuous integration, teamwork, and incremental delivery of a real-world tutoring platform.",
        githubLink: "https://github.com/LiberteI/dalTutor",
        isSoloProject: false,
        canLink: false
    },
    {
        title: "Ocean Simulation",
        slug: "ocean-simulation",
        image: oceanGif,
        topic: "Computer Animation",
        skills: "C++ · OpenGL (GLEW) · Vertex & Fragment Shaders · Lighting · Camera & Input Systems · Real-Time Animation Systems",
        description:"Developed a C++ OpenGL submarine simulator featuring interactive camera controls, OBJ model loading, dynamic lighting, fog-based underwater effects, textured environments, animated surface waves, and autonomous fish movement. Implemented depth and double buffering, real-time transformations, and event-driven input to build an immersive, interactive 3D underwater scene demonstrating core graphics pipeline concepts.",
        githubLink:"https://github.com/LiberteI/Submarine",
        canLink: false,
        isSoloProject: true

    },
    {
        title: "Astronomical Simulation",
        slug: "astronomical-simulation",
        image: astronomyGif,
        topic: "Computer Animation",
        skills: "skills: C++ · OpenGL (GLUT) · 3D Graphics & Transformations · Camera & Projection Systems · Vertex-Based Rendering · Double & Depth Buffering",
        description:"Built a C++ OpenGL graphics project simulating an imaginary planetary system with animated orbits, twinkling stars, and a loaded 3D Starship Enterprise model. Implemented perspective camera controls, depth and double buffering, vertex-based rendering, and real-time transformations to demonstrate core OpenGL graphics pipeline concepts and interactive 3D scene design.",
        githubLink:"https://github.com/LiberteI/Astronomical_System",
        canLink: false,
        isSoloProject: true

    },
    {
        title: "Ice Spy",
        slug: "ice-spy",
        image: iceSpyThumb,
        topic: "Machine Learning",
        skills: "Machine Learning · Data Analysis · Pathfinding · Geospatial Mapping · Algorithm Design",
        description: "Built Ice Spy during the Space Mission Accepted Hackathon, using satellite data, machine learning ice prediction, and a pathfinding to optimize Arctic shipping routes. Enabled bilingual support and SMS alerts to improve safety and logistics for remote northern communities.",
        githubLink: "https://github.com/hongh233/NASA",
        isSoloProject: false,
        canLink: false
    },
    {
        title: "Shape Morphing",
        slug: "shape-morphing",
        image: shapeMorphingGif,
        topic: "Computer Animation",
        skills: "skills: C++ · OpenGL (GLUT) · Vertex-Based Shape Morphing · Linear Interpolation (LERP) · Modular OOP Design · Double-Buffered Rendering",
        description:"Built a C++ OpenGL application that morphs custom shapes through vertex resampling and linear interpolation. Implemented double-buffered rendering, event-driven mouse input, and a clean modular architecture. Refactored a monolithic prototype into scalable components, gaining practical insight into the OpenGL pipeline and real-world rendering constraints, and improved maintainability, performance, and clarity.",
        githubLink:"https://github.com/LiberteI/Computer_Animation",
        canLink: false,
        isSoloProject: true

    },
    
    {
        title: "Easy Shop",
        slug: "easy-shop",
        image: agentThumb,
        topic: "Agentic AI",
        skills: "AI Agents · Large Language Models (LLM) · Retrieval-Augmented Generation (RAG) · MongoDB · n8n Automation · Conversational System Design",
        description: "Developed a WhatsApp-embedded AI agent using n8n, featuring persistent chat memory, dynamic inventory, and automated order processing. Integrated MongoDB for scalable memory management, demonstrating how agentic AI can automate and streamline real-world small business operations.",
        githubLink: "https://github.com/LiberteI",
        isSoloProject: true,
        canLink: false
    },
    
    
    {
        title: "Knight of Cinders",
        slug: "knight-of-cinders",
        image: projectThumb,
        canLink: true,
        topic: "Game Development",
        skills: "Unity · Tilemap · Cinemachine · Physics & Raycasting · Singleton Architecture · State-Driven Systems",
        description: "A dark 2D action game inspired by Souls-like combat, following a fallen knight driven by loss and revenge. The game features deliberate, stamina-based melee combat, multi-phase boss encounters with distinct attack patterns, and adaptive enemy behaviors. Atmospheric parallax-scrolled environments, and cinematic animations.",
        githubLink: "https://github.com/LiberteI/KnightOfCinders_firstProject",
        isSoloProject: true
    },
    {
        title: "Bubble Biologist",
        slug: "bubble-biologist",
        image: bubbleThumb,
        topic: "Game Development",
        skills: "Unity · Gameplay Programming · Physics Systems · Git Collaboration · Rapid Iteration · 2D Game Development",
        description:"Developed a 2D platformer during Global Game Jam 2025 in a 48-hour sprint. Implemented physics-based movement, a shrinking bubble survival mechanic, and dynamic bounce controls in Unity. Collaborated on original pixel art, animations, and an animated cutscene, rapidly prototyping gameplay systems under tight time constraints.",
        githubLink:"https://github.com/LydiaV2001/GGJ2025",
        isSoloProject: false,
        canLink: false
    }
    

]

const getProjectionFrameConfig = () => {
    return {
        xStart: -16,
        xEnd: 2,
        yStart: -6,
        yEnd: 5
    }
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

    const wallMaterial = new THREE.MeshStandardMaterial({ color: "#151515", side: THREE.DoubleSide })
    const floorMaterial = new THREE.MeshStandardMaterial({ color: "#0c0c0c", side: THREE.DoubleSide })
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: "#1b1b1b", side: THREE.DoubleSide })
    const backWallMaterial = new THREE.MeshStandardMaterial({ color: "#111111", side: THREE.DoubleSide })

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomDepth),
        floorMaterial
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.set(roomXCenter, roomYStart, roomZCenter)
    scene.add(floor)

    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomDepth),
        ceilingMaterial
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.set(roomXCenter, roomYEnd, roomZCenter)
    scene.add(ceiling)

    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomHeight),
        backWallMaterial
    )
    backWall.position.set(roomXCenter, roomYCenter, roomZStart)
    scene.add(backWall)

    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, roomHeight),
        wallMaterial
    )
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.set(roomXStart, roomYCenter, roomZCenter)
    scene.add(leftWall)

    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, roomHeight),
        wallMaterial
    )
    rightWall.rotation.y = -Math.PI / 2
    rightWall.position.set(roomXEnd, roomYCenter, roomZCenter)
    scene.add(rightWall)

    const frontWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomHeight),
        wallMaterial
    )
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
        lineGeometries: [projectionFrameGeometry],
        lineMaterials: [projectionFrameMaterial]
    }
}

const buildLights = (scene) => {
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight("#ffffff", 1.6)
    directionalLight.position.set(0, 4, 6)
    scene.add(directionalLight)

    return [ambientLight, directionalLight]
}

const buildProjectorBeam = (scene) => {
    const roomZStart = -7
    const projectionFrame = getProjectionFrameConfig()
    const projectionFrameCenter = {
        x: (projectionFrame.xStart + projectionFrame.xEnd) / 2,
        y: (projectionFrame.yStart + projectionFrame.yEnd) / 2,
        z: roomZStart
    }
    const { projectorBeamOrigin } = getDisplayPositions()

    const beamTarget = new THREE.Object3D()
    beamTarget.position.set(
        projectionFrameCenter.x,
        projectionFrameCenter.y,
        projectionFrameCenter.z
    )
    scene.add(beamTarget)
    // new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
    const beamLight = new THREE.SpotLight("#e4d5c4", 50, 40, 0.55, 0.35, 1)
    beamLight.position.set(
        projectorBeamOrigin.x,
        projectorBeamOrigin.y,
        projectorBeamOrigin.z
    )
    beamLight.target = beamTarget
    scene.add(beamLight)
    // new THREE.PointLight(color, intensity, distance, decay)
    const beamPointLight = new THREE.PointLight("#e4d5c4", 100, 20, 2)
    beamPointLight.position.set(
        projectorBeamOrigin.x,
        projectorBeamOrigin.y,
        projectorBeamOrigin.z
    )
    scene.add(beamPointLight)

    const beamPointLightMarkerMaterial = new THREE.MeshBasicMaterial({
        color: "#e4d5c4",
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

    const beamOrigin = new THREE.Vector3(
        projectorBeamOrigin.x,
        projectorBeamOrigin.y,
        projectorBeamOrigin.z
    )
    const projectionTopLeft = new THREE.Vector3(projectionFrame.xStart, projectionFrame.yEnd, roomZStart)
    const projectionTopRight = new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yEnd, roomZStart)
    const projectionBottomRight = new THREE.Vector3(projectionFrame.xEnd, projectionFrame.yStart, roomZStart)
    const projectionBottomLeft = new THREE.Vector3(projectionFrame.xStart, projectionFrame.yStart, roomZStart)

    const beamPyramidMaterial = new THREE.LineBasicMaterial({
        color: "#decdbb",
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
    beamPyramidFillGeometry.computeVertexNormals()

    const beamPyramidFillMaterial = new THREE.MeshBasicMaterial({
        color: "#e2d0ba",
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false
    })
    const beamPyramidFill = new THREE.Mesh(beamPyramidFillGeometry, beamPyramidFillMaterial)
    scene.add(beamPyramidFill)

    return {
        beamLight,
        beamPointLight,
        beamPointLightMarker,
        beamPointLightMarkerMaterial,
        beamTarget,
        beamPyramid,
        beamPyramidGeometry,
        beamPyramidMaterial,
        beamPyramidFill,
        beamPyramidFillGeometry,
        beamPyramidFillMaterial
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

const buildBox = (scene) => {
    const boxWidth = 1
    const boxHeight = 2
    const boxDepth = 1
    const { boxPosition } = getDisplayPositions()

    const boxMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" })
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth),
        boxMaterial
    )

    box.position.set(boxPosition.x, boxPosition.y, boxPosition.z)
    scene.add(box)

    return { mesh: box, material: boxMaterial }
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

const ProjectScene = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const enableCameraMovement = true
        const enableAxesDebug = false

        const container = canvasRef.current

        if (!container) {
            return
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color("#000000")

        const camera = buildCamera()

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        const room = buildRoom(scene)
        const lights = buildLights(scene)
        const projectorBeam = buildProjectorBeam(scene)
        const box = buildBox(scene)
        const debugAxes = enableAxesDebug ? buildDebugAxes(scene) : null
        const debugVisuals = buildCameraDebugVisuals(scene)
        const pressedKeys = new Set()
        const clock = new THREE.Clock()
        const moveSpeed = 6
        const lookSensitivity = 0.0025
        const initialForward = new THREE.Vector3()
        camera.getWorldDirection(initialForward)
        let cameraYaw = Math.atan2(-initialForward.x, -initialForward.z)
        let cameraPitch = Math.asin(THREE.MathUtils.clamp(initialForward.y, -1, 1))
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

        const handleKeyDown = (event) => {
            if (!enableCameraMovement) {
                return
            }

            pressedKeys.add(event.code)
        }

        const handleKeyUp = (event) => {
            if (!enableCameraMovement) {
                return
            }

            pressedKeys.delete(event.code)
        }

        const handleCanvasMouseDown = (event) => {
            if (event.button !== 0) {
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

            if (!enableCameraMovement) {
                return
            }

            container.requestPointerLock?.()
        }

        const handleMouseMove = (event) => {
            if (!enableCameraMovement) {
                return
            }

            if (document.pointerLockElement !== container) {
                return
            }

            cameraYaw -= event.movementX * lookSensitivity
            cameraPitch -= event.movementY * lookSensitivity
            cameraPitch = THREE.MathUtils.clamp(cameraPitch, -1.45, 1.45)
            camera.rotation.y = cameraYaw
            camera.rotation.x = cameraPitch
            camera.rotation.z = 0
        }

        const animate = () => {
            const delta = clock.getDelta()
            if (enableCameraMovement) {
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

                if (pressedKeys.has("KeyW")) {
                    movement.add(forwardFlat)
                }
                if (pressedKeys.has("KeyS")) {
                    movement.sub(forwardFlat)
                }
                if (pressedKeys.has("KeyA")) {
                    movement.sub(right)
                }
                if (pressedKeys.has("KeyD")) {
                    movement.add(right)
                }
                if (pressedKeys.has("ArrowUp")) {
                    movement.y += 1
                }
                if (pressedKeys.has("ArrowDown")) {
                    movement.y -= 1
                }

                if (movement.lengthSq() > 0) {
                    movement.normalize().multiplyScalar(moveSpeed * delta)
                    camera.position.add(movement)
                }
            }

            updateCameraDebugVisuals(camera, debugVisuals)
            renderer.render(scene, camera)
            animationFrameId = window.requestAnimationFrame(animate)
        }

        resize()
        updateCameraDebugVisuals(camera, debugVisuals)
        window.addEventListener("resize", resize)
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        window.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mousedown", handleCanvasMouseDown)
        animationFrameId = window.requestAnimationFrame(animate)

        return () => {
            disposed = true
            window.removeEventListener("resize", resize)
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
            window.removeEventListener("mousemove", handleMouseMove)
            container.removeEventListener("mousedown", handleCanvasMouseDown)
            window.cancelAnimationFrame(animationFrameId)
            lights.forEach((light) => scene.remove(light))
            scene.remove(projectorBeam.beamLight)
            scene.remove(projectorBeam.beamPointLight)
            scene.remove(projectorBeam.beamPointLightMarker)
            scene.remove(projectorBeam.beamPyramid)
            scene.remove(projectorBeam.beamPyramidFill)
            scene.remove(projectorBeam.beamTarget)
            if (debugAxes) {
                scene.remove(debugAxes)
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
            projectorBeam.beamPointLightMarker.geometry.dispose()
            projectorBeam.beamPointLightMarkerMaterial.dispose()
            projectorBeam.beamPyramidGeometry.dispose()
            projectorBeam.beamPyramidMaterial.dispose()
            projectorBeam.beamPyramidFillGeometry.dispose()
            projectorBeam.beamPyramidFillMaterial.dispose()
            debugVisuals.marker.geometry.dispose()
            debugVisuals.markerMaterial.dispose()
            debugVisuals.lineGeometry.dispose()
            debugVisuals.lineMaterial.dispose()
            room.meshes.forEach((mesh) => mesh.geometry.dispose())
            room.materials.forEach((material) => material.dispose())
            room.lineGeometries.forEach((geometry) => geometry.dispose())
            room.lineMaterials.forEach((material) => material.dispose())
            renderer.dispose()

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <section className='relative h-screen bg-black'>
            <div
                ref={canvasRef}
                className='absolute inset-0 h-full w-full bg-black'
            />
        </section>
    )
}

export default ProjectScene

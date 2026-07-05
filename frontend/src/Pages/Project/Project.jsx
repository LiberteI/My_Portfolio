
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

const buildRoom = (scene) => {
    const roomWidth = 18
    const roomHeight = 10
    const roomDepth = 22

    const wallMaterial = new THREE.MeshStandardMaterial({ color: "#151515", side: THREE.DoubleSide })
    const floorMaterial = new THREE.MeshStandardMaterial({ color: "#0c0c0c", side: THREE.DoubleSide })
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: "#1b1b1b", side: THREE.DoubleSide })
    const backWallMaterial = new THREE.MeshStandardMaterial({ color: "#111111", side: THREE.DoubleSide })

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomDepth),
        floorMaterial
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -roomHeight / 2
    scene.add(floor)

    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomDepth),
        ceilingMaterial
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = roomHeight / 2
    scene.add(ceiling)

    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomHeight),
        backWallMaterial
    )
    backWall.position.z = -roomDepth / 2
    scene.add(backWall)

    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, roomHeight),
        wallMaterial
    )
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.x = -roomWidth / 2
    scene.add(leftWall)

    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, roomHeight),
        wallMaterial
    )
    rightWall.rotation.y = -Math.PI / 2
    rightWall.position.x = roomWidth / 2
    scene.add(rightWall)

    const frontWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomHeight),
        wallMaterial
    )
    frontWall.rotation.y = Math.PI
    frontWall.position.z = roomDepth / 2
    scene.add(frontWall)

    return {
        meshes: [floor, ceiling, backWall, leftWall, rightWall, frontWall],
        materials: [wallMaterial, floorMaterial, ceilingMaterial, backWallMaterial]
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

const buildBox = (scene) => {
    const boxMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" })
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        boxMaterial
    )

    box.position.set(0, -3.9, -1.5)
    scene.add(box)

    return { mesh: box, material: boxMaterial }
}

const loadProjector = async (scene) => {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(projectorModelUrl)
    const projector = gltf.scene

    projector.position.set(0, -3.4, -1.5)
    projector.scale.setScalar(2.2)
    projector.rotation.y = Math.PI
    scene.add(projector)

    return projector
}

const ProjectScene = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const container = canvasRef.current

        if (!container) {
            return
        }

        const scene = new THREE.Scene()
        scene.background = new THREE.Color("#000000")

        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
        camera.position.set(0, 0, 9)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        const room = buildRoom(scene)
        const lights = buildLights(scene)
        const box = buildBox(scene)
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
                renderer.render(scene, camera)
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
            renderer.render(scene, camera)
        }

        resize()
        window.addEventListener("resize", resize)

        return () => {
            disposed = true
            window.removeEventListener("resize", resize)
            lights.forEach((light) => scene.remove(light))
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
            room.meshes.forEach((mesh) => mesh.geometry.dispose())
            room.materials.forEach((material) => material.dispose())
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

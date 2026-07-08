const projectThumb = "/images/project-thumbnails/KnightThumbnail.png"
const projectThumbnailImage = "/images/project-thumbnails/compressed-img/KnightThumbnail.webp"
const bubbleThumb = "/images/project-thumbnails/Bubble.png"
const bubbleThumbnailImage = "/images/project-thumbnails/compressed-img/Bubble.webp"
const agentThumb = "/images/project-thumbnails/agent.png"
const agentThumbnailImage = "/images/project-thumbnails/compressed-img/agent.webp"
const supervisedLearningThumb = "/images/project-thumbnails/supervisedLearning.png"
const supervisedLearningThumbnailImage = "/images/project-thumbnails/compressed-img/supervisedLearning.webp"
const dalTutorThumb = "/images/project-thumbnails/daltutor.png"
const dalTutorThumbnailImage = "/images/project-thumbnails/compressed-img/daltutor.webp"
const iceSpyThumb = "/images/project-thumbnails/iceSpy.png"
const iceSpyThumbnailImage = "/images/project-thumbnails/compressed-img/iceSpy.webp"
const portfolioThumb = "/images/project-thumbnails/portfolio.png"
const portfolioThumbnailImage = "/images/project-thumbnails/compressed-img/portfolio.webp"
const shapeMorphingGif = "/images/project-thumbnails/ShapeMorphing.gif"
const astronomyGif = "/images/project-thumbnails/astronomy.gif"
const oceanGif = "/images/project-thumbnails/ocean.gif"

export const projectRecords = [
    {
        title: "My Portfolio",
        slug: "my-portfolio",
        thumbnailImage: portfolioThumbnailImage,
        projectionImage: portfolioThumb,
        topic: "Full-Stack Development",
        skills: ["React", "Node.js", "MongoDB", "Javascript", "Full Stack"],
        description: "A full-stack portfolio site with interactive 3D scenes, responsive layouts, and dynamic content.",
        duration: "2025/06 - 2025/08",
        githubLink: "https://github.com/LiberteI/My_Portfolio",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Housing Price Predictor",
        slug: "housing-price-predictor",
        thumbnailImage: supervisedLearningThumbnailImage,
        projectionImage: supervisedLearningThumb,
        topic: "Supervised Learning",
        skills: ["Python", "Regression Modeling", "Data Preprocessing", "Model Evaluation", "Data Visualization"],
        description: "An end-to-end regression pipeline for predicting housing prices from real-world data.",
        duration: "2024/09 - 2024/10",
        githubLink: "https://github.com/LiberteI/Supervised-Learning-Workshop",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Dal Tutor",
        slug: "dal-tutor",
        thumbnailImage: dalTutorThumbnailImage,
        projectionImage: dalTutorThumb,
        topic: "Software Development",
        skills: ["Agile Development", "Extreme Programming (XP)", "Java", "Android Studio", "Team Collaboration"],
        description: "An Android tutoring platform built through Agile iterations and collaborative delivery.",
        duration: "2024/01 - 2024/04",
        githubLink: "https://github.com/LiberteI/dalTutor",
        ownership: "team",
        projectTier: "archive"
    },
    {
        title: "Ocean Simulation",
        slug: "ocean-simulation",
        thumbnailImage: oceanGif,
        projectionImage: oceanGif,
        topic: "Computer Animation",
        skills: ["C++", "OpenGL (GLEW)", "Vertex & Fragment Shaders", "Lighting", "Camera & Input Systems", "Real-Time Animation Systems"],
        description: "A C++ OpenGL submarine simulator with lighting, fog, animated waves, and interactive navigation.",
        duration: "2024/11 - 2024/12",
        githubLink: "https://github.com/LiberteI/Submarine",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Astronomical Simulation",
        slug: "astronomical-simulation",
        thumbnailImage: astronomyGif,
        projectionImage: astronomyGif,
        topic: "Computer Animation",
        skills: ["C++", "OpenGL (GLUT)", "3D Graphics & Transformations", "Camera & Projection Systems", "Vertex-Based Rendering", "Double & Depth Buffering"],
        description: "A C++ OpenGL planetary scene with animated orbits, stars, and interactive camera controls.",
        duration: "2024/10 - 2024/11",
        githubLink: "https://github.com/LiberteI/Astronomical_System",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Ice Spy",
        slug: "ice-spy",
        thumbnailImage: iceSpyThumbnailImage,
        projectionImage: iceSpyThumb,
        topic: "Machine Learning",
        skills: ["Machine Learning", "Data Analysis", "Pathfinding", "Geospatial Mapping", "Algorithm Design"],
        description: "A hackathon project using ML and pathfinding to optimize Arctic shipping routes.",
        duration: "2024/10 - 2024/10",
        githubLink: "https://github.com/hongh233/NASA",
        ownership: "team",
        projectTier: "archive"
    },
    {
        title: "Shape Morphing",
        slug: "shape-morphing",
        thumbnailImage: shapeMorphingGif,
        projectionImage: shapeMorphingGif,
        topic: "Computer Animation",
        skills: ["C++", "OpenGL (GLUT)", "Vertex-Based Shape Morphing", "Linear Interpolation (LERP)", "Modular OOP Design", "Double-Buffered Rendering"],
        description: "A C++ OpenGL app that morphs custom shapes through interpolation and vertex resampling.",
        duration: "2024/09 - 2024/10",
        githubLink: "https://github.com/LiberteI/Computer_Animation",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Easy Shop",
        slug: "easy-shop",
        thumbnailImage: agentThumbnailImage,
        projectionImage: agentThumb,
        topic: "Agentic AI",
        skills: ["AI Agents", "Large Language Models (LLM)", "Retrieval-Augmented Generation (RAG)", "MongoDB", "n8n Automation", "Conversational System Design"],
        description: "A WhatsApp AI shopping agent with memory, inventory awareness, and automated ordering.",
        duration: "2025/01 - 2025/03",
        githubLink: "https://github.com/LiberteI",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Knight of Cinders",
        slug: "knight-of-cinders",
        thumbnailImage: projectThumbnailImage,
        projectionImage: projectThumb,
        topic: "Game Development",
        skills: ["Unity", "Tilemap", "Cinemachine", "Physics & Raycasting", "Singleton Architecture", "State-Driven Systems"],
        description: "A dark 2D action game with stamina-based combat, boss fights, and cinematic atmosphere.",
        duration: "2023/09 - 2024/01",
        githubLink: "https://github.com/LiberteI/KnightOfCinders_firstProject",
        ownership: "solo",
        projectTier: "featured"
    },
    {
        title: "Bubble Biologist",
        slug: "bubble-biologist",
        thumbnailImage: bubbleThumbnailImage,
        projectionImage: bubbleThumb,
        topic: "Game Development",
        skills: ["Unity", "Gameplay Programming", "Physics Systems", "Git Collaboration", "Rapid Iteration", "2D Game Development"],
        description: "A fast-paced Game Jam platformer built around bubble survival and physics-driven movement.",
        duration: "2025/01 - 2025/01",
        githubLink: "https://github.com/LydiaV2001/GGJ2025",
        ownership: "team",
        projectTier: "archive"
    }
]

const projectThumbnailImage = "/images/project-thumbnails/compressed-img/knight-thumbnail.webp"
const projectModalImage = "/images/project-projections/kight-of-cinders-projection.png"
const projectProjectionImage = "/images/project-projections/compressed-img/kight-of-cinders-projection.webp"
const healthNavigatorThumbnailImage = "/images/project-thumbnails/compressed-img/health-nav.webp"
const healthNavigatorModalImage = "/images/project-projections/health-nav.png"
const healthNavigatorProjectionImage = "/images/project-projections/compressed-img/health-nav.webp"
const bubbleThumbnailImage = "/images/project-thumbnails/compressed-img/bubble.webp"
const bubbleModalImage = "/images/project-projections/bubble.webp"
const bubbleProjectionImage = "/images/project-projections/compressed-img/bubble.webp"
const agentThumbnailImage = "/images/project-thumbnails/compressed-img/agent.webp"
const agentModalImage = "/images/project-projections/agent.png"
const agentProjectionImage = "/images/project-projections/compressed-img/agent.webp"
const supervisedLearningThumbnailImage = "/images/project-thumbnails/compressed-img/supervised-learning.webp"
const supervisedLearningModalImage = "/images/project-projections/supervise-learning.png"
const supervisedLearningProjectionImage = "/images/project-projections/compressed-img/supervise-learning.webp"
const dalTutorThumbnailImage = "/images/project-thumbnails/compressed-img/dal-tutor.webp"
const dalTutorModalImage = "/images/project-projections/dal-tutor.png"
const dalTutorProjectionImage = "/images/project-projections/compressed-img/dal-tutor.webp"
const iceSpyThumbnailImage = "/images/project-thumbnails/compressed-img/ice-spy.webp"
const iceSpyModalImage = "/images/project-projections/ice-spy.png"
const iceSpyProjectionImage = "/images/project-projections/compressed-img/ice-spy.webp"
const portfolioThumbnailImage = "/images/project-thumbnails/compressed-img/portfolio.webp"
const portfolioModalImage = "/images/project-projections/portfolio-projection.png"
const portfolioProjectionImage = "/images/project-projections/compressed-img/portfolio-projection.webp"
const shapeMorphingGif = "/images/project-previews/shape-morphing.gif"
const shapeMorphingModalImage = "/images/project-projections/shape-morphing.png"
const shapeMorphingProjectionImage = "/images/project-projections/compressed-img/shape-morphing.webp"
const astronomyGif = "/images/project-previews/astronomy.gif"
const astronomyModalImage = "/images/project-projections/astronomy.png"
const astronomyProjectionImage = "/images/project-projections/compressed-img/astronomy.webp"
const oceanGif = "/images/project-previews/ocean.gif"
const oceanModalImage = "/images/project-projections/ocean-simulator.png"
const oceanProjectionImage = "/images/project-projections/compressed-img/ocean-simulator.webp"

export const projectRecords = [
    {
        title: "My Portfolio",
        slug: "my-portfolio",
        thumbnailImage: portfolioThumbnailImage,
        modalImage: portfolioModalImage,
        projectionImage: portfolioProjectionImage,
        topic: "Full-Stack Development",
        skills: ["React", "Node.js", "MongoDB", "Javascript", "Full Stack"],
        description: "A full-stack portfolio site with interactive 3D scenes, responsive layouts, and dynamic content.",
        duration: "2025/10 - present",
        githubLink: "https://github.com/LiberteI/My_Portfolio",
        ownership: "solo",
        projectTier: "featured"
    },
    {
        title: "Knight of Cinders",
        slug: "knight-of-cinders",
        thumbnailImage: projectThumbnailImage,
        modalImage: projectModalImage,
        projectionImage: projectProjectionImage,
        topic: "Game Development",
        skills: ["Unity", "Tilemap", "Cinemachine", "Physics & Raycasting", "Singleton Architecture", "State-Driven Systems"],
        description: "A dark 2D action game with stamina-based combat, boss fights, and cinematic atmosphere.",
        duration: "2025/06 - 2025/08",
        githubLink: "https://github.com/LiberteI/KnightOfCinders_firstProject",
        ownership: "solo",
        projectTier: "featured"
    },
    {
        title: "NS Health Navigator",
        slug: "health-navigator",
        thumbnailImage: healthNavigatorThumbnailImage,
        modalImage: healthNavigatorModalImage,
        projectionImage: healthNavigatorProjectionImage,
        topic: "Software development",
        skills: ["Agentic AI", "Data processing", "Python", "FastAPI"],
        description: "Engineered a full-stack healthcare assistant integrating ML inference, REST APIs, and workflow automation for intelligent patient triage.",
        duration: "2026/03 - 2026/03",
        githubLink: "https://github.com/quangphucthan/cgi-datajam-2026",
        ownership: "team",
        projectTier: "archive"
    },
    {
        title: "Housing Price Predictor",
        slug: "housing-price-predictor",
        thumbnailImage: supervisedLearningThumbnailImage,
        modalImage: supervisedLearningModalImage,
        projectionImage: supervisedLearningProjectionImage,
        topic: "Supervised Learning",
        skills: ["Python", "Regression Modeling", "Data Preprocessing", "Model Evaluation", "Data Visualization"],
        description: "An end-to-end regression pipeline for predicting housing prices from real-world data.",
        duration: "2025/11 - 2025/11",
        githubLink: "https://github.com/LiberteI/Supervised-Learning-Workshop",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Dal Tutor",
        slug: "dal-tutor",
        thumbnailImage: dalTutorThumbnailImage,
        modalImage: dalTutorModalImage,
        projectionImage: dalTutorProjectionImage,
        topic: "Software Development",
        skills: ["Agile Development", "Extreme Programming (XP)", "Java", "Android Studio", "Team Collaboration"],
        description: "An Android tutoring platform built through Agile iterations and collaborative delivery.",
        duration: "2025/09 - 2025/11",
        githubLink: "https://github.com/LiberteI/dalTutor",
        ownership: "team",
        projectTier: "archive"
    },
    {
        title: "Ocean Simulation",
        slug: "ocean-simulation",
        thumbnailImage: oceanGif,
        modalImage: oceanModalImage,
        projectionImage: oceanProjectionImage,
        topic: "Computer Animation",
        skills: ["C++", "OpenGL (GLEW)", "Vertex & Fragment Shaders", "Lighting", "Camera & Input Systems", "Real-Time Animation Systems"],
        description: "A C++ OpenGL submarine simulator with lighting, fog, animated waves, and interactive navigation.",
        duration: "2025/11 - 2025/12",
        githubLink: "https://github.com/LiberteI/Submarine",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Astronomical Simulation",
        slug: "astronomical-simulation",
        thumbnailImage: astronomyGif,
        modalImage: astronomyModalImage,
        projectionImage: astronomyProjectionImage,
        topic: "Computer Animation",
        skills: ["C++", "OpenGL (GLUT)", "3D Graphics & Transformations", "Camera & Projection Systems", "Vertex-Based Rendering", "Double & Depth Buffering"],
        description: "A C++ OpenGL planetary scene with animated orbits, stars, and interactive camera controls.",
        duration: "2025/10 - 2025/10",
        githubLink: "https://github.com/LiberteI/Astronomical_System",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Ice Spy",
        slug: "ice-spy",
        thumbnailImage: iceSpyThumbnailImage,
        modalImage: iceSpyModalImage,
        projectionImage: iceSpyProjectionImage,
        topic: "Machine Learning",
        skills: ["Machine Learning", "Data Analysis", "Pathfinding", "Geospatial Mapping", "Algorithm Design"],
        description: "A hackathon project using ML and pathfinding to optimize Arctic shipping routes.",
        duration: "2025/10 - 2025/10",
        githubLink: "https://github.com/hongh233/NASA",
        ownership: "team",
        projectTier: "archive"
    },
    {
        title: "Shape Morphing",
        slug: "shape-morphing",
        thumbnailImage: shapeMorphingGif,
        modalImage: shapeMorphingModalImage,
        projectionImage: shapeMorphingProjectionImage,
        topic: "Computer Animation",
        skills: ["C++", "OpenGL (GLUT)", "Vertex-Based Shape Morphing", "Linear Interpolation (LERP)", "Modular OOP Design", "Double-Buffered Rendering"],
        description: "A C++ OpenGL app that morphs custom shapes through interpolation and vertex resampling.",
        duration: "2025/09 - 2025/10",
        githubLink: "https://github.com/LiberteI/Computer_Animation",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Easy Shop",
        slug: "easy-shop",
        thumbnailImage: agentThumbnailImage,
        modalImage: agentModalImage,
        projectionImage: agentProjectionImage,
        topic: "Agentic AI",
        skills: ["AI Agents", "Large Language Models (LLM)", "Retrieval-Augmented Generation (RAG)", "MongoDB", "n8n Automation", "Conversational System Design"],
        description: "A WhatsApp AI shopping agent with memory, inventory awareness, and automated ordering.",
        duration: "2025/09 - 2025/09",
        githubLink: "https://github.com/LiberteI",
        ownership: "solo",
        projectTier: "archive"
    },
    {
        title: "Bubble Biologist",
        slug: "bubble-biologist",
        thumbnailImage: bubbleThumbnailImage,
        modalImage: bubbleModalImage,
        projectionImage: bubbleProjectionImage,
        topic: "Game Development",
        skills: ["Unity", "Gameplay Programming", "Physics Systems", "Git Collaboration", "Rapid Iteration", "2D Game Development"],
        description: "A fast-paced Game Jam platformer built around bubble survival and physics-driven movement.",
        duration: "2025/01 - 2025/01",
        githubLink: "https://github.com/LydiaV2001/GGJ2025",
        ownership: "team",
        projectTier: "archive"
    }
]

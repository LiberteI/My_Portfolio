import "./Project.css"
import ProjectCard from "./ProjectCard"
import projectThumb from "../../assets/ProjectThumbnail/KnightThumbnail.png"
import deadzoneThumb from "../../assets/ProjectThumbnail/deadzone_thumbnail.png"
import shapeMorphingGif from "../../assets/ProjectThumbnail/ShapeMorphing.gif"
import astronomyGif from "../../assets/ProjectThumbnail/astronomy.gif"
import oceanGif from "../../assets/ProjectThumbnail/ocean.gif"
import bubbleThumb from "../../assets/ProjectThumbnail/Bubble.png"
import agentThumb from "../../assets/ProjectThumbnail/agent.png"
import supervisedLearningThumb from "../../assets/supervisedLearning.png"
import dalTutorThumb from "../../assets/daltutor.png"
import iceSpyThumb from "../../assets/iceSpy.png"
import susThumb from "../../assets/sus.png"
import portfolioThumb from "../../assets/portfolio.png"

const projects = [
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
        title: "Deadzone",
        slug: "deadzone",
        image: deadzoneThumb,
        canLink: false,
        topic: "Game Development",
        skills: "Unity · C# · Finite State Machines (FSM) · Enemy & Ally AI · Event-Driven Architecture · Gameplay Systems Design",
        description:"Designing and developing an indie 2D post-apocalyptic zombie survival shooter focused on responsive combat, barricade defense, and intelligent AI systems. Built modular, state-driven player and enemy behaviors using clean architecture to create emergent gameplay, tactical depth, and a polished, skill-based player experience.",
        githubLink:"https://github.com/LiberteI/DeadZone",
        isSoloProject: true
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
        title: "Bubble Biologist",
        slug: "bubble-biologist",
        image: bubbleThumb,
        topic: "Game Development",
        skills: "Unity · Gameplay Programming · Physics Systems · Git Collaboration · Rapid Iteration · 2D Game Development",
        description:"Developed a 2D platformer during Global Game Jam 2025 in a 48-hour sprint. Implemented physics-based movement, a shrinking bubble survival mechanic, and dynamic bounce controls in Unity. Collaborated on original pixel art, animations, and an animated cutscene, rapidly prototyping gameplay systems under tight time constraints.",
        githubLink:"https://github.com/LydiaV2001/GGJ2025",
        isSoloProject: false,
        canLink: false
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
        title: "Sustainable Community",
        slug: "sustainable-community",
        image: susThumb,
        topic: "Full-Stack Development",
        skills: "Web Application Development · Inclusive UX Design · AI-Powered Verification · Voice Interface Design",
        description: "Built Watt the Hack during the Cognizant BrAInstorm Hackathon, a sustainability-focused web app promoting inclusive, community-driven action. Delivered real-time feedback, AI-verified rewards, and voice-controlled accessibility features to motivate collective impact and make sustainable practices engaging, visible, and accessible to all users.",
        githubLink: "https://github.com/LiberteI/Watt_the_Hack",
        isSoloProject: false,
        canLink: false
    },
    {
        title: "Housing Price Predictor",
        slug: "housing-price-predictor",
        image: supervisedLearningThumb,
        topic: "Supervised Learning",
        skills: "Supervised Learning · Regression Modeling · Data Preprocessing · scikit-learn Pipelines · Model Evaluation · Data Visualization",
        description: "Completed an end-to-end supervised learning project predicting housing prices using real-world data. Built a reproducible scikit-learn pipeline covering data cleaning, preprocessing, regression modeling, evaluation with RMSE and MAE, visualization, and result interpretation across the full machine learning workflow.",
        githubLink: "https://github.com/LiberteI/Supervised-Learning-Workshop",
        isSoloProject: true,
        canLink: false
    }

    

]

const Project = () => {
    return (
        <section className="project-container" id="projects">

            <h1>My Projects</h1>
            
            <div className="project-grid">
                {projects.map((project) => (
                    <ProjectCard 
                        key={project.slug} 
                        projectData={project}
                    />
                        
                ))}
            </div>

        </section>
    )
}

export default Project

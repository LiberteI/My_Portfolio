import './About.css'
const jsIcon = '/images/language-icons/compressed-img/js.webp'
const tsIcon = '/images/language-icons/compressed-img/typescript.webp'
const pythonIcon = '/images/language-icons/compressed-img/python.webp'
const javaIcon = '/images/language-icons/compressed-img/java.webp'
const cppIcon = '/images/language-icons/compressed-img/cpp.webp'
const csharpIcon = '/images/language-icons/compressed-img/csharp.webp'
const cssHtmlIcon = '/images/language-icons/compressed-img/css-html.webp'
const glslIcon = '/images/language-icons/compressed-img/glsl.webp'
const reactIcon = '/images/framework-icons/compressed-img/react.webp'
const nodeIcon = '/images/framework-icons/compressed-img/node.webp'
const firebaseIcon = '/images/framework-icons/compressed-img/firebase.webp'
const mongodbIcon = '/images/framework-icons/compressed-img/mongodb.webp'
const unityIcon = '/images/framework-icons/compressed-img/unity.webp'
const unrealIcon = '/images/framework-icons/compressed-img/unreal.webp'
const androidStudioIcon = '/images/framework-icons/compressed-img/android-studio.webp'
const openglIcon = '/images/framework-icons/compressed-img/opengl.webp'
const sqlIcon = '/images/framework-icons/compressed-img/sql.webp'
const n8nIcon = '/images/framework-icons/compressed-img/n8n.webp'
const musescoreIcon = '/images/framework-icons/compressed-img/musescore.webp'
const gitIcon = '/images/dev-tool-icons/compressed-img/git.webp'
const githubIcon = '/images/dev-tool-icons/compressed-img/github.webp'
const gitlabIcon = '/images/dev-tool-icons/compressed-img/gitlab.webp'
const postmanIcon = '/images/dev-tool-icons/compressed-img/postman.webp'
const About = () => {

    return(
        <section className="about-container" id="about">
            <h1>About Me</h1>
            <article className='paragraph-container'>
                <p>  My name is Yiming Yang (Liberte), a third-year Computer Science student at Dalhousie University.</p>

                <p>  I am a programmer with interests in game development, full-stack development, animation and AI & machine learning.</p>

                <p>  Beyond programming, I am a trained pianist, and my favorite composer is Ludwig van Beethoven.</p>

            </article>
            <h2>My Tech Stack</h2>
            <div className="stack-container">
                <div>
                    <h3>Languages</h3>
                    <div className='language-container'>
                        <img className="tech-icon" src={csharpIcon} alt="C#" title="C#" />
                        <img className="tech-icon" src={cppIcon} alt="C++" title="C++" />
                        <img className="tech-icon" src={javaIcon} alt="Java" title="Java" />
                        <img className="tech-icon" src={jsIcon} alt="JavaScript" title="JavaScript" />
                        <img className="tech-icon" src={glslIcon} alt="GLSL" title="GLSL" />
                        <img className="tech-icon" src={pythonIcon} alt="Python" title="Python" />
                        <img className="tech-icon" src={tsIcon} alt="TypeScript" title="TypeScript" />
                        <img className="tech-icon" src={cssHtmlIcon} alt="HTML & CSS" title="HTML & CSS" />
                        
                    </div>
                </div>

                <div>
                    <h3>Frameworks</h3>
                    <div className='framework-container'>
                        <img className="tech-icon" src={reactIcon} alt="React" title="React" />
                        <img className="tech-icon" src={nodeIcon} alt="Node.js" title="Node.js" />
                        <img className="tech-icon" src={firebaseIcon} alt="Firebase" title="Firebase" />
                        <img className="tech-icon" src={mongodbIcon} alt="MongoDB" title="MongoDB" />
                        <img className="tech-icon" src={unityIcon} alt="Unity" title="Unity" />
                        <img className="tech-icon" src={unrealIcon} alt="Unreal Engine" title="Unreal Engine" />
                        <img className="tech-icon" src={androidStudioIcon} alt="Android Studio" title="Android Studio" />
                        <img className="tech-icon" src={openglIcon} alt="OpenGL" title="OpenGL" />
                        <img className="tech-icon" src={sqlIcon} alt="SQL" title="SQL" />
                        <img className="tech-icon" src={n8nIcon} alt="n8n" title="n8n" />
                        <img className="tech-icon" src={musescoreIcon} alt="MuseScore" title="MuseScore" />
                    </div>
                </div>

                <div>
                    <h3>Dev Tools</h3>
                    <div className='devtools-container'>
                        <img className="tech-icon" src={gitIcon} alt="Git" title="Git" />
                        <img className="tech-icon" src={githubIcon} alt="GitHub" title="GitHub" />
                        <img className="tech-icon" src={gitlabIcon} alt="GitLab" title="GitLab" />
                        <img className="tech-icon" src={postmanIcon} alt="Postman" title="Postman" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About

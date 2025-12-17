import './About.css'
import jsIcon from '../../assets/icons/js.png'
import tsIcon from '../../assets/icons/typescript.png'
import pythonIcon from '../../assets/icons/python.png'
import javaIcon from '../../assets/icons/java.png'
import cppIcon from '../../assets/icons/cpp.png'
import csharpIcon from '../../assets/icons/csharp.png'
import reactIcon from '../../assets/framework/react.png'
import nodeIcon from '../../assets/framework/node.png'
import firebaseIcon from '../../assets/framework/firebase.png'
import mongodbIcon from '../../assets/framework/mongodb.png'
import unityIcon from '../../assets/framework/unity.png'
import unrealIcon from '../../assets/framework/unreal.png'
import androidStudioIcon from '../../assets/framework/androidStudio.png'
import openglIcon from '../../assets/framework/opengl.png'
import sqlIcon from '../../assets/framework/sql.png'
import n8nIcon from '../../assets/framework/n8n.png'
import musescoreIcon from '../../assets/framework/musescore.png'
import gitIcon from '../../assets/devTools/git.png'
import githubIcon from '../../assets/devTools/github.png'
import gitlabIcon from '../../assets/devTools/gitlab.png'
import postmanIcon from '../../assets/devTools/postman.png'
const About = () => {

    return(
        <section className="about-container">
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
                        <img className="tech-icon" src={pythonIcon} alt="Python" title="Python" />
                        <img className="tech-icon" src={tsIcon} alt="TypeScript" title="TypeScript" />
                        
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

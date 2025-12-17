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
                        <img src={csharpIcon} alt="C#" />
                        <img src={cppIcon} alt="C++" />
                        <img src={javaIcon} alt="Java" />
                        <img src={jsIcon} alt="JavaScript" />
                        <img src={pythonIcon} alt="Python" />
                        <img src={tsIcon} alt="TypeScript" />
                        
                    </div>
                </div>

                <div>
                    <h3>Frameworks</h3>
                    <div className='framework-container'>
                        <img src={reactIcon} alt="React" />
                        <img src={nodeIcon} alt="Node.js" />
                        <img src={firebaseIcon} alt="Firebase" />
                        <img src={mongodbIcon} alt="MongoDB" />
                        <img src={unityIcon} alt="Unity" />
                        <img src={unrealIcon} alt="Unreal Engine" />
                        <img src={androidStudioIcon} alt="Android Studio" />
                        <img src={openglIcon} alt="OpenGL" />
                        <img src={sqlIcon} alt="SQL" />
                        <img src={n8nIcon} alt="n8n" />
                        <img src={musescoreIcon} alt="MuseScore" />
                    </div>
                </div>

                <div>
                    <h3>Dev Tools</h3>
                    <div className='devtools-container'>
                        <img src={gitIcon} alt="Git" />
                        <img src={githubIcon} alt="GitHub" />
                        <img src={gitlabIcon} alt="GitLab" />
                        <img src={postmanIcon} alt="Postman" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About

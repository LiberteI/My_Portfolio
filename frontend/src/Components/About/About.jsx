import './About.css'
import jsIcon from '../../assets/icons/js.png'
import tsIcon from '../../assets/icons/typescript.png'
import pythonIcon from '../../assets/icons/python.png'
import javaIcon from '../../assets/icons/java.png'
import cppIcon from '../../assets/icons/cpp.png'
import csharpIcon from '../../assets/icons/csharp.png'
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
                </div>

                <div>
                    <h3>Dev Tools</h3>
                </div>
            </div>
        </section>
    )
}

export default About

import './About.css'
const About = () => {

    return(
        <section className="about-container">
            <h1>About Me</h1>
            <article>
                <p>My name is Yiming Yang (Liberte), a third-year Computer Science student at Dalhousie University.</p>

                <p>I am a programmer with interests in game development, full-stack development, and AI & machine learning.</p>

                <p>Beyond programming, I am a trained pianist, and my favorite composer is Ludwig van Beethoven.</p>

            </article>
            <h2>My Tech Stack</h2>
            <div className="stack-container">
                <div>
                    <h3>Languages</h3>
                </div>

                <div>
                    <h3>Frameworks</h3>
                </div>

                <div>
                    <h3>Libraries</h3>
                </div>

                <div>
                    <h3>Dev Tools</h3>
                </div>
            </div>
        </section>
    )
}

export default About
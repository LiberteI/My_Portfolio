import Navbar from "../../Components/Navbar/Navbar"
import invocation from "../../assets/Animations/invocation.gif"

const KnightGame = () => {
    return (
        <div className="app-container">
            <Navbar activeLabel="Projects" />
            <div className="knightGame-container">
                <video src="/knightTrailer.mp4" controls playsInline poster="/images/project-thumbnails/knight-thumbnail.png" />

                <div className="knightGame-content">
                    <img className="knightGame-gif" src={invocation} alt="Knight of Cinders invocation animation" />
                    <p className="knightGame-description">
                        Gameplay trailer for <strong>Knight of Cinders</strong>.
                        Core combat systems and logic were preserved after a local
                        asset deletion incident.
                    </p>

                    <a href="https://drive.google.com/file/d/1QigchoK-Ckn5wDokIMy8jG526GJFgCHP/view" className="download-button">
                        Download Build for Mac
                    </a>
                </div>
            </div>
        </div>
    )
}

export default KnightGame

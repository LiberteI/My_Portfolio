import idleGIF from "../../assets/Animations/npc/Idle.gif"
import thumbupGIF from "../../assets/Animations/npc/ThumbUp.gif"
import waveGIF from "../../assets/Animations/npc/Wave.gif"
import './Chatbot.css'
import { useEffect, useState } from "react"
const Chatbot = (props) => {
    const [currentAnimation, setCurrentAnimation] = useState(idleGIF);

    useEffect(() => {
        if(props.clicked){
            setCurrentAnimation(thumbupGIF);
            return;
        }
        if(props.shouldIdle){
            setCurrentAnimation(idleGIF);
        }
        else{
            setCurrentAnimation(waveGIF);
        }
    }, [props.shouldIdle, props.clicked]);

    return(
        <img className="chatbot" src={currentAnimation} alt="Chatbot" />
        
    )
}

export default Chatbot

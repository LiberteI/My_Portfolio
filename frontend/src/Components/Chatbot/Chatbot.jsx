import idleGIF from "../../assets/Animations/npc/Idle.gif"
import dialogueGIF from "../../assets/Animations/npc/Dialogue.gif"
import thumbupGIF from "../../assets/Animations/npc/ThumbUp.gif"
import './Chatbot.css'
const Chatbot = () => {
    /*
        this chatbot should be put on the roof
    */
    return(
        <img className='chatbot' src={idleGIF} alt="" />
    )
}

export default Chatbot

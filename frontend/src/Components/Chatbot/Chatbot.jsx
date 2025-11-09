import botIdle from '../../assets/Animations/chatbot/Idle.gif'
import botDialogue from '../../assets/Animations/chatbot/Dialogue.gif'
import botThumbUp from '../../assets/Animations/chatbot/ThumbUp.gif'
import '../Home/Home.css'

const Chatbot = () => {

    return (
        <div
            className='chatbot-wrapper'
            
        >
            <div className='chatbot-container'>
                <img className='chatbot idle' src={botIdle} alt="" />
                <img className='chatbot dialogue' src={botDialogue} alt="" />
                <img className='chatbot thumbUp' src={botThumbUp} alt="" />
            </div>
        </div>
    )
}

export default Chatbot
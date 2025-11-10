import botIdle from '../../assets/Animations/chatbot/Idle.gif'
import botDialogue from '../../assets/Animations/chatbot/Dialogue.gif'
import botThumbUp from '../../assets/Animations/chatbot/ThumbUp.gif'
import '../Home/Home.css'
import { useRef, useEffect, useState } from 'react'


const Chatbot = () => {

    const idleRef = useRef(null);
    const dialogueRef = useRef(null);
    const thumbUpRef = useRef(null);
    const containerRef = useRef(null);

    const [botState, setBotState] = useState('idle');

    useEffect(() => {
        const idle = idleRef.current;
        const dialogue = dialogueRef.current;
        const thumbUp = thumbUpRef.current;
        const container = containerRef.current

        const handleHover = () => setBotState('dialogue');
        const handleUnhover = () => setBotState('idle');

        container.addEventListener('mouseenter', handleHover);
        container.addEventListener('mouseleave', handleUnhover);
        
        return () => {
            container.removeEventListener('mouseenter', handleHover);
            container.removeEventListener('mouseleave', handleUnhover);
        };
    }, []);
    
    useEffect(() => {
        const idle = idleRef.current;
        const dialogue = dialogueRef.current;
        const thumbUp = thumbUpRef.current;
        

        if(botState === 'idle'){
            idle.style.display = 'block';
            dialogue.style.display = 'none';
            thumbUp.style.display = 'none';
        }
        if(botState === 'dialogue'){
            idle.style.display = 'none';
            dialogue.style.display = 'block';
            thumbUp.style.display = 'none';
        }
    });
    return (
        <div className='chatbot-wrapper'>
            <div ref={containerRef} className='chatbot-container'>
                <img className='chatbot idle' src={botIdle} ref={idleRef} alt="" />
                <img className='chatbot dialogue' src={botDialogue} ref={dialogueRef} alt="" />
                <img className='chatbot thumbUp' src={botThumbUp} ref={thumbUpRef} alt="" />
            </div>
        </div>
    )
}

export default Chatbot
import './Home.css'
import React, { useEffect, useRef, useState } from 'react'

// Parallax skyline layers
import moon from '../../assets/City/bg/Moon.png'
import sky from '../../assets/City/bg/Sky.png'
import skyFlip from '../../assets/City/bg/flip.png'
import buildingBack from '../../assets/City/bg/buildingBack.png'
import buildingFar from '../../assets/City/bg/buildingFar.png'
import buildingMid from '../../assets/City/bg/buildingMid.png'
import buildingClose from '../../assets/City/bg/buildingClose.png'
import Chatbot from '../Chatbot/Chatbot'
import tile from '../../assets/City/bg/tile.png'
import youtubeIcon from '../../assets/youtube.png'
import linkedinIcon from '../../assets/linkedin.png'
import githubIcon from '../../assets/github.png'




const Home = () => {
    // Store references to each skyline layer for parallax transforms
    const farRef = useRef(null);
    const midRef = useRef(null);
    const backRef = useRef(null);
    const closeRef = useRef(null);
    const skyRef = useRef(null);
    const moonRef = useRef(null);
    const skyDupRef = useRef(null);

    // Handle parallax scrolling by translating each skyline layer at different speeds
    useEffect(() => {
        // useEffect with [] runs once after mount, ideal for wire-up of global listeners
        // prevent multiple fires at once
        let running = false;

        // Arrow fn: translates each skyline layer according to scroll delta + its speed
        const handleScroll = () => {
            if(running){
                return;
            }
            running = true;

            window.requestAnimationFrame(() => {
                const layers = [
                    { ref: moonRef, speed: 0.4, base: 'scale(1.2) translate(20%, -10%)'},
                    { ref: skyRef, speed: 0.33, base: ''},
                    { ref: skyDupRef, speed: 0.33, base: 'translateX(100%)'},
                    { ref: backRef, speed: 0.28, base: 'translateY(-30%) scale(1.3)'},
                    { ref: farRef, speed: 0.18, base: 'translateY(-25%)'},
                    { ref: midRef, speed: 0.22, base: 'translateY(-20%)'},
                    { ref: closeRef, speed: 0.1, base: ''},
                    
                ];

                layers.forEach(({ref, speed, base}) => {
                    if(ref.current){
                        const offsetY = window.scrollY * speed;
                        
                        let baseTransform = '';
                        if (typeof base === 'string') {
                            baseTransform = base;
                        }

                        let separator = '';
                        if (baseTransform.length > 0) {
                            separator = ' ';
                        }

                        ref.current.style.transform = `${baseTransform}${separator}translate3d(0, ${offsetY}px, 0)`;
                    }
                });
                running = false;
            });
        };
        // runs once when the effect fires and not call event.preventDefault()
        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    const greetingText = "Hello There!";
    const introductionText = "I am Yiming Yang (Liberté) \na developer and Pianist \n (Click Me)";
    
    const [shouldIdle, setShouldIdle] = useState(false);
    const [typedText, setTypedText] = useState('');

    const idleInterval = 8000;
    const waveInterval = 1700;
    const [currentText, setCurrentText] = useState(greetingText);

    useEffect(() => {
        const curDelay = shouldIdle ? idleInterval : waveInterval;
        // toggle shouldIdle every 3 seconds
        const toggleShouldIdle = setTimeout(() => {
            setShouldIdle(shouldIdle => !shouldIdle);
        }, curDelay);

        // zero out current interval
        return () => clearTimeout(toggleShouldIdle);
    }, [shouldIdle]);

    // change current text when shouldIdle changes and synchronise npc-bubble width with text's width
    useEffect(() => {
        if(shouldIdle){
            setCurrentText(introductionText);
        }
        else{
            setCurrentText(greetingText);
        }
    }, [shouldIdle])

    // Typewriter effect that replays whenever the bubble text changes
    useEffect(() => {
        let charIndex = 0;
        setTypedText('');

        const typingSpeedMs = 20;
        const intervalId = setInterval(() => {
            charIndex += 1;
            setTypedText(currentText.slice(0, charIndex));

            if(charIndex >= currentText.length){
                clearInterval(intervalId);
            }
        }, typingSpeedMs);

        return () => clearInterval(intervalId);
    }, [currentText]);
    
    const [clicked, setClicked] = useState(false);
    const [shouldShowSocials, setShouldShowSocials] = useState(false);

    const handleClick = () => {
        setClicked(true);
        setShouldShowSocials(true);
        const toggleClicked = setTimeout(() => {
            setClicked(false);
            
        }, 830);
        
        const toggleSocialButtonFlag = setTimeout(() => {
            setShouldShowSocials(false);

        }, 6000);
        // console.log(shouldShowSocials);
    };

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const invokeBackend = async () => {
        const response = await fetch(`${apiBase}/api/health`, {
            method: "GET",
            credentials: "include"
        });

    }

    useEffect(() => {
        invokeBackend();
        const keepHealth = setInterval(() => {
            invokeBackend();
        }, 5 * 60 * 1000);
        return () => clearInterval(keepHealth);
    }, [])
    
    return(
        <main id='home' className='home'>
            {/* Parallax skyline stack */}
            <section className='home-scene'>
                
                <img className='home-bg-sky' ref={skyRef} src={sky} alt="sky" />
                <img className='home-bg-sky-dup' ref={skyDupRef} src={skyFlip} alt="sky" />
                <img className='home-bg-moon' ref={moonRef} src={moon} alt="moon" />
                <img className='home-bg-building-far' ref={farRef} src={buildingFar} alt="Far skyline" />
                <img className='home-bg-building-mid' ref={midRef} src={buildingMid} alt="Mid skyline" />
                <img className='home-bg-building-back' ref={backRef} src={buildingBack} alt="Back skyline" />
                <img className='home-bg-building-close' ref={closeRef} src={buildingClose} alt="Close skyline" />
                <img className='home-tile' src={tile} alt="tilemap" />

                {!shouldShowSocials && (
                    <div className='npc-bubble'>{typedText}</div>
                )}

                <div className={`socials ${shouldShowSocials ? 'is-visible' : ''}`}>
                        <a href="https://www.youtube.com/@Liberteeeee-hd7zg"><img src={youtubeIcon} alt="" /></a>
                        
                        <a href="https://github.com/LiberteI"><img src={githubIcon} alt="" /></a>
                        <a href="https://www.linkedin.com/in/yiming-yang-89a0102a0/"><img src={linkedinIcon} alt="" /></a>
                        
                </div>
                
                <button className="chatbot-button" onClick={handleClick}>
                    <Chatbot clicked={clicked} shouldIdle={shouldIdle}/>
                </button>
                
            </section>
        </main>
    )

}

export default Home

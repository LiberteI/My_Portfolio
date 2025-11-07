import './Home.css'
import React, { useEffect, useRef, useState } from 'react'
import moon from '../../assets/City/bg/Moon.png'
import sky from '../../assets/City/bg/Sky.png'
import skyFlip from '../../assets/City/bg/flip.png'
import buildingBack from '../../assets/City/bg/buildingBack.png'
import buildingFar from '../../assets/City/bg/buildingFar.png'
import buildingMid from '../../assets/City/bg/buildingMid.png'
import buildingClose from '../../assets/City/bg/buildingClose.png'

import tile from '../../assets/City/bg/tile.png'
import foregound from '../../assets/City/bg/foreground.png'

// import me-animation
import meIdle from '../../assets/Animations/Me/Idle.gif'
import meIdle2 from '../../assets/Animations/Me/Idle2.gif'
import meWalk from '../../assets/Animations/Me/Walk.gif'
const Home = () => {
    // store refs so that we can directly access DOM
    const farRef = useRef(null);
    const midRef = useRef(null);
    const backRef = useRef(null);
    const closeRef = useRef(null);
    const skyRef = useRef(null);
    const moonRef = useRef(null);
    const skyDupRef = useRef(null);
    const fore = useRef(null);

    const meIdleRef = useRef(null);
    const meIdle2Ref = useRef(null);
    const meWalkRef = useRef(null);

    // vertical parallax
    useEffect(() => {
        // prevent multiple fires at once
        let running = false;

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
                    { ref: fore, speed: 0, base: 'scale(1.6) translateY(21%)'},
                    
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

    const [myState, setMyState] = useState('idle');
    
    const [keyHeld, setKeyHeld] = useState(null);

    useEffect(() => {
    
        const handleKeyDown = (e) => {
            if(e.key === 'a' || e.key === 'd'){
                setKeyHeld(e.key);
                setMyState('walk');
            }
            
        };
        const handleKeyUp = (e) => {
            if(e.key === 'a' || e.key === 'd'){
                setKeyHeld(null);
                setMyState('idle');
            }
        }
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('keydown', handleKeyDown);
        return () =>{
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, []);
    useEffect(() => {
        const idle = meIdleRef.current;
        const walk = meWalkRef.current;
        const idle2 = meIdle2Ref.current;
        if(!idle || !walk || !idle2){
            return;
        }
        if(myState === 'idle'){
            idle.style.display = 'block';
            walk.style.display = 'none';
            idle2.style.display = 'none';
        }
        else if(myState === 'walk'){
            idle.style.display = 'none';
            walk.style.display = 'block';
            idle2.style.display = 'none';
        }
        // render once and do it again when mystate changes
    }, [myState, keyHeld]);

    const walkSpeed = 1;
    const [isFacingRight, setIsFacingRight] = useState(true);
    const heldRef = useRef(null);
    useEffect(() => {
        const idle = meIdleRef.current;
        const walk = meWalkRef.current;
        const idle2 = meIdle2Ref.current;
        let shouldFaceRight = isFacingRight;

        if(!idle || !walk || !idle2){
            return;
        }

        if(myState === 'walk'){
            
            if(keyHeld === 'a'){
                shouldFaceRight = false;
                
            }
            else if(keyHeld === 'd'){
                
                shouldFaceRight = true;
            }
        }
        else if(myState === 'idle'){
           
        }

        if(shouldFaceRight != isFacingRight){
            setIsFacingRight(shouldFaceRight);
        }
        console.log("shoud face right: ",shouldFaceRight);
        console.log("is facing right: ",isFacingRight);
        const separator = ' ';
        const base = 'scale(0.8) translateY(-50%)';
        const flip = shouldFaceRight ? 'scaleX(1)' : 'scaleX(-1)';
        const transform = `${base} ${flip}`;
        idle.style.transform = transform;
        walk.style.transform = transform;
        idle2.style.transform = transform;
        
    }, [myState, isFacingRight, keyHeld])
    return(
        <main id='home' className='home'>
            <section className='home-scene'>
                
                <img className='home-bg-sky' ref={skyRef} src={sky} alt="sky" />
                <img className='home-bg-sky-dup' ref={skyDupRef} src={skyFlip} alt="sky" />
                <img className='home-bg-moon' ref={moonRef} src={moon} alt="moon" />
                <img className='home-bg-building-far' ref={farRef} src={buildingFar} alt="Far skyline" />
                <img className='home-bg-building-mid' ref={midRef} src={buildingMid} alt="Mid skyline" />
                <img className='home-bg-building-back' ref={backRef} src={buildingBack} alt="Back skyline" />
                <img className='home-bg-building-close' ref={closeRef} src={buildingClose} alt="Close skyline" />
                <img className='home-tile' src={tile} alt="tilemap" />
                <img className='home-foreground' ref={fore} src={foregound} alt="" />
            </section>
            <div className='me-container'>
                <img className='me idle' ref={meIdleRef} src={meIdle} alt="" />
                <img className='me idle2' ref={meIdle2Ref} src={meIdle2} alt="" />
                <img className='me walk' ref={meWalkRef} src={meWalk} alt="" />
            </div>
            <div className='chatbot-container'></div>
        </main>
    )

}

export default Home

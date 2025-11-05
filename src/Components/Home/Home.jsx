import './Home.css'
import React, { useEffect, useRef } from 'react'
import moon from '../../assets/City/bg/Moon.png'
import sky from '../../assets/City/bg/Sky.png'
import buildingBack from '../../assets/City/bg/buildingBack.png'
import buildingFar from '../../assets/City/bg/buildingFar.png'
import buildingMid from '../../assets/City/bg/buildingMid.png'
import buildingClose from '../../assets/City/bg/buildingClose.png'

const Home = () => {
    // store refs so that we can directly access DOM
    const farRef = useRef(null);
    const midRef = useRef(null);
    const backRef = useRef(null);
    const closeRef = useRef(null);

    useEffect(()=> {
        // prevent multiple fires at once
        let running = false;

        const handleScroll = () => {
            if(running){
                return;
            }
            running = true;

            window.requestAnimationFrame(() => {
                const layers = [
                    { ref: backRef, speed: 0.1, base: 'translateY(-25%) scale(1.3)'},
                    { ref: farRef, speed: 0.15, base: 'translateY(-20%)'},
                    { ref: midRef, speed: 0.2, base: 'translateY(-20%)'},
                    { ref: closeRef, speed: 0.25, base: 'translateY(-10%)'},
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
        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    return(
        <main className='home'>
            <section className='home-scene'>
                
                <img className='home-bg-sky' src={sky} alt="sky" />
                <img className='home-bg-moon' src={moon} alt="moon" />
                <img className='home-bg-building-far' ref={farRef} src={buildingFar} alt="Far skyline" />
                <img className='home-bg-building-mid' ref={midRef} src={buildingMid} alt="Mid skyline" />
                <img className='home-bg-building-back' ref={backRef} src={buildingBack} alt="Back skyline" />
                <img className='home-bg-building-close' ref={closeRef} src={buildingClose} alt="Close skyline" />
            </section>
        </main>
    )

}

export default Home

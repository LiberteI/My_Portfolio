import './Home.css'
import React, { useEffect, useRef, useState } from 'react'

// Parallax skyline layers
import HomepageNpc from '../../Components/HomepageNpc/HomepageNpc'

const moon = '/images/city/bg/Moon.png'
const sky = '/images/city/bg/Sky.png'
const skyFlip = '/images/city/bg/flip.png'
const buildingFar = '/images/city/bg/buildingFar.png'
const buildingMidFar = '/images/city/bg/buildingMidFar.png'
const buildingMidNear = '/images/city/bg/buildingMidNear.png'
const buildingNear = '/images/city/bg/buildingNear.png'
const tile = '/images/city/bg/tile.png'
const youtubeIcon = '/images/social/youtube.png'
const linkedinIcon = '/images/social/linkedin.png'
const githubIcon = '/images/social/github.png'
const SHOW_HOME_SCENE_DEBUG = false;

const initialLayerVisibility = {
    sky: true,
    skyDup: true,
    moon: true,
    far: true,
    midFar: true,
    midNear: true,
    near: true,
    tile: true,
    bubble: true,
    socials: true,
    homepageNpc: true,
}

const Home = () => {
    // Store references to each skyline layer for parallax transforms
    const farRef = useRef(null);
    const midFarRef = useRef(null);
    const midNearRef = useRef(null);
    const nearRef = useRef(null);
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
                    { ref: moonRef, speed: 0.4, base: 'scale(1.2) translate(20%, -10%) left: 80%; top: 55%;'},
                    { ref: skyRef, speed: 0.33, base: ''},
                    { ref: skyDupRef, speed: 0.33, base: 'translateX(100%)'},
                    { ref: farRef, speed: 0.28, base: 'translateY(-30%) scale(1.3)'},
                    { ref: midFarRef, speed: 0.22, base: 'translateY(-20%)'},
                    { ref: midNearRef, speed: 0.18, base: 'translateY(-25%)'},
                    { ref: nearRef, speed: 0.1, base: ''},
                    
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

    const welcomeText = "Welcome to my website!";
    
    const [shouldIdle, setShouldIdle] = useState(false);
    const [typedText, setTypedText] = useState('');

    const idleInterval = 8000;
    const waveInterval = 1700;

    // Typewriter effect that replays whenever the bubble text changes
    useEffect(() => {
        let charIndex = 0;
        setTypedText('');

        const typingSpeedMs = 20;
        const intervalId = setInterval(() => {
            charIndex += 1;
            setTypedText(welcomeText.slice(0, charIndex));

            if(charIndex >= welcomeText.length){
                clearInterval(intervalId);
            }
        }, typingSpeedMs);

        return () => clearInterval(intervalId);
    }, [welcomeText]);
    
    const [clicked, setClicked] = useState(false);
    const [shouldShowSocials, setShouldShowSocials] = useState(false);
    const [layerVisibility, setLayerVisibility] = useState(initialLayerVisibility);

    const toggleLayerVisibility = (layerName) => {
        setLayerVisibility((current) => ({
            ...current,
            [layerName]: !current[layerName],
        }));
    };

    const handleClick = () => {
        setClicked(true);
        setShouldShowSocials(true);
        setTimeout(() => {
            setClicked(false);
            
        }, 830);
        
        setTimeout(() => {
            setShouldShowSocials(false);

        }, 6000);
        // console.log(shouldShowSocials);
    };

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        const invokeBackend = async () => {
            await fetch(`${apiBase}/api/health`, {
                method: "GET",
                credentials: "include"
            });
        };

        invokeBackend();
        const keepHealth = setInterval(() => {
            invokeBackend();
        }, 5 * 60 * 1000);
        return () => clearInterval(keepHealth);
    }, [apiBase])

    const getLayerDisplay = (layerName) => (
        layerVisibility[layerName] ? undefined : 'none'
    );
    
    return(
        <main id='home' className='home'>
            {/* Parallax skyline stack */}
            <section className='home-scene'>

                {SHOW_HOME_SCENE_DEBUG && (
                    <aside className='home-scene-debug' aria-label='Layer visibility controls'>
                        <strong>Layers</strong>
                        <label><input type="checkbox" checked={layerVisibility.sky} onChange={() => toggleLayerVisibility('sky')} />Sky</label>
                        <label><input type="checkbox" checked={layerVisibility.skyDup} onChange={() => toggleLayerVisibility('skyDup')} />Sky Dup</label>
                        <label><input type="checkbox" checked={layerVisibility.moon} onChange={() => toggleLayerVisibility('moon')} />Moon</label>
                        <label><input type="checkbox" checked={layerVisibility.far} onChange={() => toggleLayerVisibility('far')} />Building Far</label>
                        <label><input type="checkbox" checked={layerVisibility.midFar} onChange={() => toggleLayerVisibility('midFar')} />Building Mid-Far</label>
                        <label><input type="checkbox" checked={layerVisibility.midNear} onChange={() => toggleLayerVisibility('midNear')} />Building Mid-Near</label>
                        <label><input type="checkbox" checked={layerVisibility.near} onChange={() => toggleLayerVisibility('near')} />Building Near</label>
                        <label><input type="checkbox" checked={layerVisibility.tile} onChange={() => toggleLayerVisibility('tile')} />Tile</label>
                        <label><input type="checkbox" checked={layerVisibility.homepageNpc} onChange={() => toggleLayerVisibility('homepageNpc')} />Homepage NPC</label>
                        <label><input type="checkbox" checked={layerVisibility.bubble} onChange={() => toggleLayerVisibility('bubble')} />Bubble</label>
                        <label><input type="checkbox" checked={layerVisibility.socials} onChange={() => toggleLayerVisibility('socials')} />Socials</label>
                    </aside>
                )}

                <img className='home-bg-sky' ref={skyRef} src={sky} alt="sky" style={{ display: getLayerDisplay('sky') }} />
                <img className='home-bg-sky-dup' ref={skyDupRef} src={skyFlip} alt="sky" style={{ display: getLayerDisplay('skyDup') }} />
                <img className='home-bg-moon' ref={moonRef} src={moon} alt="moon" style={{ display: getLayerDisplay('moon') }} />
                <img className='home-bg-building-far' ref={farRef} src={buildingFar} alt="Far skyline" style={{ display: getLayerDisplay('far') }} />
                <img className='home-bg-building-mid-far' ref={midFarRef} src={buildingMidFar} alt="Mid-far skyline" style={{ display: getLayerDisplay('midFar') }} />
                <img className='home-bg-building-mid-near' ref={midNearRef} src={buildingMidNear} alt="Mid-near skyline" style={{ display: getLayerDisplay('midNear') }} />
                <img className='home-bg-building-near' ref={nearRef} src={buildingNear} alt="Near skyline" style={{ display: getLayerDisplay('near') }} />
                <img className='home-tile' src={tile} alt="tilemap" style={{ display: getLayerDisplay('tile') }} />

                {!shouldShowSocials && layerVisibility.bubble && (
                    <div className='npc-bubble'>{typedText}</div>
                )}

                <div className={`socials ${shouldShowSocials ? 'is-visible' : ''}`} style={{ display: getLayerDisplay('socials') }}>
                        <a href="https://www.youtube.com/@Liberteeeee-hd7zg"><img src={youtubeIcon} alt="" /></a>
                        
                        <a href="https://github.com/LiberteI"><img src={githubIcon} alt="" /></a>
                        <a href="https://www.linkedin.com/in/yiming-yang-89a0102a0/"><img src={linkedinIcon} alt="" /></a>
                        
                </div>
                
                <button className="homepage-npc-button" onClick={handleClick} style={{ display: getLayerDisplay('homepageNpc') }}>
                    <HomepageNpc clicked={clicked} shouldIdle={shouldIdle}/>
                </button>
                
            </section>
        </main>
    )

}

export default Home

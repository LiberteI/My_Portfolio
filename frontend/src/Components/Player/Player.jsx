import '../Home/Home.css'
import { useRef, useState, useEffect } from 'react'
// Character animation frames
import meIdle from '../../assets/Animations/Me/Idle.gif'
import meIdle2 from '../../assets/Animations/Me/Idle2.gif'
import meWalk from '../../assets/Animations/Me/Walk.gif'

const Player = () => {
    // Keep refs to each GIF so we can toggle visibility imperatively
    const meIdleRef = useRef(null);
    const meIdle2Ref = useRef(null);
    const meWalkRef = useRef(null);
    
    // Track current animation pose plus which key (if any) is held
    const [myState, setMyState] = useState('idle');
    const [keyHeld, setKeyHeld] = useState(null);
    // Respond to keyboard events to update pose + held key
    useEffect(() => {
    
        // Arrow fn: transitions to walk state when a/d pressed
        const handleKeyDown = (e) => {
            if(e.key === 'a' || e.key === 'd'){
                setKeyHeld(e.key);
                setMyState('walk');
            }
            
        };
        // Arrow fn: reverts to idle when movement keys released
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
    // Imperatively show the correct GIF whenever the pose changes
    useEffect(() => {
        // useEffect re-runs whenever myState/keyHeld change thanks to dependency array
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

    // Movement + facing direction handling
    const walkSpeed = 1; // movement speed in px per frame
    const [isFacingRight, setIsFacingRight] = useState(true);
   
    // Flip sprite horizontally to match walking direction
    useEffect(() => {
        // useEffect listens for pose/facing changes; deps ensure it only fires when needed
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

        const base = 'scale(0.8) translateY(-24%) translateX(-30%)';
        const flip = shouldFaceRight ? 'scaleX(1)' : 'scaleX(-1)';
        const transform = `${base} ${flip}`;
        idle.style.transform = transform;
        walk.style.transform = transform;
        idle2.style.transform = transform;
        
    }, [myState, isFacingRight, keyHeld])

    // Track how far along the x-axis the character has walked
    const [position, setPosition] = useState(0);
    // Run an RAF loop to keep nudging position while a/d are held
    useEffect(() => {
        // useEffect here ties the RAF loop lifecycle to myState/keyHeld changes
        if(myState !== 'walk' || !keyHeld){
            return;
        }
        let frameId;
        // Arrow fn: per-frame updater that nudges character based on held key
        const step = () => {
            setPosition((prev) => {
                if(keyHeld === 'a'){
                    return prev - walkSpeed;
                }
                if(keyHeld === 'd'){
                    return prev + walkSpeed;
                }

                return prev;
            });
            frameId = requestAnimationFrame(step);
        };

        frameId = requestAnimationFrame(step);

        return () => cancelAnimationFrame(frameId);

    }, [myState, keyHeld]);
    return (
        <div
            className='me-wrapper'
            style={{ '--me-offset': `${position}px` }}
        >
            <div className='me-container'>
                <img className='me idle' ref={meIdleRef} src={meIdle} alt="Idle pose" />
                <img className='me idle2' ref={meIdle2Ref} src={meIdle2} alt="Idle alt pose" />
                <img className='me walk' ref={meWalkRef} src={meWalk} alt="Walk pose" />
            </div>
        </div>
    )
}

export default Player

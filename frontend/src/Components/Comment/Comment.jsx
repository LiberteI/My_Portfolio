import CommentCard from './CommentCard'
import samurai from '../../assets/Animations/samurai.gif'
import dummyIcon from '../../assets/email.png'
import './Comment.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Comment = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const [comments, setComments] = useState([]);
    const handleClick = () => {
        if(!isLoggedIn){
            // invoke 3rd party log in route
            window.location.href = `${apiBase}/auth/google`;
        } else {
            navigate("/comment-form");
        }
    };
    
    const populateComments = async () => {

        setStatus('loading');
        try{
            const response = await fetch(`${apiBase}/api/Comment/get-comment`, {
                method: "GET",
                credentials: "include"
            });
            if(!response.ok){
                throw new Error("request failed");
            }

            const data = await response.json();

            // set to [] if undefined or null
            setComments(data || []);

            setStatus('success');

        } catch (error){
            console.error(error);
            setStatus("error");
            setComments([]);
        }
    }

    useEffect(() => {
        // load comments
        populateComments();
    }, []);

    const [status, setStatus] = useState(null);
    const [userStatus, setUserStatus] = useState(null);

    const getUser = async (event) => {
        event?.preventDefault?.();
        setStatus("loading");

        try{
            const response = await fetch(`${apiBase}/api/me`, {
                method: 'GET',
                credentials: 'include',
            });
            if(response.status === 401){
                console.log("not logged in");
                setUserStatus(null);
                setIsLoggedIn(false);
                return;
            }

            const data = await response.json();

            setStatus("success");
            setUserStatus({ id: data._id || data.id || null, isAdmin: Boolean(data.isAdmin) });
        } catch (error){
            console.error(error);
            setStatus('error');
            setUserStatus(null);
        }
    };

    const logout = async () => {
        try{
            await fetch(`${apiBase}/auth/google/logout`, {
                method: "POST",
                credentials: "include",
            });
            setUserStatus({ id: null, isAdmin: false });
            setIsLoggedIn(false);
        } catch (error){
            console.error("logout error", error);
        }
    };

    useEffect(() => {
        // send http to get user
        getUser();
    }, [])

    useEffect(() => {
        setIsLoggedIn(Boolean(userStatus?.id));
    }, [userStatus]);

    const [currentButtonText, setCurrentButtonText] = useState("Log In");
    useEffect(() => {
        setCurrentButtonText(isLoggedIn ? "Leave a Comment" : "Log In");
    }, [isLoggedIn]);


    const workedWithMe = "Worked With Me?";
    const leaveAComment = "Leave A Comment!";
    const [currentBubbleText, setCurrentBubbleText] = useState(workedWithMe);
    const [typedText, setTypedText] = useState(workedWithMe);
    useEffect(() => {
        const toggleBubbleText = setInterval(() => {
            setCurrentBubbleText(prev => prev === workedWithMe ? leaveAComment : workedWithMe);
        }, 2000);
        return () => clearInterval(toggleBubbleText);
    }, [])

    useEffect(() => {
        let charIndex = 0;
        setTypedText('');

        const typingSpeedMs = 20;
        const text = currentBubbleText || "";

        const typeText = setInterval(() => {
            charIndex ++;
            setTypedText(text.slice(0, charIndex));
            if(charIndex >= text.length){
                clearInterval(typeText);
            }
        }, typingSpeedMs);

        return () => clearInterval(typeText);
    }, [currentBubbleText]);

    return (
        <section className="comment-container">
            <h1>Testimonial</h1>

            <div className='comment-bubble'>{typedText}</div>

            <div className="comment-cta">
                <img className="comment-illustration" src={samurai} alt="samurai animation" />
                <button onClick={handleClick} className="comment-button">{currentButtonText}</button>

                {isLoggedIn && <button onClick={logout} className="comment-logout-button">Logout</button>}
                
            </div>

            <div className="comment-grid">
                {comments.map((comment) => (
                    <CommentCard 
                        key={comment.email}
                        commentData={comment}
                    />
                ))}
            </div>
            
        </section>
    )
}

export default Comment

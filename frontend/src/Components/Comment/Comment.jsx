import CommentCard from './CommentCard'
import samurai from '../../assets/Animations/samurai.gif'
import googleIcon from '../../assets/google.png';
import linkedinIcon from '../../assets/linkedin.png';


import './Comment.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Comment = () => {
    const navigate = useNavigate();

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const [comments, setComments] = useState([]);
    const handleComment = () => {
        navigate("/comment-form");
    };

    const requestGoogleAuth = () => {
        window.location.href = `${apiBase}/auth/google`;
    }

    const requestLinkedInAuth = () => {
        window.location.href = `${apiBase}/auth/linkedin`;
    }

    
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
                setUserStatus(null);
                setIsLoggedIn(false);
                return;
            }

            const data = await response.json();

            setStatus("success");
            setUserStatus({ id: data._id || data.id || null, isAdmin: Boolean(data.isAdmin) });
        } catch (error){
            
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

    const isLoggedIn = Boolean(userStatus?.id);

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
        <section className="comment-container" id="testimonial">
            <h1>Testimonial</h1>
            <div className='comment-bubble'>{typedText}</div>
            

            <div className="comment-cta">
                <img className="comment-illustration" src={samurai} alt="samurai animation" />
                {!isLoggedIn &&
                
                <div className="comment-auth-buttons">
                    <h3 className="comment-auth-title">Login With ...</h3>
                    <img onClick={requestGoogleAuth} className="auth-icon-button" src={googleIcon} alt="Google" />
                    <img onClick={requestLinkedInAuth} className="auth-icon-button" src={linkedinIcon} alt="LinkedIn" />
        
                </div>
                }
                
                
                {isLoggedIn && <button onClick={handleComment} className="comment-button">Leave A Comment</button>}
                {isLoggedIn && <button onClick={logout} className="comment-logout-button">Logout</button>}
                
            </div>

            <div className="comment-grid">
                {comments.map((comment) => (
                    <CommentCard 
                        key={comment._id || comment.id || comment.email}
                        commentData={comment}
                    />
                ))}
            </div>
            
        </section>
    )
}

export default Comment

import CommentCard from './CommentCard'
import samurai from '../../assets/Animations/samurai.gif'
import dummyIcon from '../../assets/email.png'
import './Comment.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";

const comments = [
    {
        email: "1",
        icon: dummyIcon,
        title: "boss",
        detail: "he is good"
    },
    {
        email: "2",
        icon: dummyIcon,
        title: "boss",
        detail: "he is good"
    },
    {
        email: "3",
        icon: dummyIcon,
        title: "boss",
        detail: "he is good"
    }
]
const Comment = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleClick = () => {
        if(!isLoggedIn){
            // invoke 3rd party log in route
            window.location.href = "https://api.liberteii.com/auth/google";
        } else {
            navigate("/comment-form");
        }
    };
    
    useEffect(() => {
        // Only treat this session as logged in when arriving with ?loggedIn=1.
        // Do not persist across refresh.
        // reads url after ?
        const params = new URLSearchParams(window.location.search);
        if (params.get("loggedIn") === "1") {
            setIsLoggedIn(true);
            // removes that param from the current query params.
            params.delete("loggedIn");
            const remaining = params.toString();
            // constructs a clean URL (same path, maybe other params).
            const newUrl = `${window.location.pathname}${remaining ? `?${remaining}` : ""}`;
            // updates the address bar to the clean URL without causing a navigation.
            window.history.replaceState({}, "", newUrl);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const [currentButtonText, setCurrentButtonText] = useState("Log In");
    useEffect(() => {
        setCurrentButtonText(isLoggedIn ? "Leave a Comment" : "Log In");
    }, [isLoggedIn]);

    return (
        <section className="comment-container">
            <h1>Testimonial</h1>
            <div className="comment-cta">
                <img className="comment-illustration" src={samurai} alt="samurai animation" />
                <button onClick={handleClick} className="comment-button">{currentButtonText}</button>
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

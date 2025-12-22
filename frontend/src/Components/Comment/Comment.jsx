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

    const [user, setUser] = useState(null);
    
    const handleClick = () => {
        if(!user){
            // invoke 3rd party log in route
            window.location.href = "https://api.liberteii.com/auth/google";
        }
        else{
            navigate("/comment-form");
        }
        
    }
    
    useEffect(() => {
        // send a http request and include credentials
        fetch("https://api.liberteii.com/api/me", { credentials: "include"})
            //parse response
            .then(res => res.ok? res.json() : null)
            // pass jsonfied response to data
            // a => b function takes a and return b
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    const [currentButtonText, setCurrentButtonText] = useState("Log In");
    useEffect(() => {
        if(user){
            setCurrentButtonText("Leave a Comment");
        }
        else{
            setCurrentButtonText("Log In");
        }
    }, [user])

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

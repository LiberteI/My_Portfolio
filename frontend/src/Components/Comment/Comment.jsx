import CommentCard from './CommentCard'
import samurai from '../../assets/Animations/samurai.gif'
import dummyIcon from '../../assets/email.png'
import './Comment.css'
import { useEffect } from 'react'
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

    const handleClick = () => {
        // invoke 3rd party log in route
        window.location.href = "https://api.liberteii.com/auth/google";
    }

    return (
        <section className="comment-container">
            <h1>Testimonial</h1>
            <div className="comment-cta">
                <img className="comment-illustration" src={samurai} alt="samurai animation" />
                <button onClick={handleClick} className="comment-button">Leave A Comment</button>
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

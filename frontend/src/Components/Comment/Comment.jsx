import CommentCard from './CommentCard'
import samurai from '../../assets/Animations/samurai.gif'
import './Comment.css'
const comments = [
    {
        email: "",
        icon: null,
        title: "",
        detail: ""
    }
]
const Comment = () => {

    
    return (
        <section className="comment-container">
            <h1>Testimonial</h1>
            <div className="comment-cta">
                <img className="comment-illustration" src={samurai} alt="samurai animation" />
                <button className="comment-button">Leave A Comment</button>
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

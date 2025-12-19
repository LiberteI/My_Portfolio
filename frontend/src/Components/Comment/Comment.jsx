import CommentCard from './CommentCard'
import samurai from '../../assets/Animations/samurai.gif'
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
            <div>
                <img src={samurai} alt="" />
                <button>Leave A Comment</button>
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
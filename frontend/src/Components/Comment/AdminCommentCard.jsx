const CommentCard = ({ commentData }) => {
    const { email, icon, title, detail } = commentData
    return (
        <div className="comment-card">
            {icon && <img src={icon} alt={title || email || 'Comment icon'} />}
            <h3>{title || email }</h3>
            <p>{detail || ''}</p>

            <button>Delete</button>
            <button>Edit</button>
        </div>
    )
}

export default CommentCard

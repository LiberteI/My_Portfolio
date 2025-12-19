const CommentCard = ({ commentData }) => {
    const { email, icon, title, detail } = commentData
    return (
        <div className="comment-card">
            {icon && <img src={icon} alt={title || email || 'Comment icon'} />}
            <h3>{title || email || 'Anonymous'}</h3>
            <p>{detail || ''}</p>
        </div>
    )
}

export default CommentCard

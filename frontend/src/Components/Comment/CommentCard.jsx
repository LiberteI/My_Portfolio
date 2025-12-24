const CommentCard = ({ commentData }) => {
    const { name, role, email, comment, avatar, detail } = commentData;
    const displayName = name || email || "";
    const subtitle = role || email || "";
    const body = comment || detail || "";

    return (
        <div className="comment-card">
            {avatar && <img src={avatar} alt={displayName} />}
            <h3>{displayName}</h3>
            {subtitle && <p className="comment-subtitle">{subtitle}</p>}
            <p>{body}</p>
        </div>
    );
}

export default CommentCard

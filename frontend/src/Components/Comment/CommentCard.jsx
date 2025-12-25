const CommentCard = ({ commentData }) => {
    const { name, role, comment, author } = commentData;
    const displayName = name;
    const subtitle = role;
    const body = comment;

    return (
        <div className="comment-card">
            <img src={author} alt={displayName} />
            <h3>{displayName}</h3>
            {subtitle && <p className="comment-subtitle">{subtitle}</p>}
            <p>{body}</p>
        </div>
    );
}

export default CommentCard

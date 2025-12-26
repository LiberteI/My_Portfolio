import './CommentCard.css'

const CommentCard = ({ commentData }) => {
    const { name, role, comment, author, avatar } = commentData;
    const displayName = name;
    const subtitle = role;
    const body = comment;
    const avatarSrc = author?.avatar || avatar || null;

    return (
        <div className="comment-card">
            <div className="comment-card-header">
                {avatarSrc && <img src={avatarSrc} alt={displayName} />}
                <h3>{displayName}</h3>
                {subtitle && <p className="comment-subtitle">{subtitle}</p>}
            </div>
            <p className="comment-body">{body}</p>
        </div>
    );
}

export default CommentCard

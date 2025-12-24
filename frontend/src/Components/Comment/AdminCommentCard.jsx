const AdminCommentCard = ({ commentData }) => {
    const { _id, id, name, role, email, comment, avatar, detail } = commentData;
    const displayName = name || email || "";
    const subtitle = role || email || "";
    const body = comment || detail || "";

    return (
        <div className="comment-card">
            {avatar && <img src={avatar} alt={displayName} />}
            <h3>{displayName}</h3>
            {subtitle && <p className="comment-subtitle">{subtitle}</p>}
            <p>{body}</p>

            <div className="admin-actions">
                <button data-id={_id || id}>Delete</button>
                <button data-id={_id || id}>Edit</button>
            </div>
        </div>
    );
}

export default AdminCommentCard

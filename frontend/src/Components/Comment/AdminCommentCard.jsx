const AdminCommentCard = ({ commentData }) => {
    const { _id, id, name, role, email, comment, avatar, detail } = commentData;
    const displayName = name || email || "";
    const subtitle = role || email || "";
    const body = comment || detail || "";

    const handleDelete = () => {

    }

    const handleEdit = () => {
        
    }
    return (
        <div className="comment-card">

            <div className="admin-actions">
                <button onClick={handleDelete} data-id={_id || id}>Delete</button>
                <button onClick={handleEdit} data-id={_id || id}>Edit</button>
            </div>
            
            {avatar && <img src={avatar} alt={displayName} />}
            <h3>{displayName}</h3>
            {subtitle && <p className="comment-subtitle">{subtitle}</p>}
            <p>{body}</p>

            
        </div>
    );
}

export default AdminCommentCard

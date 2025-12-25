const AdminCommentCard = ({ commentData, onChange }) => {
    const { _id, id, name, role, email, comment, avatar, detail } = commentData;
    const displayName = name || email || "";
    const subtitle = role || email || "";
    const body = comment || detail || "";

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const handleDelete = async () => {
        try{
            const response = await fetch(`${apiBase}/api/Comment/admin/delete-comment/${_id}`, {

            });
        } catch (error){
            console.error(error);
        }
    }

    const submitEditing = async (editedData) => {
        try{
            const response = await fetch(`${apiBase}/api/Comment/admin/edit-comment/${_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editedData)
            });

            if(!response.ok){
                console.log("failed to edit comment");
                return;
            }
            
            onChange();
            console.log("succeeded in editing comment");

        } catch (error){
            console.error(error);
        }
    }
    const startEditing = () => {
        
        submitEditing(commentData);
        
    }
    return (
        <div className="comment-card">

            <div className="admin-actions">
                <button onClick={handleDelete} data-id={_id || id}>Delete</button>
                <button onClick={startEditing} data-id={_id || id}>Edit</button>
            </div>
            
            {avatar && <img src={avatar} alt={displayName} />}
            <h3>{displayName}</h3>
            {subtitle && <p className="comment-subtitle">{subtitle}</p>}
            <p>{body}</p>

            
        </div>
    );
}

export default AdminCommentCard

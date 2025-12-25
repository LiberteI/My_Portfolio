import { useState } from "react";

const AdminCommentCard = ({ commentData, onChange }) => {
    const { _id, id, name, role, email, comment, avatar, shouldDisplay} = commentData;
    const displayName = name || email || "";
    const subtitle = role;
    const body = comment;

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

    const [isEditing, setIsEditing] = useState(false);
    
    const startEditing = () => {
        
        setIsEditing(true);
        
    }

    const cancelEdit = () => {
        setIsEditing(false);
    }

    const saveEdit = () => {
        
        submitEditing(commentData);
        setIsEditing(false);
    }

    return (
        <div className="comment-card">

            <div className="admin-actions">
                {!isEditing && 
                <button onClick={handleDelete} data-id={_id || id}>Delete</button>}
                {!isEditing && 
                <button onClick={startEditing} data-id={_id || id}>Edit</button>}

                {isEditing &&
                <button onClick={cancelEdit} data-id={_id || id}>Cancel</button>}
                {isEditing && 
                <button onClick={saveEdit} data-id={_id || id}>Save</button>}
            </div>
            
            {avatar && <img src={avatar} alt={displayName} />}
            <h3>{displayName}</h3>
            {subtitle && <p className="comment-subtitle">{subtitle}</p>}
            <p>{body}</p>

            
        </div>
    );
}

export default AdminCommentCard

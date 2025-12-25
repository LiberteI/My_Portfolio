import { useState } from "react";

const AdminCommentCard = ({ commentData, onChange }) => {
    // original data (read only)
    const { _id, id, name, role, email, comment, avatar, shouldDisplay} = commentData;
    const displayName = name || email || "";
    const subtitle = role;
    const body = comment;
    const commentID = _id || id;
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const handleDelete = async () => {
        try{
            const response = await fetch(`${apiBase}/api/Comment/admin/delete-comment/${_id}`, {

            });
        } catch (error){
            console.error(error);
        }
    }

    const submitEditing = async ({commentId: commentID, updates: dataDraft}) => {
        try{
            const response = await fetch(`${apiBase}/api/Comment/admin/edit-comment`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({commentId: commentID, updates: dataDraft})
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

    // UI toggle flag
    const [isEditing, setIsEditing] = useState(false);
    const [dataDraft, setDataDraft] = useState(
        {
            comment,
            shouldDisplay
        }
    )
    const startEditing = () => {
        setDataDraft({comment, shouldDisplay})
        setIsEditing(true);
    }

    const cancelEdit = () => {
        setIsEditing(false);
    }

    const saveEdit = () => {
        submitEditing({commentId: commentID, updates: dataDraft});
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
            
            {!isEditing 
                &&
                <>
                    {avatar && <img src={avatar} alt={displayName} />}
                    <h3>{displayName}</h3>
                    {subtitle && <p className="comment-subtitle">{subtitle}</p>}
                    <p>{body}</p>
                </>
            }
            {isEditing
                &&
                <>
                    {avatar && <img src={avatar} alt={displayName} />}
                    <h3>{displayName}</h3>
                    {subtitle && <p className="comment-subtitle">{subtitle}</p>}

                    <textarea 
                        value={dataDraft.comment}
                        onChange={(e) => 
                            setDataDraft((prev) => ({
                                ...prev, 
                                comment: e.target.value
                            }))
                        }
                    />
                    <label>
                        <input 
                            type="checkbox" 
                            checked={dataDraft.shouldDisplay}
                            onChange={(e) => 
                                setDataDraft((prev) => ({
                                    ...prev,
                                    shouldDisplay: e.target.checked
                                }))
                            }
                        />
                        Visible to Public
                    </label>
                </>
            }
            

            
        </div>
    );
}

export default AdminCommentCard

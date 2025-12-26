import { useState } from "react";
import './CommentCard.css'

const AdminCommentCard = ({ commentData, onChange }) => {
    // original data (read only)
    const { _id, id, name, role, email, comment, author, shouldDisplay} = commentData;
    const displayName = name || email || "";
    const subtitle = role;
    const body = comment;
    const commentID = _id || id;
    const avatarSrc = author?.avatar || null;
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const handleDelete = async () => {
        try{
            const response = await fetch(`${apiBase}/api/Comment/admin/delete-comment`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ commentId: commentID })
            });

            if(!response.ok){
                console.log("failed to delete comment");
                return;
            }

            onChange?.();
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
    
            {avatarSrc && <img src={avatarSrc} alt={displayName} />}
            <h3>{displayName}</h3>
            {subtitle && <p className="comment-subtitle">{subtitle}</p>}

            {!isEditing 
                &&
                <>
                    <p className={`comment-visibility ${dataDraft.shouldDisplay ? 'is-visible' : 'is-hidden'}`}>
                        {dataDraft.shouldDisplay ? 'Visible' : 'Invisible'}
                    </p>
                    <p className="comment-body">{body}</p>
                </>
            }
            {isEditing
                &&
                <textarea 
                    value={dataDraft.comment}
                    onChange={(e) => 
                        setDataDraft((prev) => ({
                            ...prev, 
                            comment: e.target.value
                        }))
                    }
                />
            }
            {isEditing && 
            <label className="comment-toggle">
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
            </label>}
            

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
        </div>
    );
}

export default AdminCommentCard

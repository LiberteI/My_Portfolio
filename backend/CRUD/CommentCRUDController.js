import { createComment, deleteComment, editComment, findComments } from "./CommentCRUD.js";

// crud backend endpoint

export const postComment = async (data) => {
    return await createComment(data);
};

export const getComments = async (req, res) => {
    try{
        const comments = await findComments();
        res.status(200).json(comments);
    } catch (error){
        console.error("Failed to fetch comments:", error);
        res.status(500).json({ error: error.message });
    }
}

export const updateComment = async (req, res) => {
    if(!req.user?.isAdmin){
        return res.status(403).send("Forbidden");
    }
    try{
        const { commentId, updates} = req.body;

        const updatedComment = await editComment({
            commentId,
            updates
        });

        res.status(200).json(updatedComment);
    } catch (error){
        console.error("Failed to update comment:", error);
        res.status(500).json({ error: error.message });
    }
}

export const disableComment = async (req, res) => {
    if(!req.user?.isAdmin){
        return res.status(403).send("Forbidden");
    }
    try{
        const { commentId } = req.body;
        const disabledComment = await deleteComment(commentId);
        res.status(200).json(disabledComment);
    } catch (error){
        console.error("Failed to disable comment:", error);
        res.status(500).json({ error: error.message });
    }
}
/*
    Ultra-short cheat sheet
    Code	    Meaning	When to use
    200	    OK	                Successful read/update/delete
    201	    Created	            Successful create
    400	    ad Request	        Invalid input
    401	    Unauthorized	    Not logged in
    403	    Forbidden	        No permission
    404	    Not Found	        Missing resource
    500	    Server Error	    Backend bug
*/

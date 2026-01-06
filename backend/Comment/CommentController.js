import { findComments, editComment, deleteComment } from "../CRUD/CommentCRUD.js";
import { postComment } from "../CRUD/CommentCRUDController.js";
import Comment from "../DatabaseModel/Comment.js";

// POST
export const submitComment = async (req, res) => {
    // handle submit comment
    try{

        // receive data from frontend
        const { name, role, comment, author } = req.body;
        if (!name || !role || !comment || !author) {
            return res.status(400).json({ error: "Missing name, role, or comment" });
        }
        // talk to backend
        const created = await postComment({ name, role, comment, author });
        return res.status(201).json(created);

    } catch (error) {
        console.error("submitComment error", error);
        return res.status(500).send(`Internal error during submitting comment: ${error.message}`);
    }
    
};

// GET
export const getComments = async (req, res) => {
    try{
        const comments = await findComments();

        return res.status(200).json(comments);
    } catch (error){
        return res.status(500).send("internal error in comment controller");
    }
}

export const getAllComments = async (req, res) => {
    try{

        const comments = await Comment.find()
            .sort({ createdAt: -1 })
            .populate("author", "avatar");
        return res.status(200).json(comments);
        
    } catch(error){
        return res.status(500).send("internal error in comment controller");
    }
}

// edit comment
export const moderateComment = async (req, res) => {
    try{
        // get comment id
        const commentId = req.body.commentId;
        const updates = req.body.updates;

        if(!commentId){
            return res.status(400).json({error: "Missing comment ID"});
        }

        const updatedComments = await editComment({ commentId, updates });

        return res.status(200).json(updatedComments);
    } catch (error){
        return res.status(500).send("internal error in comment controller");
    }
}

// DELETE
export const softDeleteComment = async (req, res) => {
    try{
        const commentId = req.body.commentId;
        const updates = req.body.updates;
        if(!commentId){
            return res.status(400).json({error : "Missing Comment ID"});
        }

        const updatedComments = await editComment({ commentId, updates });

        return res.status(200).json(updatedComments);
    } catch(error){
        return res.status(500).send("internal error in deleting comment");
    }
}

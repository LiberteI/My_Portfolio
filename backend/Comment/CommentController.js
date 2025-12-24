import { postComment } from "../CRUD/CommentCRUDController.js";

export const submitComment = async (req, res) => {
    // handle submit comment
    try{

        const comment = await postComment(req.body);
        return res.status(201).json(comment);

    } catch (error) {
        console.error("submitComment error", error);
        return res.status(500).send(`Internal error during submitting comment: ${error.message}`);
    }
    
}
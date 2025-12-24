import { findComments } from "../CRUD/CommentCRUD.js";
import { postComment } from "../CRUD/CommentCRUDController.js";

export const submitComment = async (req, res) => {
    // handle submit comment
    try{

        // receive data from frontend
        const { name, role, comment } = req.body;
        if (!name || !role || !comment) {
            return res.status(400).json({ error: "Missing name, role, or comment" });
        }
        // talk to backend
        const created = await postComment({ name, role, comment });
        return res.status(201).json(created);

    } catch (error) {
        console.error("submitComment error", error);
        return res.status(500).send(`Internal error during submitting comment: ${error.message}`);
    }
    
};

export const getComments = async (req, res) => {
    try{
        const comments = await findComments();

        return res.status(200).json(comments);
    } catch (error){
        return res.status(500).send("internal error in comment controller");
    }
}

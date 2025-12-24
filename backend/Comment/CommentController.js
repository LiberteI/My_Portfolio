import { postComment } from "../CRUD/CommentCRUDController.js";

export const submitComment = async (req, res) => {
    // handle submit comment
    try{

        const { name, role, comment } = req.body;
        if (!name || !role || !comment) {
            return res.status(400).json({ error: "Missing name, role, or comment" });
        }

        const created = await postComment({ name, role, comment });
        return res.status(201).json(created);

    } catch (error) {
        console.error("submitComment error", error);
        return res.status(500).send(`Internal error during submitting comment: ${error.message}`);
    }
    
}

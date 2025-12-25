import { Router } from "express";
import { submitComment, getComments, getAllComments} from "./CommentController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";
import { deleteComment, editComment } from "../CRUD/CommentCRUD.js";

const router = Router();

// send frontend response
router.post('/post', submitComment);

router.get("/get-comment", getComments);

// use middleware
router.get("/admin/comments", requireAuth, requireAdmin, getAllComments);

router.get("/admin/edit-comment", requireAuth, requireAdmin, editComment);

router.get("/admin/delete-comment", requireAuth, requireAdmin, deleteComment);

export default router;

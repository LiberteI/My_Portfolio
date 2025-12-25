import { Router } from "express";
import { submitComment, getComments, getAllComments, moderateComment, hardDeleteComment} from "./CommentController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";


const router = Router();

// send frontend response
router.post('/post', submitComment);

router.get("/get-comment", getComments);

// use middleware
router.get("/admin/comments", requireAuth, requireAdmin, getAllComments);

router.patch("/admin/edit-comment", requireAuth, requireAdmin, moderateComment);

router.delete("/admin/delete-comment", requireAuth, requireAdmin, hardDeleteComment);

export default router;

import { Router } from "express";
import { submitComment, getComments, getAllComments, disableComment, moderateComment} from "./CommentController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";


const router = Router();

// send frontend response
router.post('/post', submitComment);

router.get("/get-comment", getComments);

// use middleware
router.get("/admin/comments", requireAuth, requireAdmin, getAllComments);

router.patch("/admin/edit-comment/:commentId", requireAuth, requireAdmin, moderateComment);

router.patch("/admin/delete-comment/:commentId", requireAuth, requireAdmin, disableComment);

export default router;

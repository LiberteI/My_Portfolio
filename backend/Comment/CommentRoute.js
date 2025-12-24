import { Router } from "express";
import { submitComment, getComments, getAllComments} from "./CommentController.js";
import { requireAdmin, requireAuth } from "../Middleware/auth.js";

const router = Router();

// send frontend response
router.post('/post', submitComment);

router.get("/get-comment", getComments);

// use middleware
router.get("/admin/comments", requireAuth, requireAdmin, getAllComments);

export default router;

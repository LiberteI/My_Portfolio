import { Router } from "express";
import { submitComment } from "./CommentController";

const router = Router();

// send frontend response
router.post('/', submitComment);

export default router;
import { Router } from "express";
import { submitComment } from "./CommentController.js";

const router = Router();

// send frontend response
router.post('/', submitComment);

export default router;

import { Router } from "express";
import { submitComment, getComments} from "./CommentController.js";

const router = Router();

// send frontend response
router.post('/post', submitComment);

router.get("/get-comment", getComments)

export default router;

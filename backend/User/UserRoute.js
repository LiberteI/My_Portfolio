import { Router } from "express";
import { getUserID } from "./UserController.js";

import { requireAuth } from "../Middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getUserID);

export default router;
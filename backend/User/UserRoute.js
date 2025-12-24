import { Router } from "express";
import { getUserID } from "./UserController.js";

const router = Router();

router.get("/", getUserID);

export default router;
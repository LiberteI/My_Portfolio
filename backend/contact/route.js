import { Router } from "express";
import { submitContact } from "./controller.js";

const router = Router();

router.post("/", submitContact);

export default router;

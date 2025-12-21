import {Router} from "express";
import { googleAuthStart, googleAuthCallback } from "./GoogleController.js"

const router = Router();

// start auth
router.get('/', googleAuthStart);
router.get('/google', googleAuthStart);

// handle callback
router.get("/google/callback", googleAuthCallback);

export default router;

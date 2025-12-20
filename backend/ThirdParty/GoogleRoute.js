import express from "express";
import { googleAuthStart, googleAuthCallback, } from "./ThirdParty/GoogleController.js"

const router = Router();

// start auth
router.get('/', googleAuthStart);

// handle callback
router.get("/google/callback", googleAuthCallback);

export default router;
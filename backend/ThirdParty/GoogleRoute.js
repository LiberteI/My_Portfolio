import {Router} from "express";
import { googleAuthStart, googleAuthCallback, googleLogout } from "./GoogleController.js"

const router = Router();

// start auth
router.get('/', googleAuthStart);

// handle callback
router.get("/callback", googleAuthCallback);

router.post("/logout", googleLogout);

export default router;

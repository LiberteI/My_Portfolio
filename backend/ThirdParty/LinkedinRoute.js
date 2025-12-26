import { Router } from "express";
import { linkedinAuthStart, linkedinAuthCallback, linkedinLogout} from "./LinkedinController.js";


const router = Router();

router.get("/", linkedinAuthStart);
router.get("/callback", linkedinAuthCallback);
router.get("/logout", linkedinLogout);

export default router;
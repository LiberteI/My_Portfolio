import {Router} from "express";
import {getVideo} from './controller.js'

const router = Router();
router.get('/', getVideo);

export default router;
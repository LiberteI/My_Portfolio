import {Router} from "express";
import {getFeaturedArrangement, getMoreArrangement} from './controller.js'

const router = Router();
router.get('/featured-arrangement', getFeaturedArrangement);
router.get('/more-arrangement', getMoreArrangement);

export default router;

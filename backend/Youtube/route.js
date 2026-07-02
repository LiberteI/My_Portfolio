import {Router} from "express";
import {getFeaturedArrangement, getMoreArrangement, getPerformance} from './controller.js'

const router = Router();
router.get('/featured-arrangement', getFeaturedArrangement);
router.get('/more-arrangement', getMoreArrangement);
router.get('/performance', getPerformance);

export default router;

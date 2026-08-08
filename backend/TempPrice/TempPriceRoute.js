import { Router } from "express";
import { getTempPrices, upsertTempPrice } from "./TempPriceController.js";

const router = Router();

router.get("/", getTempPrices);
router.put("/", upsertTempPrice);

export default router;

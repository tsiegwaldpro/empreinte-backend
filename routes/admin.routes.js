import express from "express";
import { requireAuth, isAdmin } from "../middlewares/auth.middleware.js";
import {
  generatePremiumCode,
  usePremiumCode,
  getAllPremiumCodes,
  extendPremiumCode,
  deletePremiumCode,
} from "../controllers/premiumCode.controller.js";

const router = express.Router();

router.post("/generate-code", requireAuth, isAdmin, generatePremiumCode);
router.post("/use-code", requireAuth, usePremiumCode);
router.get("/codes", requireAuth, isAdmin, getAllPremiumCodes);
router.post("/extend-code", requireAuth, isAdmin, extendPremiumCode);
router.delete("/code/:code", requireAuth, isAdmin, deletePremiumCode);

export default router;

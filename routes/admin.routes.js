import express from "express";
import { requireAuth, isAdmin } from "../middlewares/auth.middleware.js";
import {
  generatePremiumCode,
  getAllPremiumCodes,
  extendPremiumCode,
  deletePremiumCode,
} from "../controllers/premiumCode.controller.js";
import { getAllRecosFromAudits } from "../controllers/audit.controller.js";

const router = express.Router();

// ✅ Gestion des codes premiums
router.post("/generate-code", requireAuth, isAdmin, generatePremiumCode);
router.get("/codes", requireAuth, isAdmin, getAllPremiumCodes);
router.post("/extend-code", requireAuth, isAdmin, extendPremiumCode);
router.delete("/code/:code", requireAuth, isAdmin, deletePremiumCode);

// Gestion des audits
router.get("/recommandations", getAllRecosFromAudits);

export default router;

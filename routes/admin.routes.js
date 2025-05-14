import express from "express";
import { requireAuth, isAdmin } from "../middlewares/auth.middleware.js";
import {
  generatePremiumCode,
  getAllPremiumCodes,
  extendPremiumCode,
  deletePremiumCode,
} from "../controllers/premiumCode.controller.js";

const router = express.Router();

// ✅ Générer un code
router.post("/generate-code", requireAuth, isAdmin, generatePremiumCode);

// ✅ Lister tous les codes
router.get("/codes", requireAuth, isAdmin, getAllPremiumCodes);

// ✅ Étendre un code
router.post("/extend-code", requireAuth, isAdmin, extendPremiumCode);

// ✅ Supprimer un code
router.delete("/code/:code", requireAuth, isAdmin, deletePremiumCode);

export default router;

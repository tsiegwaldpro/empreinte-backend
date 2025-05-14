import express from "express";
import PremiumCode from "../models/PremiumCode.js";
import { requireAuth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Générer un code premium
router.post("/generate-code", requireAuth, isAdmin, async (req, res) => {
  try {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    const newCode = new PremiumCode({ code, expiresAt });
    await newCode.save();
    res.status(201).json({ code });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la génération du code." });
  }
});

export default router;

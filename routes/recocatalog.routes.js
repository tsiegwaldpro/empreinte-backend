import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  listRecos, // GET  : Liste toutes les recos du catalogue (admin)
  upsertReco, // POST : Crée ou met à jour une reco (admin)
  deleteReco, // DELETE : Supprime une reco du catalogue (admin)
} from "../controllers/recocatalog.controller.js";

const router = express.Router();

// ⚠️ Les actions "dynamiques" (générées à l'audit) ne sont pas éditables ici.
// Ici tu ne modifies que les recos & actions "catalogue" (fallback ou globales).

router.get("/recos", requireAuth, listRecos);
router.post("/recos", requireAuth, upsertReco);
router.delete("/recos/:id", requireAuth, deleteReco);

export default router;

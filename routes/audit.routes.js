import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";

import {
  auditWebsite, // POST /audit : Lancer un audit + actions dynamiques
  getAuditHistory, // GET /history : Derniers audits utilisateur
  getAuditHistoryBySite, // GET /audit/history : Audits d'un site donné
  getGroupedAuditsBySite, // GET /grouped : Audits groupés par site
  getReferenceAudit, // GET /audit/reference : Audit de référence d'un site
  deleteAuditsBySite, // DELETE /audits/site : Suppression d'audits d'un site
  getAllAudits,
  deleteAuditById,
} from "../controllers/audit.controller.js";

const router = express.Router();

/*
  NB : 
  La génération d'actions dynamiques/contextuelles et le fallback catalogue 
  sont gérés côté controller (voir auditWebsite & enrichissement).
*/

router.post("/audit", requireAuth, auditWebsite);
router.get("/history", requireAuth, getAuditHistory);
router.get("/audit/history", requireAuth, getAuditHistoryBySite);
router.get("/grouped", requireAuth, getGroupedAuditsBySite);
router.get("/audit/reference", requireAuth, getReferenceAudit);
router.delete("/audits/site", requireAuth, deleteAuditsBySite);
router.get("/audit/all", requireAuth, getAllAudits);
router.delete("/audit/:id", requireAuth, deleteAuditById);

export default router;

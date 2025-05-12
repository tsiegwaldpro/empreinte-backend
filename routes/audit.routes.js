import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";

import {
  auditWebsite,
  getAuditHistory,
  getAuditHistoryBySite,
  getGroupedAuditsBySite,
  getReferenceAudit,
} from "../controllers/audit.controller.js";

const router = express.Router();

router.post("/audit", requireAuth, auditWebsite);
router.get("/history", requireAuth, getAuditHistory);
router.get("/audit/history", requireAuth, getAuditHistoryBySite);
router.get("/grouped", requireAuth, getGroupedAuditsBySite);
router.get("/audit/reference", requireAuth, getReferenceAudit);

export default router;

import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";

import {
  auditWebsite,
  getAuditHistory,
  getAuditHistoryBySite,
} from "../controllers/audit.controller.js";

const router = express.Router();

router.post("/audit", requireAuth, auditWebsite);
router.get("/history", requireAuth, getAuditHistory);
router.get("/audit/history", requireAuth, getAuditHistoryBySite);

export default router;

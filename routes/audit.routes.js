import express from "express";
import {
  auditWebsite,
  getAuditHistory,
  getAuditHistoryBySite,
} from "../controllers/audit.controller.js";

const router = express.Router();

router.post("/audit", auditWebsite);
router.get("/history", getAuditHistory);
router.get("/audit/history", getAuditHistoryBySite);

export default router;

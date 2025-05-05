import express from "express";
import {
  auditWebsite,
  getAuditHistory,
} from "../controllers/audit.controller.js";

const router = express.Router();

router.post("/audit", auditWebsite);
router.get("/history", getAuditHistory);

export default router;

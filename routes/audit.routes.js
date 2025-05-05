import express from "express";
import { auditWebsite } from "../controllers/audit.controller.js";

const router = express.Router();

router.post("/audit", auditWebsite);

export default router;

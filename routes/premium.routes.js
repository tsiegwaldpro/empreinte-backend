import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  usePremiumCode,
  getUserPremiumExpiration,
} from "../controllers/premiumCode.controller.js";

const router = express.Router();

router.post("/premium/use-code", requireAuth, usePremiumCode);
router.get("/premium/expiration", requireAuth, getUserPremiumExpiration);

export default router;

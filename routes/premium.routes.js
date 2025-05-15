import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { isPremiumActive } from "../middlewares/isPremiumActive.js";

import {
  usePremiumCode,
  getUserPremiumExpiration,
} from "../controllers/premiumCode.controller.js";

import {
  handleSitemap,
  handleSitemapGrouped,
  handleCrawl,
  handleCrawlTopGroups,
} from "../controllers/premium.controller.js";

const router = express.Router();

// 🔐 Utilisation d'un code premium (accessible même si expiré)
router.post("/premium/use-code", requireAuth, usePremiumCode);

// 🔍 Voir la date d'expiration de son plan
router.get("/premium/expiration", requireAuth, getUserPremiumExpiration);

// 🗺️ Fonctions premium uniquement
router.post("/sitemap", requireAuth, isPremiumActive, handleSitemap);
router.post(
  "/sitemap-groups",
  requireAuth,
  isPremiumActive,
  handleSitemapGrouped
);
router.post("/crawl", requireAuth, isPremiumActive, handleCrawl);
router.post("/crawl/top", requireAuth, isPremiumActive, handleCrawlTopGroups);

export default router;

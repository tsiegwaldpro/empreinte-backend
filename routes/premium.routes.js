import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";

import {
  usePremiumCode,
  getUserPremiumExpiration,
} from "../controllers/premiumCode.controller.js";

import {
  handleSitemap,
  handleSitemapGrouped,
  handleCrawl,
  handleCrawlTopGroups, // 👈 nouvelle route
} from "../controllers/premium.controller.js";

const router = express.Router();

// 🔐 Premium codes (protégées par auth)
router.post("/premium/use-code", requireAuth, usePremiumCode);
router.get("/premium/expiration", requireAuth, getUserPremiumExpiration);

// 🗺️ Sitemap
router.post("/sitemap", handleSitemap);
router.post("/sitemap-groups", handleSitemapGrouped);

// 🤖 Crawl par profondeur
router.post("/crawl", handleCrawl); // 1 URL par groupe
router.post("/crawl/top", handleCrawlTopGroups); // top X groupes les plus gros

export default router;

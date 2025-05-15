import express from "express";
import { requireAuth, isAdmin } from "../middlewares/auth.middleware.js";

// Import de toutes les fonctions admin depuis le controller unique admin.controller.js
import {
  generatePremiumCode,
  getAllPremiumCodes,
  extendPremiumCode,
  deletePremiumCode,
  getAllUsers,
  getAllRecoCatalog,
  upsertRecoCatalog,
  deleteRecoCatalog,
  addActionToReco,
  updateAction,
  deleteAction,
} from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ Gestion des codes premiums
router.post("/generate-code", requireAuth, isAdmin, generatePremiumCode);
router.get("/codes", requireAuth, isAdmin, getAllPremiumCodes);
router.post("/extend-code", requireAuth, isAdmin, extendPremiumCode);
router.delete("/code/:code", requireAuth, isAdmin, deletePremiumCode);

// ✅ Gestion des recommandations (catalogue centralisé)
router.get("/recommandations", requireAuth, isAdmin, getAllRecoCatalog);
//router.post("/recommandations", requireAuth, isAdmin, upsertRecoCatalog);
router.delete("/recommandations/:id", requireAuth, isAdmin, deleteRecoCatalog);
router.post(
  "/recommandations/:id/actions",
  requireAuth,
  isAdmin,
  addActionToReco
);
// Modifier une action
router.post(
  "/recommandations/:id/actions/:actionIndex",
  requireAuth,
  isAdmin,
  updateAction
);

// Supprimer une action
router.delete(
  "/recommandations/:id/actions/:actionIndex",
  requireAuth,
  isAdmin,
  deleteAction
);

// ✅ Liste des utilisateurs
router.get("/users", requireAuth, isAdmin, getAllUsers);

export default router;

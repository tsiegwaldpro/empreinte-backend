import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  listRecos,
  upsertReco,
  deleteReco,
} from "../controllers/recocatalog.controller.js";

const router = express.Router();

router.get("/recos", requireAuth, listRecos);
router.post("/recos", requireAuth, upsertReco);
router.delete("/recos/:id", requireAuth, deleteReco);

export default router;

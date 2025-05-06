import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getCurrentUser);

export default router;

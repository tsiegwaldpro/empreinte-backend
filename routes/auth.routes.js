import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  getCurrentUser,
  confirmEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getCurrentUser);
router.get("/confirm/:token", confirmEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

// =========================
// 🌐 SERVER SETUP
// =========================

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auditRoutes from "./routes/audit.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js"; // ✅ AJOUT

// =========================
// 🔐 ENV + DB
// =========================

dotenv.config();
connectDB();

const app = express();

// =========================
// 🔄 MIDDLEWARE – CORS
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  "https://empreinte-frontend-production.up.railway.app",
  "https://empreinte-app.fr",
  "https://www.empreinte-app.fr",
  "https://api.empreinte-app.fr",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// =========================
// 📦 MIDDLEWARE JSON
// =========================

app.use(express.json());

// =========================
// 🔁 ROUTES
// =========================

app.use("/api", auditRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // ✅ AJOUT

// =========================
// 🚀 SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur port ${PORT}`);
});

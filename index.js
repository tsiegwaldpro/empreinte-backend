import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auditRoutes from "./routes/audit.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://empreinte-app.fr",
      "http://localhost:5173",
      undefined,
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/audit", auditRoutes);
app.use("/api/auth", authRoutes);

// Middleware de gestion d'erreurs CORS ou autres
app.use((err, req, res, next) => {
  console.error("🔥 Middleware error :", err.message);
  res.status(500).json({ message: "Erreur serveur." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

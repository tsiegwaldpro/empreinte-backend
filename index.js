import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auditRoutes from "./routes/audit.routes.js";
import authRoutes from "./routes/auth.routes.js";

// Charger les variables d'env
dotenv.config();

// Connexion à MongoDB
connectDB();

// Initialiser express
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://empreinte-app.fr"],
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", auditRoutes);
app.use("/api/auth", authRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

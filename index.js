import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auditRoutes from "./routes/audit.routes.js";

// Charger les variables d'env
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api", auditRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

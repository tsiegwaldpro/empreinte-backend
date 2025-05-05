import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auditRoutes from "./routes/audit.routes.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenue sur Empreinte Scanner 🖥️🌱");
});

app.use("/api", auditRoutes);

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

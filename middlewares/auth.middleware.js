import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "MonCodeSecret2025";

// Vérifie qu'un token est présent et valide
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Non autorisé, token manquant. :)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Erreur de vérification JWT :", err.message);
    return res.status(401).json({ message: "Token invalide." });
  }
};

// Vérifie que l'utilisateur est un admin
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès réservé aux administrateurs." });
  }
  next();
};

import User from "../models/User.js";

export const isPremiumActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    }

    const now = new Date();

    if (
      user.role === "premium" &&
      (!user.planExpiresAt || new Date(user.planExpiresAt) < now)
    ) {
      // 🔁 Rétrograde automatiquement
      user.role = "freemium";
      user.planExpiresAt = null;
      await user.save();

      return res
        .status(403)
        .json({ error: "Ton abonnement premium a expiré." });
    }

    if (user.role !== "premium") {
      return res
        .status(403)
        .json({ error: "Accès réservé aux comptes premium." });
    }

    // ✅ OK
    next();
  } catch (err) {
    console.error("Erreur isPremiumActive:", err);
    res.status(500).json({ error: "Erreur interne." });
  }
};

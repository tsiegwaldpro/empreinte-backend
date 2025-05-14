import PremiumCode from "../models/PremiumCode.js";
import User from "../models/User.js";

export const generatePremiumCode = async (req, res) => {
  try {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const newCode = new PremiumCode({ code, expiresAt });
    await newCode.save();

    res.status(201).json({ code });
  } catch (error) {
    console.error("Erreur generatePremiumCode:", error);
    res.status(500).json({ error: "Erreur lors de la génération du code." });
  }
};

export const usePremiumCode = async (req, res) => {
  const { code } = req.body;

  try {
    const premiumCode = await PremiumCode.findOne({ code });

    if (!premiumCode) {
      return res.status(404).json({ error: "Code introuvable." });
    }

    if (premiumCode.isUsed) {
      return res.status(400).json({ error: "Ce code a déjà été utilisé." });
    }

    if (new Date(premiumCode.expiresAt) < new Date()) {
      return res.status(400).json({ error: "Ce code est expiré." });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    user.role = "premium";
    await user.save();

    premiumCode.isUsed = true;
    premiumCode.usedBy = user._id;
    await premiumCode.save();

    res.json({ message: "Votre compte est maintenant Premium pour 7 jours." });
  } catch (err) {
    console.error("Erreur usePremiumCode:", err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de l'utilisation du code." });
  }
};

export const getAllPremiumCodes = async (req, res) => {
  try {
    const codes = await PremiumCode.find()
      .sort({ createdAt: -1 })
      .populate("usedBy", "email"); // Récupère l'email du user si utilisé

    res.json(codes);
  } catch (err) {
    console.error("Erreur getAllPremiumCodes:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des codes." });
  }
};

export const extendPremiumCode = async (req, res) => {
  const { code } = req.body;

  try {
    const premiumCode = await PremiumCode.findOne({ code });

    if (!premiumCode) {
      return res.status(404).json({ error: "Code introuvable." });
    }

    premiumCode.expiresAt = new Date(
      premiumCode.expiresAt.getTime() + 24 * 60 * 60 * 1000
    );
    await premiumCode.save();

    res.json({
      message: "Code prolongé de 24h.",
      newExpiration: premiumCode.expiresAt,
    });
  } catch (err) {
    console.error("Erreur extendPremiumCode:", err);
    res.status(500).json({ error: "Erreur lors de la prolongation du code." });
  }
};

export const deletePremiumCode = async (req, res) => {
  const { code } = req.params;

  try {
    const deleted = await PremiumCode.findOneAndDelete({ code });

    if (!deleted) {
      return res.status(404).json({ error: "Code introuvable." });
    }

    res.json({ message: `Code ${code} supprimé avec succès.` });
  } catch (err) {
    console.error("Erreur deletePremiumCode:", err);
    res.status(500).json({ error: "Erreur lors de la suppression du code." });
  }
};

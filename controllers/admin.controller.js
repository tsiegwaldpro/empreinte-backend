import RecoCatalog from "../models/RecoCatalog.js";
import User from "../models/User.js";
import PremiumCode from "../models/PremiumCode.js";

// ======= RecoCatalog =======
export const getAllRecoCatalog = async (req, res) => {
  try {
    const recos = await RecoCatalog.find().sort({ group: 1, id: 1 });
    res.status(200).json(recos);
  } catch (err) {
    console.error("Erreur récupération RecoCatalog :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const upsertRecoCatalog = async (req, res) => {
  try {
    const { id, title, group, description, impact, impactLevel, actions } =
      req.body;
    if (!id || !title || !group) {
      return res
        .status(400)
        .json({ message: "id, title et group sont obligatoires" });
    }
    const updated = await RecoCatalog.findOneAndUpdate(
      { id },
      { id, title, group, description, impact, impactLevel, actions },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Erreur upsert RecoCatalog :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteRecoCatalog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id manquant" });

    const deleted = await RecoCatalog.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: "Reco non trouvée" });

    res.json({ message: "Reco supprimée" });
  } catch (err) {
    console.error("Erreur suppression RecoCatalog :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ======= Users =======
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "email role firstName lastName lastLogin planExpiresAt"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ======= Premium Codes =======
export const generatePremiumCode = async (req, res) => {
  try {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    const newCode = new PremiumCode({ code });
    await newCode.save();

    res.status(201).json({ code });
  } catch (error) {
    console.error("Erreur generatePremiumCode:", error);
    res.status(500).json({ error: "Erreur lors de la génération du code." });
  }
};

export const getAllPremiumCodes = async (req, res) => {
  try {
    const codes = await PremiumCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    console.error("Erreur récupération codes premium :", err);
    res.status(500).json({ message: "Erreur serveur" });
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
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ message: "Code manquant" });

    const deleted = await PremiumCode.findOneAndDelete({ code });
    if (!deleted) return res.status(404).json({ message: "Code non trouvé" });

    res.json({ message: "Code supprimé" });
  } catch (err) {
    console.error("Erreur suppression code premium :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter une action à une reco existante
export const addActionToReco = async (req, res) => {
  try {
    const { id } = req.params; // id de la reco à modifier
    const { label, code } = req.body; // nouvelle action à ajouter

    if (!label || !code) {
      return res
        .status(400)
        .json({ message: "label et code sont obligatoires" });
    }

    // Trouve la reco par son id
    const reco = await RecoCatalog.findOne({ id });
    if (!reco) {
      return res.status(404).json({ message: "Reco non trouvée" });
    }

    // Ajoute la nouvelle action au tableau actions
    reco.actions = reco.actions || [];
    reco.actions.push({ label, code });

    // Sauvegarde
    await reco.save();

    res.status(200).json(reco);
  } catch (err) {
    console.error("Erreur ajout action reco :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier une action précise d'une reco
export const updateAction = async (req, res) => {
  const { id, actionIndex } = req.params;
  const { label, code } = req.body;

  if (!label) {
    return res.status(400).json({ message: "Le label est requis." });
  }

  try {
    const reco = await RecoCatalog.findOne({ id });
    if (!reco) return res.status(404).json({ message: "Reco non trouvée." });

    if (!reco.actions || !reco.actions[actionIndex]) {
      return res.status(404).json({ message: "Action non trouvée." });
    }

    reco.actions[actionIndex].label = label;
    reco.actions[actionIndex].code = code || "";

    await reco.save();

    res.json(reco);
  } catch (err) {
    console.error("Erreur updateAction:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une action précise d'une reco
export const deleteAction = async (req, res) => {
  const { id, actionIndex } = req.params;

  try {
    const reco = await RecoCatalog.findOne({ id });
    if (!reco) return res.status(404).json({ message: "Reco non trouvée." });

    if (!reco.actions || !reco.actions[actionIndex]) {
      return res.status(404).json({ message: "Action non trouvée." });
    }

    reco.actions.splice(actionIndex, 1);
    await reco.save();

    res.json(reco);
  } catch (err) {
    console.error("Erreur deleteAction:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

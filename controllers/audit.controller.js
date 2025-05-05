import Audit from "../models/Audit.js";
import auditWithLighthouse from "../services/lighthouse.js";

export const auditWebsite = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    const audit = await auditWithLighthouse(url);
    await Audit.create(audit);
    res.json(audit);
  } catch (error) {
    console.error("Erreur Lighthouse :", error.message);
    res.status(500).json({ error: "Erreur lors de l'audit Lighthouse" });
  }
};

export const getAuditHistory = async (req, res) => {
  try {
    const audits = await Audit.find().sort({ createdAt: -1 }).limit(10);
    res.json(audits);
  } catch (err) {
    console.error("Erreur historique :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getAuditHistoryBySite = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    const audits = await Audit.find({ url }).sort({ createdAt: -1 }).limit(10);
    res.json(audits);
  } catch (err) {
    console.error("Erreur récupération historique :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

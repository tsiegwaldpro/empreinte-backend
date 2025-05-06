import Audit from "../models/Audit.js";
import auditWithLighthouse from "../services/lighthouse.js";
import { getActionsForReco } from "../services/actions-recos.js";

// 🔧 Fonction pour enrichir les recommandations avec des actions concrètes
const enrichRecommandationsWithActions = (recs, url) => {
  return recs.map((rec) => ({
    ...rec,
    actions: getActionsForReco(rec, { url }),
  }));
};

// 🔍 Audit d’un site
const auditWebsite = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    const audit = await auditWithLighthouse(url);

    // 💡 Ajout des actions concrètes aux recommandations
    audit.recommandations = enrichRecommandationsWithActions(
      audit.recommandations,
      url
    );

    await Audit.create(audit);
    res.json(audit);
  } catch (error) {
    console.error("Erreur Lighthouse :", error.message);
    res.status(500).json({ error: "Erreur lors de l'audit Lighthouse" });
  }
};

// 📜 Récupération des 10 derniers audits
const getAuditHistory = async (req, res) => {
  try {
    const audits = await Audit.find().sort({ createdAt: -1 }).limit(10);
    res.json(audits);
  } catch (err) {
    console.error("Erreur historique :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📄 Récupération des audits par site
const getAuditHistoryBySite = async (req, res) => {
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

// ✅ Exports
export { auditWebsite, getAuditHistory, getAuditHistoryBySite };

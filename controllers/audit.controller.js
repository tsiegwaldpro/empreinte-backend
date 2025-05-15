import Audit from "../models/Audit.js";
import auditWithLighthouse from "../services/lighthouse.js";
import { getActionsForReco } from "../services/actions-recos.js";
import mongoose from "mongoose";

// 🔧 Fonction pour enrichir les recommandations avec des actions concrètes
const enrichRecommandationsWithActions = (recs, url) => {
  return recs.map((rec) => ({
    ...rec,
    actions: getActionsForReco(rec, { url }),
  }));
};

// 🔍 Audit d’un site
const auditWebsite = async (req, res) => {
  let { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  // ✅ Nettoyage de l'URL : sans slash final et en minuscule
  url = url.replace(/\/+$/, "").toLowerCase();

  try {
    const audit = await auditWithLighthouse(url);

    audit.recommandations = enrichRecommandationsWithActions(
      audit.recommandations,
      url
    );

    audit.user = req.user.id;
    audit.url = url; // 👈 Enregistre la version nettoyée

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
    const audits = await Audit.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(audits);
  } catch (err) {
    console.error("Erreur historique :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📄 Récupération des audits par site
const getAuditHistoryBySite = async (req, res) => {
  try {
    let { site } = req.query;
    const userId = req.user?.id;

    if (!site) {
      return res.status(400).json({ message: "Paramètre site manquant" });
    }

    site = decodeURIComponent(site).replace(/\/+$/, "").toLowerCase();

    const audits = await Audit.find({
      url: {
        $regex: `^${site.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}(\\/)?$`,
        $options: "i",
      },
      user: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (!audits.length) {
      return res
        .status(404)
        .json({ message: "Aucun audit trouvé pour ce site" });
    }

    res.status(200).json(audits);
  } catch (err) {
    console.error("💥 Erreur getAuditHistoryBySite:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getGroupedAuditsBySite = async (req, res) => {
  try {
    const audits = await Audit.find({ user: req.user.id });

    const grouped = {};
    for (const audit of audits) {
      const cleanUrl = audit.url.replace(/\/+$/, "").toLowerCase();
      if (!grouped[cleanUrl]) grouped[cleanUrl] = [];
      grouped[cleanUrl].push(audit);
    }

    const result = Object.entries(grouped).map(([url, audits]) => {
      const sorted = audits.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const last = sorted[0];

      return {
        url,
        count: audits.length,
        lastAudit: {
          createdAt: last.createdAt,
          scores: {
            performance: last.performance,
            accessibility: last.accessibility,
            bestPractices: last.bestPractices,
            seo: last.seo,
          },
        },
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("💥 Erreur getGroupedAuditsBySite:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getReferenceAudit = async (req, res) => {
  const site = req.query.site?.trim().toLowerCase().replace(/\/+$/, "");
  const userId = req.user?.id;

  if (!site) return res.status(400).json({ message: "Site manquant" });

  try {
    const referenceAudit = await Audit.findOne({
      url: site,
      user: userId,
    }).sort({ createdAt: 1 }); // 🔁 le + ancien audit

    if (!referenceAudit)
      return res.status(404).json({ message: "Aucun audit trouvé" });

    res.status(200).json(referenceAudit);
  } catch (err) {
    console.error("Erreur getReferenceAudit:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getAllRecosFromAudits = async (req, res) => {
  try {
    const audits = await Audit.find({}, "recommandations");

    const recosMap = new Map();

    audits.forEach((audit) => {
      audit.recommandations.forEach((reco) => {
        if (!recosMap.has(reco.id)) {
          recosMap.set(reco.id, {
            id: reco.id,
            title: reco.title,
            group: reco.group,
            actions: reco.actions || [],
          });
        }
      });
    });

    const allRecos = Array.from(recosMap.values());

    res.status(200).json(allRecos);
  } catch (err) {
    console.error("Erreur récupération des recommandations:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Export des fonctions pour les routes
export {
  auditWebsite,
  getAuditHistory,
  getAuditHistoryBySite,
  getGroupedAuditsBySite,
  getReferenceAudit,
  getAllRecosFromAudits,
};

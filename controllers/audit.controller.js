import Audit from "../models/Audit.js";
import RecoCatalog from "../models/RecoCatalog.js";
import auditWithLighthouse from "../services/lighthouse.js";
import mongoose from "mongoose";
import { enrichRecommandationsWithCatalogActions } from "../utils/recoActions.utils.js";

// Audit d’un site
const auditWebsite = async (req, res) => {
  let { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  url = url.replace(/\/+$/, "").toLowerCase();

  try {
    const audit = await auditWithLighthouse(url);

    // Synchronisation automatique du catalogue
    await syncRecoCatalog(audit.recommandations);

    // Enrichissement des reco avec actions dynamiques ou catalogue
    audit.recommandations = await enrichRecommandationsWithCatalogActions(
      audit.recommandations,
      audit.lighthouseAudits || {} // Ajoute ce paramètre si tu le passes bien dans ton service
    );

    audit.user = req.user.id;
    audit.url = url;

    await Audit.create(audit);
    res.json(audit);
  } catch (error) {
    console.error("Erreur Lighthouse :", error.message);
    res.status(500).json({ error: "Erreur lors de l'audit Lighthouse" });
  }
};

// Récupération des 10 derniers audits
const getAuditHistory = async (req, res) => {
  try {
    const audits = await Audit.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    // On enrichit les reco pour chaque audit
    for (const audit of audits) {
      audit.recommandations = await enrichRecommandationsWithCatalogActions(
        audit.recommandations
      );
    }

    res.json(audits);
  } catch (err) {
    console.error("Erreur historique :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupération des audits par site, avec enrichissement
const getAuditHistoryBySite = async (req, res) => {
  try {
    let { site } = req.query;
    const userId = req.user?.id;

    if (!site)
      return res.status(400).json({ message: "Paramètre site manquant" });

    site = decodeURIComponent(site).replace(/\/+$/, "").toLowerCase();

    // Récupère les audits (documents mongoose)
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

    // Convertit chaque audit en objet JS simple, puis enrichit
    const enrichedAudits = [];
    for (const auditDoc of audits) {
      const audit = auditDoc.toObject(); // <-- important ici
      audit.recommandations = await enrichRecommandationsWithCatalogActions(
        audit.recommandations
      );
      enrichedAudits.push(audit);
    }

    res.status(200).json(enrichedAudits);
  } catch (err) {
    console.error("Erreur getAuditHistoryBySite:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Regroupement audits par site
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
    console.error("Erreur getGroupedAuditsBySite:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Audit de référence (plus ancien) par site
const getReferenceAudit = async (req, res) => {
  const site = req.query.site?.trim().toLowerCase().replace(/\/+$/, "");
  const userId = req.user?.id;

  if (!site) return res.status(400).json({ message: "Site manquant" });

  try {
    const referenceAudit = await Audit.findOne({
      url: site,
      user: userId,
    }).sort({ createdAt: 1 });

    if (!referenceAudit)
      return res.status(404).json({ message: "Aucun audit trouvé" });

    referenceAudit.recommandations =
      await enrichRecommandationsWithCatalogActions(
        referenceAudit.recommandations
      );

    res.status(200).json(referenceAudit);
  } catch (err) {
    console.error("Erreur getReferenceAudit:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Suppression des audits par site
const deleteAuditsBySite = async (req, res) => {
  try {
    const userId = req.user?.id;
    let { site } = req.body;

    if (!site)
      return res.status(400).json({ message: "Paramètre site manquant" });

    site = site.trim().replace(/\/+$/, "").toLowerCase();

    const result = await Audit.deleteMany({
      user: userId,
      url: {
        $regex: `^${site.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}(\\/)?$`,
        $options: "i",
      },
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Aucun audit trouvé à supprimer" });
    }

    res.status(200).json({
      message: `Suppression réussie (${result.deletedCount} audits supprimés)`,
    });
  } catch (err) {
    console.error("Erreur suppression audits par site :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Synchronisation catalogue reco
const syncRecoCatalog = async (recs) => {
  if (!recs || recs.length === 0) {
    return;
  }

  const ids = recs.map((r) => r.id);

  const existingRecos = await RecoCatalog.find({ id: { $in: ids } });
  const existingIds = new Set(existingRecos.map((r) => r.id));

  const newRecos = recs
    .filter((r) => !existingIds.has(r.id))
    .map((r) => ({
      id: r.id,
      title: r.title,
      group: r.group,
      description: r.description,
      impact: r.impact,
      impactLevel: r.impactLevel,
      displayValue: r.displayValue,
      actions: [],
    }));

  if (newRecos.length > 0) {
    await RecoCatalog.insertMany(newRecos);
  }
};

export {
  auditWebsite,
  getAuditHistory,
  getAuditHistoryBySite,
  getGroupedAuditsBySite,
  getReferenceAudit,
  deleteAuditsBySite,
  syncRecoCatalog,
};

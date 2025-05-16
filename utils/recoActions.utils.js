import RecoCatalog from "../models/RecoCatalog.js";

// --- CONSEILS GÉNÉRAUX (catalogue, advice) ---
const adviceTemplates = {
  "first-contentful-paint": [
    {
      label: "Réduire le délai d’affichage initial (FCP)",
      code: "Optimise les ressources critiques, charge les CSS en priorité, minifie HTML, évite les scripts bloquants dans le <head>.",
    },
  ],
  "largest-contentful-paint": [
    {
      label: "Améliorer le Largest Contentful Paint (LCP)",
      code: "Optimise les images principales, précharge l'image LCP, évite les scripts qui bloquent le rendu, héberge l'image LCP localement.",
    },
  ],
  "speed-index": [
    {
      label: "Améliorer le Speed Index",
      code: "Priorise le chargement des éléments visibles, limite les scripts lourds, utilise le lazy loading pour les images hors écran.",
    },
  ],
  // ... autres conseils généraux comme tu as déjà
  "modern-image-formats": [
    {
      label: "Utiliser des formats d’image modernes (WebP/AVIF)",
      code: "Remplace les images JPEG/PNG par WebP ou AVIF pour réduire leur poids.",
    },
  ],
  // ... etc
};

// --- ACTIONS DYNAMIQUES (quickwins) ---
// Correction : utilise bien le paramètre lighthouseAudit passé (et non une variable globale non définie)
function generateDynamicActionsForReco(rec, lighthouseAudit) {
  if (!lighthouseAudit) return [];

  // Images non optimisées
  if (rec.id === "uses-optimized-images" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Optimiser ${item.url.split("/").pop()}`,
      code: `Réduire le poids de ${item.url} (${Math.round(
        item.totalBytes / 1024
      )} Ko, économie possible : ${Math.round(item.wastedBytes / 1024)} Ko)`,
    }));
  }

  // Images non modernes (WebP/AVIF)
  if (rec.id === "modern-image-formats" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Remplacer ${item.url.split("/").pop()} par du WebP/AVIF`,
      code: `Utilise WebP ou AVIF pour ${item.url} (gain estimé : ${Math.round(
        item.wastedBytes / 1024
      )} Ko)`,
    }));
  }

  // JS inutilisé
  if (rec.id === "unused-javascript" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Retirer le JS inutilisé : ${item.url.split("/").pop()}`,
      code: `Supprime ou découpe ${item.url} (potentiel à économiser : ${Math.round(
        item.wastedBytes / 1024
      )} Ko)`,
    }));
  }

  // CSS inutilisé
  if (rec.id === "unused-css-rules" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Nettoyer le CSS inutilisé : ${item.url.split("/").pop()}`,
      code: `Nettoie ${item.url} (potentiel à économiser : ${Math.round(
        item.wastedBytes / 1024
      )} Ko)`,
    }));
  }

  // Ressources sans long cache TTL
  if (rec.id === "uses-long-cache-ttl" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Prolonger le cache pour : ${item.url.split("/").pop()}`,
      code: `Fixe un cache long (> 1 mois) sur ${item.url}`,
    }));
  }

  // Liens externes sans rel="noopener"
  if (
    rec.id === "external-anchors-use-rel-noopener" &&
    lighthouseAudit.details?.items
  ) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Sécuriser le lien externe : ${item.url}`,
      code: `Ajoute rel="noopener" (et target="_blank" si nécessaire) sur le lien ${item.url}`,
    }));
  }

  // Images sans alt
  if (rec.id === "image-alt" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Ajouter un texte alternatif à ${item.url.split("/").pop()}`,
      code: `Ajoute un attribut alt explicite à l’image ${item.url}`,
    }));
  }

  // Polices non optimisées (font-display)
  if (rec.id === "font-display" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Optimiser l'affichage de la police : ${item.url.split("/").pop()}`,
      code: `Ajoute font-display: swap; sur ${item.url}`,
    }));
  }

  // Formulaires sans label associé (label)
  if (rec.id === "label" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Ajouter un label au champ ${item.node?.snippet || ""}`,
      code: `Associe un label explicite à ce champ de formulaire.`,
    }));
  }

  // Liens cassés (broken links)
  if (rec.id === "broken-links" && lighthouseAudit.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Corriger le lien cassé : ${item.url}`,
      code: `Vérifie et corrige le lien brisé : ${item.url}`,
    }));
  }

  // Autres cas
  return [];
}

// --- FUSION CONSEIL + ACTIONS ---
const enrichRecommandationsWithCatalogActions = async (
  recs,
  lighthouseAudits = {}
) => {
  if (!recs || recs.length === 0) return [];

  const ids = recs.map((r) => r.id);
  const catalogRecos = await RecoCatalog.find({ id: { $in: ids } });
  const catalogMap = new Map(catalogRecos.map((c) => [c.id, c]));

  return recs.map((rec) => {
    // Conseils généraux : catalogue (admin) > adviceTemplates
    const advice =
      catalogMap.get(rec.id)?.advice && catalogMap.get(rec.id).advice.length
        ? catalogMap.get(rec.id).advice
        : adviceTemplates[rec.id] || [];

    // Actions dynamiques (quickwins) — IMPORTANT : utiliser lighthouseAudit correspondant
    const actions = generateDynamicActionsForReco(
      rec,
      lighthouseAudits[rec.id]
    );

    return {
      ...rec,
      advice, // conseils globaux
      actions, // quickwins personnalisés
    };
  });
};

export {
  generateDynamicActionsForReco,
  enrichRecommandationsWithCatalogActions,
  adviceTemplates,
};

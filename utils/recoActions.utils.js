import RecoCatalog from "../models/RecoCatalog.js";

// Templates d’actions “catalogue” (fallback manuel, modifiable en admin)
const actionTemplates = {
  "first-contentful-paint": [
    {
      label: "Réduire le délai d’affichage initial (FCP)",
      code: "Optimise les ressources critiques, charge les CSS en priorité, minifie HTML, évite les scripts bloquants dans le <head>.",
    },
  ],
  "largest-contentful-paint": [
    {
      label: "Améliorer le LCP (élément principal visible)",
      code: "Optimise et précharge l’image/élément principal, réduit le JavaScript bloquant, améliore la vitesse du serveur.",
    },
  ],
  "speed-index": [
    {
      label: "Améliorer le Speed Index",
      code: "Évite le JavaScript/CSS inutile en haut de page, privilégie le lazy loading, optimise les images.",
    },
  ],
  "total-blocking-time": [
    {
      label: "Réduire le temps de blocage total",
      code: "Divise ton JS en petits morceaux, utilise le lazy loading pour les scripts lourds, limite les librairies tierces.",
    },
  ],
  "max-potential-fid": [
    {
      label: "Réduire le First Input Delay potentiel",
      code: "Évite le JS lourd sur le thread principal, privilégie les Web Workers pour les calculs complexes.",
    },
  ],
  "errors-in-console": [
    {
      label: "Corriger les erreurs JS dans la console",
      code: "Ouvre la console navigateur (F12) et corrige toutes les erreurs affichées lors du chargement.",
    },
  ],
  interactive: [
    {
      label: "Rendre la page interactive plus rapidement",
      code: "Limite les scripts lourds au chargement, optimise le critical rendering path.",
    },
  ],
  redirects: [
    {
      label: "Éviter les redirections inutiles",
      code: "Supprime ou réduis le nombre de redirections (301/302) avant d’atteindre la page cible.",
    },
  ],
  "mainthread-work-breakdown": [
    {
      label: "Réduire le travail du thread principal",
      code: "Divise le JavaScript en modules plus petits, privilégie l’asynchrone pour les tâches lourdes.",
    },
  ],
  "bootup-time": [
    {
      label: "Réduire le temps d’exécution JS initial",
      code: "Découpe le JS, retire les scripts non critiques du bundle principal.",
    },
  ],
  "third-party-summary": [
    {
      label: "Réduire l’impact du code tiers",
      code: "Supprime les librairies JS inutilisées, charge les scripts de tracking/analytics de façon asynchrone.",
    },
  ],
  "largest-contentful-paint-element": [
    {
      label: "Identifier et optimiser l’élément LCP",
      code: "Utilise Lighthouse pour repérer l’élément principal et optimise sa taille, son format et son affichage.",
    },
  ],
  "valid-source-maps": [
    {
      label: "Ajouter les source maps",
      code: "Génère et publie les fichiers .map pour déboguer ton JS minifié.",
    },
  ],
  "aria-input-field-name": [
    {
      label: "Ajouter un nom accessible aux champs ARIA",
      code: "Ajoute un attribut aria-label ou un label explicite sur chaque champ de formulaire.",
    },
  ],
  "color-contrast": [
    {
      label: "Améliorer le contraste texte/fond",
      code: "Utilise des couleurs qui respectent le ratio minimum WCAG (AA ou AAA).",
    },
  ],
  "link-name": [
    {
      label: "Ajouter un texte explicite aux liens",
      code: "Vérifie que tous tes liens ont un texte compréhensible, pas de 'Cliquez ici' isolé.",
    },
  ],
  "meta-viewport": [
    {
      label: "Activer le zoom utilisateur",
      code: "Supprime user-scalable='no' et maximum-scale<5 dans ta balise meta viewport.",
    },
  ],
  "uses-long-cache-ttl": [
    {
      label: "Configurer un cache long sur les ressources statiques",
      code: "Définis une durée d’expiration élevée sur tes fichiers JS/CSS/images via les headers HTTP.",
    },
  ],
  "total-byte-weight": [
    {
      label: "Réduire la taille totale des ressources",
      code: "Compresse les images, minifie JS et CSS, limite les polices et ressources externes.",
    },
  ],
  "unminified-javascript": [
    {
      label: "Minifier le JavaScript",
      code: "Utilise un outil de build (Webpack, esbuild, Vite) pour minifier ton JS avant déploiement.",
    },
  ],
  "unused-css-rules": [
    {
      label: "Supprimer le CSS inutilisé",
      code: "Utilise PurgeCSS ou un outil similaire pour retirer les règles CSS jamais utilisées.",
    },
  ],
  "unused-javascript": [
    {
      label: "Retirer le JS non utilisé",
      code: "Analyse tes bundles avec SourceMap Explorer, retire les librairies inutiles.",
    },
  ],
  "modern-image-formats": [
    {
      label: "Utiliser WebP ou AVIF pour les images",
      code: "Convertis tes images JPG/PNG en WebP ou AVIF pour un chargement plus rapide.",
    },
  ],
  "uses-text-compression": [
    {
      label: "Activer la compression GZIP/Brotli",
      code: "Active la compression GZIP ou Brotli sur ton serveur web pour tous les fichiers texte.",
    },
  ],
  "uses-responsive-images": [
    {
      label: "Redimensionner les images",
      code: "Utilise des images à la bonne taille, ajoute les attributs srcset/sizes sur tes <img>.",
    },
  ],
  "legacy-javascript": [
    {
      label: "Retirer les polyfills inutiles",
      code: "Cible les navigateurs modernes pour tes bundles, retire le JS ES5/IE.",
    },
  ],
  "dom-size": [
    {
      label: "Réduire la taille du DOM",
      code: "Diminue le nombre de noeuds HTML, supprime les éléments inutiles.",
    },
  ],
  "bf-cache": [
    {
      label: "Activer le back/forward cache",
      code: "Supprime les listeners unload/beforeunload, évite les scripts qui bloquent la navigation.",
    },
  ],
  "cache-insight": [
    {
      label: "Utiliser une politique de cache efficace",
      code: "Augmente le cache sur les ressources statiques, expire rarement les fichiers inchangés.",
    },
  ],
  "document-latency-insight": [
    {
      label: "Optimiser le délai de réponse du serveur",
      code: "Utilise un CDN, accélère la génération de page (SSR, cache).",
    },
  ],
  "dom-size-insight": [
    {
      label: "Optimiser la taille du DOM",
      code: "Fractionne les pages longues, retire les éléments cachés ou inutiles.",
    },
  ],
  "forced-reflow-insight": [
    {
      label: "Éviter le reflow forcé",
      code: "Regroupe les lectures/écritures de style JS, évite layout thrashing.",
    },
  ],
  "image-delivery-insight": [
    {
      label: "Optimiser la livraison des images",
      code: "Utilise un CDN pour les images, compresse au maximum, charge en lazy.",
    },
  ],
  "lcp-discovery-insight": [
    {
      label: "Optimiser le chargement LCP",
      code: "Précharge l’image/élément LCP avec <link rel='preload'>.",
    },
  ],
  "legacy-javascript-insight": [
    {
      label: "Nettoyer le code JS legacy",
      code: "Supprime les scripts anciens, privilégie la compatibilité ES6+.",
    },
  ],
  // — Exemples de base génériques ou hérités de ta version précédente :
  "meta-description": [
    {
      label: "Ajouter une meta description",
      code: 'Ajoute une balise <meta name="description"> pertinente dans le <head>.',
    },
  ],
  "document-title": [
    {
      label: "Ajouter un titre à la page",
      code: "Ajoute une balise <title> explicite dans le <head> de la page.",
    },
  ],
  viewport: [
    {
      label: "Ajouter la balise meta viewport",
      code: 'Ajoute <meta name="viewport" content="width=device-width, initial-scale=1"> dans le <head>.',
    },
  ],
  // Ajoute d'autres recos personnalisées si besoin...
};

// Génération dynamique des actions selon la reco et l’audit Lighthouse
function generateDynamicActionsForReco(rec, lighthouseAudit) {
  // Images non optimisées
  if (rec.id === "uses-optimized-images" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Optimiser ${item.url.split("/").pop()}`,
      code: `Réduire le poids de ${item.url} (${Math.round(item.totalBytes / 1024)} Ko, économie possible : ${Math.round(item.wastedBytes / 1024)} Ko)`,
    }));
  }

  // Images non modernes (WebP/AVIF)
  if (rec.id === "modern-image-formats" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Remplacer ${item.url.split("/").pop()} par du WebP/AVIF`,
      code: `Utilise WebP ou AVIF pour ${item.url} (gain estimé : ${Math.round(item.wastedBytes / 1024)} Ko)`,
    }));
  }

  // JS inutilisé
  if (rec.id === "unused-javascript" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Retirer le JS inutilisé : ${item.url.split("/").pop()}`,
      code: `Supprime ou découpe ${item.url} (potentiel à économiser : ${Math.round(item.wastedBytes / 1024)} Ko)`,
    }));
  }

  // CSS inutilisé
  if (rec.id === "unused-css-rules" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Nettoyer le CSS inutilisé : ${item.url.split("/").pop()}`,
      code: `Nettoie ${item.url} (potentiel à économiser : ${Math.round(item.wastedBytes / 1024)} Ko)`,
    }));
  }

  // Ressources sans long cache TTL
  if (rec.id === "uses-long-cache-ttl" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Prolonger le cache pour : ${item.url.split("/").pop()}`,
      code: `Fixe un cache long (> 1 mois) sur ${item.url}`,
    }));
  }

  // Liens externes sans rel="noopener"
  if (
    rec.id === "external-anchors-use-rel-noopener" &&
    lighthouseAudit?.details?.items
  ) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Sécuriser le lien externe : ${item.url}`,
      code: `Ajoute rel="noopener" (et target="_blank" si nécessaire) sur le lien ${item.url}`,
    }));
  }

  // Images sans alt
  if (rec.id === "image-alt" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Ajouter un texte alternatif à ${item.url.split("/").pop()}`,
      code: `Ajoute un attribut alt explicite à l’image ${item.url}`,
    }));
  }

  // Liens cassés (broken links)
  if (rec.id === "broken-links" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Corriger le lien cassé : ${item.url}`,
      code: `Vérifie et corrige le lien brisé : ${item.url}`,
    }));
  }

  // Polices non optimisées (font-display)
  if (rec.id === "font-display" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Optimiser l'affichage de la police : ${item.url.split("/").pop()}`,
      code: `Ajoute font-display: swap; sur ${item.url}`,
    }));
  }

  // Formulaires sans label associé (label)
  if (rec.id === "label" && lighthouseAudit?.details?.items) {
    return lighthouseAudit.details.items.map((item) => ({
      label: `Ajouter un label au champ ${item.node?.snippet || ""}`,
      code: `Associe un label explicite à ce champ de formulaire.`,
    }));
  }

  // Ajoute ici d'autres recos dynamiques selon Lighthouse…

  // Fallback : template catalogue
  return actionTemplates[rec.id] || [];
}

// Fonction pour enrichir les recommandations avec actions dynamiques ou catalogue
const enrichRecommandationsWithCatalogActions = async (
  recs,
  lighthouseAudits = {}
) => {
  if (!recs || recs.length === 0) return [];

  const ids = recs.map((r) => r.id);
  const catalogRecos = await RecoCatalog.find({ id: { $in: ids } });
  const catalogMap = new Map(catalogRecos.map((c) => [c.id, c]));

  return recs.map((rec) => {
    // Actions dynamiques (via Lighthouse, s'il y en a)
    const dynamicActions = generateDynamicActionsForReco(
      rec,
      lighthouseAudits[rec.id]
    );
    // Actions catalogue si pas de dynamiques
    const catalogActions = catalogMap.get(rec.id)?.actions || [];
    // Tag d'origine pour affichage admin/front
    const actions =
      dynamicActions.length > 0
        ? dynamicActions.map((a) => ({ ...a, type: "dynamic" }))
        : catalogActions.map((a) => ({ ...a, type: "catalog" }));

    return {
      ...rec,
      actions,
    };
  });
};

export {
  generateDynamicActionsForReco,
  enrichRecommandationsWithCatalogActions,
  actionTemplates,
};

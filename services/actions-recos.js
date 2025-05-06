// services/actions-recos.js

/**
 * Génère des actions concrètes à partir d'une recommandation.
 * @param {Object} rec - La recommandation.
 * @param {Object} context - Contexte éventuel (url, etc).
 * @returns {Array} Liste d'actions concrètes.
 */
export const getActionsForReco = (rec, context = {}) => {
  const actions = [];

  switch (rec.id) {
    // 🔒 HTTPS
    case "is-on-https":
      actions.push({
        label: "Activer le HTTPS sur votre hébergement web",
        code: "Utilisez un certificat SSL/TLS comme Let's Encrypt pour sécuriser votre domaine.",
      });
      break;

    // ⚠️ Console errors
    case "errors-in-console":
      actions.push({
        label:
          "Ouvrir la console navigateur (F12) et corriger les erreurs JavaScript ou réseau",
      });
      break;

    case "issues-in-console":
      actions.push({
        label:
          "Ouvrir l’onglet ‘Issues’ dans les DevTools Chrome (F12) et corriger les problèmes détectés",
      });
      break;

    // 🎨 Couleurs contrastées
    case "color-contrast":
      actions.push({
        label:
          "Augmenter le contraste entre le texte et le fond pour garantir une lisibilité suffisante",
      });
      break;

    case "heading-order":
      actions.push({
        label:
          "Vérifier l’ordre des titres (h1 > h2 > h3...) sans sauter de niveaux",
      });
      break;

    case "link-name":
      actions.push({
        label:
          "Donner un texte descriptif à chaque lien (éviter les ‘cliquez ici’)",
      });
      break;

    case "link-in-text-block":
      actions.push({
        label:
          "Ajouter une distinction autre que la couleur (comme un soulignement) pour les liens",
      });
      break;

    case "meta-viewport":
      actions.push({
        label: "Ne pas désactiver le zoom sur mobile",
        code: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
      });
      break;

    case "font-size":
      actions.push({
        label: "S'assurer que 60% du texte est en 12px minimum",
        code: `body { font-size: 15px; }`,
      });
      break;

    case "html-has-lang":
      actions.push({
        label: "Ajouter l’attribut lang à la balise <html>",
        code: `<html lang="fr">`,
      });
      break;

    case "meta-description":
      actions.push({
        label: "Ajouter une meta description à la page",
        code: `<meta name="description" content="Votre description ici">`,
      });
      break;

    case "uses-webp-images":
      actions.push({
        label: "Convertir vos images en WebP ou AVIF",
        code: `Utilisez Squoosh ou un outil d'optimisation d’image en ligne pour convertir vos images.`,
      });
      break;

    case "uses-optimized-images":
      actions.push({
        label:
          "Réencoder les images pour qu’elles soient plus légères (compression sans perte)",
      });
      break;

    case "uses-responsive-images":
      actions.push({
        label: "Fournir des images plus petites adaptées aux mobiles",
        code: `<img srcset="image-small.jpg 480w, image-large.jpg 800w" sizes="(max-width: 600px) 480px, 800px">`,
      });
      break;

    case "image-size":
    case "image-elements-do-not-have-explicit-width-and-height":
      actions.push({
        label: "Ajouter les attributs width et height sur vos images",
        code: `<img src="photo.jpg" width="400" height="300">`,
      });
      break;

    case "font-display":
      actions.push({
        label: "Ajouter font-display: swap; sur vos imports de fonts",
        code: `@font-face { font-display: swap; }`,
      });
      break;

    case "uses-long-cache-ttl":
      actions.push({
        label:
          "Ajouter un header de cache long (1 an) sur les ressources statiques",
        code: `Cache-Control: public, max-age=31536000`,
      });
      break;

    case "render-blocking-resources":
      actions.push({
        label:
          "Reporter le chargement des JS non critiques avec defer ou async",
        code: `<script src="script.js" defer></script>`,
      });
      break;

    case "unused-css-rules":
      actions.push({
        label:
          "Supprimer les règles CSS inutilisées ou charger dynamiquement selon la page",
      });
      break;

    case "unused-javascript":
      actions.push({
        label:
          "Supprimer les scripts non utilisés ou fractionner votre JS par page",
      });
      break;

    case "uses-http2":
      actions.push({
        label:
          "Activer HTTP/2 sur votre serveur (via votre hébergeur ou votre configuration nginx/apache)",
      });
      break;

    case "first-contentful-paint":
      return [
        {
          label: "Optimiser les ressources critiques (CSS, JS, polices)",
          code: "👉 Déplacer les scripts en bas de page ou les charger avec `defer` ou `async`",
        },
        {
          label: "Réduire le poids des images et des polices",
          code: "👉 Utiliser des formats modernes (WebP) et compresser les polices",
        },
      ];

    case "largest-contentful-paint":
      return [
        {
          label: "Précharger l’élément principal du contenu (image, H1...)",
          code: `<link rel="preload" as="image" href="IMAGE_URL">`,
        },
        {
          label: "Éviter le lazy-loading sur l'image principale",
          code: `👉 Supprimer l'attribut \`loading="lazy"\` sur l’image principale`,
        },
      ];

    case "speed-index":
      return [
        {
          label: "Réduire le poids total de la page",
          code: "👉 Compresser les images, réduire les JS/CSS inutiles",
        },
        {
          label: "Réduire les ressources bloquantes",
          code: "👉 Charger CSS/JS de manière non bloquante",
        },
      ];

    case "cumulative-layout-shift":
      return [
        {
          label: "Ajouter width/height sur toutes les images",
          code: `<img src="..." width="300" height="200">`,
        },
        {
          label: "Réserver l’espace pour les pubs, carrousels, embeds",
          code: "👉 Utiliser des conteneurs fixes ou ratio-box",
        },
      ];

    default:
      break;
  }

  return actions;
};

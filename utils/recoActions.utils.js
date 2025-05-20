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
  "modern-image-formats": [
    {
      label: "Utiliser des formats d’image modernes (WebP/AVIF)",
      code: "Remplace les images JPEG/PNG par WebP ou AVIF pour réduire leur poids.",
    },
  ],
  "meta-viewport": [
    {
      label: "Autoriser le zoom pour l’accessibilité mobile",
      code: 'Supprime `[user-scalable="no"]` dans la balise `<meta name="viewport">` pour permettre le zoom aux utilisateurs malvoyants.',
    },
  ],
  "total-byte-weight": [
    {
      label: "Réduire le poids total des ressources chargées",
      code: "Optimise les images, minifie le JS/CSS, utilise la compression Gzip/Brotli et évite de charger des ressources inutiles.",
    },
  ],
  "unminified-javascript": [
    {
      label: "Minifier le JavaScript",
      code: "Passe tous tes fichiers JS par un outil de minification (ex: Terser, UglifyJS, esbuild) pour réduire leur taille.",
    },
  ],
  "dom-size": [
    {
      label: "Réduire la taille du DOM",
      code: "Diminue le nombre de nœuds HTML en supprimant les éléments inutiles, fractionne les longues pages, et évite les listes/répétitions non nécessaires.",
    },
  ],
  "link-in-text-block": [
    {
      label: "Rendre les liens visibles sans se fier à la couleur uniquement",
      code: "Ajoute un soulignement ou une différenciation visuelle (ex: gras, fond, icône) aux liens pour qu’ils soient repérables, même pour les daltoniens.",
    },
  ],
  "efficient-animated-content": [
    {
      label: "Remplacer les GIFs animés lourds par du MP4/WebM",
      code: "Utilise le format vidéo (MP4/WebM) pour les animations : bien plus léger qu’un GIF animé et supporte la compression.",
    },
  ],
  "meta-description": [
    {
      label: "Ajouter une meta description pour le SEO",
      code: 'Ajoute une balise `<meta name="description" content="…">` sur chaque page pour résumer le contenu dans les résultats de recherche.',
    },
  ],
  "crawlable-anchors": [
    {
      label: "Rendre tous les liens crawlables par les moteurs de recherche",
      code: "Vérifie que tous les liens importants ont un attribut `href` valide et ne sont pas en JS pur ou en pseudo-liens.",
    },
  ],
  "cumulative-layout-shift": [
    {
      label: "Réduire le déplacement inattendu des éléments (CLS)",
      code: "Réserve l’espace pour les images, pubs, iframes avec les attributs `width`/`height` ou via CSS (aspect-ratio). Évite d’injecter dynamiquement du contenu au-dessus de la ligne de flottaison.",
    },
  ],
  "largest-contentful-paint-element": [
    {
      label: "Optimiser l’élément principal affiché (LCP)",
      code: 'Précharge l’image ou le bloc principal (`<link rel="preload">`), héberge l’élément LCP localement et évite les scripts qui bloquent son affichage.',
    },
  ],
  "avoid-large-layout-shifts": [
    {
      label: "Éviter les gros déplacements de mise en page",
      code: "Réserve toujours de l’espace pour chaque composant avant qu’il soit chargé, et évite de modifier la taille des éléments déjà rendus.",
    },
  ],
  "render-blocking-resources": [
    {
      label: "Éliminer les ressources qui bloquent le rendu (JS/CSS critiques)",
      code: '• Déplace les <script> non critiques en bas de page ou utilise l\'attribut "defer" ou "async".',
    },
    {
      label: "Éliminer les ressources qui bloquent le rendu (JS/CSS critiques)",
      code: "• Inlines le CSS critique directement dans le <head>.",
    },
    {
      label: "Éliminer les ressources qui bloquent le rendu (JS/CSS critiques)",
      code: "• Diffère ou charge de façon asynchrone les styles et scripts non essentiels.",
    },
  ],
  "uses-responsive-images": [
    {
      label:
        "Redimensionner les images pour qu'elles soient adaptées à l'affichage",
      code: "• Utilise des attributs width/height adaptés dans les balises <img>.",
    },
    {
      label:
        "Redimensionner les images pour qu'elles soient adaptées à l'affichage",
      code: "• Génére plusieurs versions de chaque image (formats responsives : srcset, sizes).",
    },
    {
      label:
        "Redimensionner les images pour qu'elles soient adaptées à l'affichage",
      code: "• Privilégie le lazy loading pour les images hors-écran.",
    },
  ],
  "cache-insight": [
    {
      label: "Configurer un cache efficace pour les ressources statiques",
      code: "• Mets en place un cache longue durée (au moins 30 jours) pour les ressources statiques (images, JS, CSS).",
    },
    {
      label: "Configurer un cache efficace pour les ressources statiques",
      code: '• Ajoute des headers "Cache-Control" ou "Expires" sur le serveur.',
    },
    {
      label: "Configurer un cache efficace pour les ressources statiques",
      code: "• Attention : en cas de changement de fichier, change aussi le nom du fichier (hash) pour forcer la mise à jour côté client.",
    },
  ],
  "layout-shifts": [
    {
      label: "Réduire les grands déplacements de mise en page (CLS)",
      code: "• Toujours définir des tailles fixes (width/height) sur les images, vidéos et iframes.",
    },
    {
      label: "Réduire les grands déplacements de mise en page (CLS)",
      code: "• Évite d'injecter dynamiquement des contenus au-dessus du contenu visible (ex : bannières, pubs, consentements).",
    },
    {
      label: "Réduire les grands déplacements de mise en page (CLS)",
      code: '• Précharge les polices ou utilise "font-display: swap" pour éviter les décalages dus aux polices.',
    },
    {
      label: "Réduire les grands déplacements de mise en page (CLS)",
      code: "• Utilise des animations CSS plutôt que de modifier brutalement la position/structure du DOM.",
    },
  ],
  "cls-culprits-insight": [
    {
      label: "Identifier et corriger les éléments responsables des décalages",
      code: "• Vérifie les éléments signalés (images, blocs, boutons) et ajoute-leur une taille fixe.",
    },
    {
      label: "Identifier et corriger les éléments responsables des décalages",
      code: "• Évite de charger ou de déplacer tardivement des contenus dans le flux du document.",
    },
    {
      label: "Identifier et corriger les éléments responsables des décalages",
      code: '• Précharge les polices utilisées ou utilise "font-display: swap".',
    },
  ],
  "font-display-insight": [
    {
      label: "Optimiser l’affichage des polices web",
      code: '• Ajoute "font-display: swap;" dans la déclaration des polices personnalisées (ex : Google Fonts, @font-face).',
    },
    {
      label: "Optimiser l’affichage des polices web",
      code: "• Cela permet d’afficher rapidement une police de secours puis d’appliquer la police finale dès qu’elle est chargée, limitant les CLS.",
    },
  ],
  "image-delivery-insight": [
    {
      label: "Optimiser la livraison des images",
      code: "• Compresse toutes les images sans perte de qualité visuelle perceptible.",
    },
    {
      label: "Optimiser la livraison des images",
      code: "• Utilise des formats modernes (WebP, AVIF).",
    },
    {
      label: "Optimiser la livraison des images",
      code: "• Active le lazy loading sur les images hors écran.",
    },
    {
      label: "Optimiser la livraison des images",
      code: "• Servez différentes tailles selon la résolution de l'écran (attributs srcset, sizes, responsive).",
    },
  ],
  "network-dependency-tree-insight": [
    {
      label: "Réduire la dépendance en chaîne des requêtes réseau",
      code: "• Regroupe les scripts et styles critiques pour éviter les chargements en cascade.",
    },
    {
      label: "Réduire la dépendance en chaîne des requêtes réseau",
      code: "• Utilise le préchargement (preload, preconnect) pour les ressources clés.",
    },
    {
      label: "Réduire la dépendance en chaîne des requêtes réseau",
      code: "• Repousse ou asynchrone le chargement des scripts non critiques (async, defer).",
    },
    {
      label: "Réduire la dépendance en chaîne des requêtes réseau",
      code: "• Réduit la taille et le nombre de fichiers à charger au strict nécessaire.",
    },
  ],
  "render-blocking-insight": [
    {
      label: "Éliminer les ressources bloquant le rendu",
      code: '• Place les balises <script> en bas du <body> ou ajoute "async"/"defer".',
    },
    {
      label: "Éliminer les ressources bloquant le rendu",
      code: "• Minifie et regroupe les fichiers CSS critiques, charge le reste en différé.",
    },
    {
      label: "Éliminer les ressources bloquant le rendu",
      code: "• Utilise le chargement asynchrone ou différé pour le JS non essentiel.",
    },
    {
      label: "Éliminer les ressources bloquant le rendu",
      code: "• Privilégie l’inlining du CSS critique dans le <head>.",
    },
  ],
  "max-potential-fid": [
    {
      label: "Réduire le délai potentiel maximal de la première interaction",
      code: "• Découpez et différé le chargement des gros bundles JavaScript (code splitting).",
    },
    {
      label: "Réduire le délai potentiel maximal de la première interaction",
      code: "• Utilisez le « polyfill-on-demand » pour ne charger que les polyfills nécessaires.",
    },
    {
      label: "Réduire le délai potentiel maximal de la première interaction",
      code: "• Mettez en cache efficacement vos scripts critiques via des headers HTTP (Cache-Control).",
    },
    {
      label: "Réduire le délai potentiel maximal de la première interaction",
      code: "• Déléguez les tâches longues hors du thread principal (Web Workers).",
    },
    {
      label: "Réduire le délai potentiel maximal de la première interaction",
      code: "• Privilégiez l’API Idle Until Urgent pour retarder l’exécution du code non essentiel.",
    },
  ],
  interactive: [
    {
      label: "Améliorer le Time to Interactive (TTI)",
      code: "• Analysez et fractionnez vos bundles JavaScript avec un bundle analyzer.",
    },
    {
      label: "Améliorer le Time to Interactive (TTI)",
      code: "• Appliquez async ou defer aux <script> non critiques.",
    },
    {
      label: "Améliorer le Time to Interactive (TTI)",
      code: "• Scindez les tâches longues en micro-tâches (requestIdleCallback).",
    },
    {
      label: "Améliorer le Time to Interactive (TTI)",
      code: "• Préchauffez les ressources clés via prefetch/prerender.",
    },
    {
      label: "Améliorer le Time to Interactive (TTI)",
      code: "• Remplacez les bibliothèques lourdes par des alternatives plus légères.",
    },
  ],
  redirects: [
    {
      label: "Éviter les redirections multiples",
      code: "• Supprimez les redirections 301/302 inutiles côté serveur.",
    },
    {
      label: "Éviter les redirections multiples",
      code: "• Mettez à jour tous vos liens internes pour viser directement l’URL finale.",
    },
    {
      label: "Éviter les redirections multiples",
      code: "• Utilisez HSTS et la balise canonical pour forcer HTTPS sans redirect intermédiaire.",
    },
    {
      label: "Éviter les redirections multiples",
      code: "• Vérifiez avec un crawler que chaque page n’a qu’une seule étape de redirection.",
    },
  ],
  "image-aspect-ratio": [
    {
      label: "Corriger le ratio d’aspect des images",
      code: "• Spécifiez systématiquement des attributs width et height correspondant aux dimensions naturelles.",
    },
    {
      label: "Corriger le ratio d’aspect des images",
      code: "• Utilisez CSS (aspect-ratio ou conteneurs à ratio fixe) pour réserver l’espace.",
    },
    {
      label: "Corriger le ratio d’aspect des images",
      code: "• Servez un placeholder (skeleton) de la bonne taille avant le chargement complet.",
    },
    {
      label: "Corriger le ratio d’aspect des images",
      code: "• Auditez régulièrement vos pages avec Lighthouse pour détecter les images mal proportionnées.",
    },
  ],
  "image-size-responsive": [
    {
      label: "Servir des images adaptées à la résolution",
      code: "• Générez plusieurs versions d’une même image (WebP/AVIF et JPEG optimisés).",
    },
    {
      label: "Servir des images adaptées à la résolution",
      code: "• Utilisez les attributs srcset et sizes pour fournir la source la plus appropriée.",
    },
    {
      label: "Servir des images adaptées à la résolution",
      code: '• Implémentez le lazy-loading (loading="lazy") pour différer les images hors-écran.',
    },
    {
      label: "Servir des images adaptées à la résolution",
      code: "• Compressez sans perte avec imagemin, Squoosh ou via un CDN image optimisé.",
    },
    {
      label: "Servir des images adaptées à la résolution",
      code: "• Livrez-les depuis un CDN configuré pour la mise en cache et l’optimisation automatique.",
    },
  ],
  deprecations: [
    {
      label: "Remplacer les APIs dépréciées",
      code: "• Passez en revue les avertissements de console pour détecter les méthodes obsolètes.",
    },
    {
      label: "Remplacer les APIs dépréciées",
      code: "• Mettez à jour les dépendances vers leurs dernières versions (npm update).",
    },
    {
      label: "Remplacer les APIs dépréciées",
      code: "• Remplacez les APIs dépréciées par leurs équivalents modernes (Fetch au lieu de XHR).",
    },
    {
      label: "Remplacer les APIs dépréciées",
      code: "• Automatisez la détection avec des linters (ESLint plugin compat).",
    },
  ],
  "uses-rel-preconnect": [
    {
      label: "Préconnecter aux origines requises",
      code: '• Ajoutez `<link rel="preconnect" href="https://exemple.com" crossorigin>` dans le `<head>`.',
    },
    {
      label: "Préconnecter aux origines requises",
      code: '• Utilisez `<link rel="dns-prefetch" href="https://exemple.com">` pour accélérer la résolution DNS.',
    },
    {
      label: "Préconnecter aux origines requises",
      code: '• Combinez avec `<link rel="preload" as="font" href="/police.woff2" crossorigin>` pour les polices.',
    },
  ],
  "lcp-lazy-loaded": [
    {
      label: "Ne pas différer l’image LCP",
      code: "• Identifiez l’élément LCP dans votre page (DevTools).",
    },
    {
      label: "Ne pas différer l’image LCP",
      code: '• Chargez cette image en priorité avec `<link rel="preload" as="image" href="...">`.',
    },
    {
      label: "Ne pas différer l’image LCP",
      code: '• Retirez `loading="lazy"` de l’image critique LCP.',
    },
  ],
  "unsized-images": [
    {
      label: "Définir width et height sur les images",
      code: "• Spécifiez systématiquement les attributs `width` et `height` correspondant aux dimensions naturelles.",
    },
    {
      label: "Définir width et height sur les images",
      code: "• Utilisez CSS `aspect-ratio` ou conteneurs à ratio fixe pour réserver l’espace.",
    },
    {
      label: "Définir width et height sur les images",
      code: "• Auditez avec Lighthouse et corrigez toutes les images non dimensionnées.",
    },
  ],
  "button-name": [
    {
      label: "Ajouter un nom accessible aux boutons",
      code: "• Ajoutez un attribut `aria-label` ou un contenu texte descriptif à chaque `<button>`.",
    },
    {
      label: "Ajouter un nom accessible aux boutons",
      code: "• Vérifiez l’accessibilité via un outil comme axe ou Lighthouse.",
    },
  ],
  "color-contrast": [
    {
      label: "Améliorer le contraste des couleurs",
      code: "• Utilisez un ratio de contraste d’au moins 4.5:1 pour le texte normal.",
    },
    {
      label: "Améliorer le contraste des couleurs",
      code: "• Testez vos combinaisons de couleurs avec un outil comme Contrast Checker.",
    },
    {
      label: "Améliorer le contraste des couleurs",
      code: "• Ajustez les teintes ou l’épaisseur de la police pour atteindre le ratio minimal.",
    },
  ],
  "link-name": [
    {
      label: "Ajouter un nom discernable aux liens",
      code: "• Assurez-vous que chaque `<a>` contient un texte descriptif ou un `aria-label`.",
    },
    {
      label: "Ajouter un nom discernable aux liens",
      code: "• Évitez les liens vides ou avec du texte générique comme “Cliquez ici”.",
    },
  ],
  "target-size": [
    {
      label: "Agrandir les cibles tactiles",
      code: "• Assurez-vous que chaque cible a au moins 44×44 px cliquables.",
    },
    {
      label: "Agrandir les cibles tactiles",
      code: "• Ajoutez un espacement minimal de 8 px entre les cibles interactives.",
    },
  ],
  "offscreen-images": [
    {
      label: "Différer les images hors écran",
      code: '• Appliquez `loading="lazy"` aux images non critiques.',
    },
    {
      label: "Différer les images hors écran",
      code: "• Préservez l’espace d’affichage avec des attributs `width`/`height` ou `aspect-ratio`.",
    },
  ],
  "legacy-javascript": [
    {
      label: "Éviter de servir du JS legacy aux navigateurs modernes",
      code: "• Configurez un pipeline de build pour générer des bundles ES modules pour les navigateurs récents.",
    },
    {
      label: "Éviter de servir du JS legacy aux navigateurs modernes",
      code: "• Servez un polyfill-on-demand uniquement aux navigateurs qui en ont besoin.",
    },
  ],
  "uses-passive-event-listeners": [
    {
      label: "Utiliser des listeners passifs pour le scroll",
      code: "• Ajoutez `{ passive: true }` sur les écouteurs `touchstart` et `touchmove`.",
    },
    {
      label: "Utiliser des listeners passifs pour le scroll",
      code: "• Vérifiez que les listeners n’appellent pas `preventDefault()` de façon bloquante.",
    },
  ],
  "bf-cache": [
    {
      label: "Autoriser la restauration via back/forward cache",
      code: "• Ne définissez pas d’en-têtes `Cache-Control: no-store` sur le document principal.",
    },
    {
      label: "Autoriser la restauration via back/forward cache",
      code: "• Évitez les scripts qui écoutent `unload` ou `beforeunload` inutilement.",
    },
  ],
  "document-latency-insight": [
    {
      label: "Réduire la latence de la requête du document",
      code: "• Déployez un CDN ou un point d’accès géographique proche de vos utilisateurs.",
    },
    {
      label: "Réduire la latence de la requête du document",
      code: "• Activez la compression gzip ou brotli côté serveur.",
    },
  ],
  "forced-reflow-insight": [
    {
      label: "Éviter les recalculs de style forcés",
      code: "• Réduisez les lectures/écritures DOM entrelacées dans vos scripts.",
    },
    {
      label: "Éviter les recalculs de style forcés",
      code: "• Regroupez les modifications DOM hors du flux de rendu (requestAnimationFrame).",
    },
  ],
  "lcp-discovery-insight": [
    {
      label: "Optimiser la découverte de la ressource LCP",
      code: '• Prélouez l’URL de l’image LCP avec `<link rel="preload" as="image" href="...">`.',
    },
    {
      label: "Optimiser la découverte de la ressource LCP",
      code: "• Placez l’élément LCP tôt dans le DOM pour accélérer sa détection.",
    },
  ],
  "legacy-javascript-insight": [
    {
      label: "Moderniser le JavaScript legacy",
      code: "• Identifiez les bundles legacy et convertissez-les en modules ES.",
    },
    {
      label: "Moderniser le JavaScript legacy",
      code: "• Supprimez les polyfills superflus pour les navigateurs modernes.",
    },
  ],
  "total-blocking-time": [
    {
      label: "Réduire le Total Blocking Time (TBT)",
      code: "• Analysez les tâches longues (>50 ms) avec Chrome DevTools Performance.",
    },
    {
      label: "Réduire le Total Blocking Time (TBT)",
      code: "• Fractionnez les gros scripts en plus petites unités (code splitting).",
    },
    {
      label: "Réduire le Total Blocking Time (TBT)",
      code: "• Reportez les scripts non critiques avec async/defer.",
    },
    {
      label: "Réduire le Total Blocking Time (TBT)",
      code: "• Déléguez le calcul intensif à un Web Worker.",
    },
  ],
  "errors-in-console": [
    {
      label: "Corriger les erreurs dans la console",
      code: "• Passez en revue et supprimez toutes les erreurs JavaScript à l’aide de la console.",
    },
    {
      label: "Corriger les erreurs dans la console",
      code: "• Ajoutez des gestionnaires d’erreur (try/catch ou window.onerror) pour capturer les exceptions.",
    },
    {
      label: "Corriger les erreurs dans la console",
      code: "• Testez vos modules avec des tests unitaires pour éviter les erreurs runtime.",
    },
  ],
  "mainthread-work-breakdown": [
    {
      label: "Minimiser le travail sur le thread principal",
      code: "• Mesurez la répartition du travail via l’onglet « Main » de DevTools Performance.",
    },
    {
      label: "Minimiser le travail sur le thread principal",
      code: "• Déplacez les tâches lourdes dans des Web Workers.",
    },
    {
      label: "Minimiser le travail sur le thread principal",
      code: "• Réduisez les manipulations DOM coûteuses (batch DOM updates).",
    },
  ],
  "bootup-time": [
    {
      label: "Réduire le temps d’exécution JavaScript au démarrage",
      code: "• Découpez votre bundle initial et réduisez sa taille.",
    },
    {
      label: "Réduire le temps d’exécution JavaScript au démarrage",
      code: "• Utilisez l’attribut defer pour différer l’exécution des scripts non essentiels.",
    },
    {
      label: "Réduire le temps d’exécution JavaScript au démarrage",
      code: "• Activez la mise en cache HTTP pour les scripts critiques.",
    },
  ],
  "third-party-summary": [
    {
      label: "Réduire l’impact du code tiers",
      code: "• Auditez les scripts tiers et supprimez ceux inutilisés.",
    },
    {
      label: "Réduire l’impact du code tiers",
      code: "• Chargez les widgets tiers (analytics, chat) de façon asynchrone.",
    },
    {
      label: "Réduire l’impact du code tiers",
      code: "• Utilisez un proxy ou un CDN pour héberger localement les scripts tiers.",
    },
  ],
  "valid-source-maps": [
    {
      label: "Fournir des source maps pour le JS important",
      code: "• Générez et déployez des fichiers .map lors de la compilation (webpack devtool).",
    },
    {
      label: "Fournir des source maps pour le JS important",
      code: "• Assurez-vous que l’en-tête SourceMap pointe vers l’URL correcte.",
    },
  ],
  "aria-input-field-name": [
    {
      label: "Ajouter un nom accessible aux champs de saisie ARIA",
      code: "• Associez un <label> explicite à chaque input ou utilisez aria-label.",
    },
    {
      label: "Ajouter un nom accessible aux champs de saisie ARIA",
      code: "• Vérifiez la présence d’aria-labelledby ou aria-describedby si nécessaire.",
    },
  ],
  "aria-required-children": [
    {
      label: "Ajouter les enfants ARIA requis",
      code: '• Vérifiez que chaque élément avec un rôle ARIA inclut tous les enfants obligatoires (ex. role="list" doit contenir des éléments role="listitem").',
    },
    {
      label: "Ajouter les enfants ARIA requis",
      code: '• Pour les structures complexes (ex. role="tablist"), assurez-vous que les enfants role="tab" et role="tabpanel" sont présents.',
    },
    {
      label: "Ajouter les enfants ARIA requis",
      code: "• Utilisez aria-owns si vous devez référencer dynamiquement des enfants hors du flux DOM.",
    },
    {
      label: "Ajouter les enfants ARIA requis",
      code: "• Validez votre implémentation avec un outil d’audit (axe, Lighthouse) pour détecter les manquants.",
    },
  ],
  "label-content-name-mismatch": [
    {
      label: "Corriger le nom accessible versus le label visible",
      code: "• Assurez-vous que le texte visible d’un élément correspond exactement à son nom accessible (aria-label ou aria-labelledby).",
    },
    {
      label: "Corriger le nom accessible versus le label visible",
      code: "• Pour les boutons et liens, utilisez aria-label ou aria-labelledby identique au contenu textuel.",
    },
    {
      label: "Corriger le nom accessible versus le label visible",
      code: "• Évitez les noms accessibles vides ou génériques (ex. “Cliquez ici”).",
    },
    {
      label: "Corriger le nom accessible versus le label visible",
      code: "• Testez avec un lecteur d’écran pour confirmer l’alignement entre rendu visuel et nom.",
    },
  ],
  "uses-http2": [
    {
      label: "Activer HTTP/2 sur le serveur",
      code: "• Configurez votre serveur (Apache, Nginx) pour prendre en charge HTTP/2.",
    },
    {
      label: "Activer HTTP/2 sur le serveur",
      code: "• Bénéficiez du multiplexing pour réduire le nombre de connexions TCP.",
    },
    {
      label: "Activer HTTP/2 sur le serveur",
      code: "• Vérifiez le protocole via `curl -I --http2 <URL>` ou en inspectant l’en-tête Alt-Svc.",
    },
    {
      label: "Activer HTTP/2 sur le serveur",
      code: "• Désactivez les anciens protocoles (SPDY) pour éviter les chutes de version.",
    },
  ],
  "dom-size-insight": [
    {
      label: "Optimiser la taille du DOM",
      code: "• Limitez le nombre total de nœuds DOM (idéalement <1500) pour améliorer la performance.",
    },
    {
      label: "Optimiser la taille du DOM",
      code: "• Supprimez les wrappers inutiles et simplifiez la hiérarchie.",
    },
    {
      label: "Optimiser la taille du DOM",
      code: "• Chargez dynamiquement les sections lourdes (lazy-loading, virtualization) pour les listes longues.",
    },
    {
      label: "Optimiser la taille du DOM",
      code: "• Auditez la profondeur et la largeur du DOM via DevTools pour repérer les anomalies.",
    },
  ],
  "modern-http-insight": [
    {
      label: "Adopter les pratiques HTTP modernes",
      code: "• Préludez les ressources critiques avec preload, prefetch et preconnect.",
    },
    {
      label: "Adopter les pratiques HTTP modernes",
      code: "• Activez la compression Brotli ou gzip côté serveur.",
    },
    {
      label: "Adopter les pratiques HTTP modernes",
      code: "• Configurez des en-têtes Cache-Control et ETag pour optimiser la mise en cache.",
    },
    {
      label: "Adopter les pratiques HTTP modernes",
      code: "• Envisagez une migration vers HTTP/3 (QUIC) pour réduire la latence.",
    },
  ],
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

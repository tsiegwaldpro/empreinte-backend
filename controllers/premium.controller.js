import {
  scrapeAndGroupSitemap,
  findSitemapUrl,
} from "../utils/sitemapGrouper.js";

import {
  crawlSiteByDepth,
  pickTopGroups,
  pickOneUrlPerGroup,
} from "../utils/crawlerByDepth.js";

/**
 * Analyse un sitemap et groupe les URLs
 */
export async function handleSitemap(req, res) {
  try {
    const { siteUrl } = req.body;

    if (!siteUrl) {
      return res.status(400).json({ error: "siteUrl requis" });
    }

    const sitemapUrl = await findSitemapUrl(siteUrl);
    const grouped = await scrapeAndGroupSitemap(sitemapUrl);

    res.status(200).json({ sitemapUrl, grouped });
  } catch (err) {
    console.error("Erreur analyse sitemap:", err.message);
    res.status(500).json({ error: "Impossible de traiter le sitemap." });
  }
}

/**
 * Version alternative si jamais tu veux conserver une variante
 */
export async function handleSitemapGrouped(req, res) {
  try {
    const { siteUrl } = req.body;

    if (!siteUrl) {
      return res.status(400).json({ error: "siteUrl requis" });
    }

    const sitemapUrl = await findSitemapUrl(siteUrl);
    const grouped = await scrapeAndGroupSitemap(sitemapUrl);

    res.status(200).json({ sitemapUrl, grouped });
  } catch (err) {
    console.error("Erreur analyse sitemap:", err.message);
    res.status(500).json({ error: "Impossible de traiter le sitemap." });
  }
}

/**
 * Crawler par profondeur + 1 URL par groupe (méthode de base)
 */
export async function handleCrawl(req, res) {
  try {
    const { siteUrl } = req.body;

    if (!siteUrl) {
      return res.status(400).json({ error: "siteUrl requis" });
    }

    const grouped = await crawlSiteByDepth(siteUrl);
    const selection = pickOneUrlPerGroup(grouped);

    res.status(200).json({ grouped, selection });
  } catch (err) {
    console.error("Erreur crawl:", err.message);
    res.status(500).json({ error: "Impossible de crawler le site." });
  }
}

/**
 * Crawler par profondeur + TOP X groupes les plus denses
 */
export async function handleCrawlTopGroups(req, res) {
  try {
    const { siteUrl, limit = 5 } = req.body;

    if (!siteUrl) {
      return res.status(400).json({ error: "siteUrl requis" });
    }

    const grouped = await crawlSiteByDepth(siteUrl);
    const selection = pickTopGroups(grouped, limit);

    res.status(200).json({ grouped, selection });
  } catch (err) {
    console.error("Erreur crawl top groups:", err.message);
    res.status(500).json({ error: "Impossible de crawler le site." });
  }
}

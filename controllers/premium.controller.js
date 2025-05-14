import {
  scrapeAndGroupSitemap,
  findSitemapUrl,
} from "../utils/sitemapGrouper.js";

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

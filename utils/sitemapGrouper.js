import axios from "axios";
import { parseStringPromise } from "xml2js";

const HEADERS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  },
};

const MAX_GROUPS = 15;
const MAX_TOTAL_URLS = 1000;
const MAX_URLS_PER_GROUP = 10;

export async function findSitemapUrl(baseUrl) {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).href;
    const res = await axios.get(robotsUrl, HEADERS);
    const match = res.data.match(/Sitemap:\s*(.*)/i);
    if (match) return match[1].trim();
  } catch {}

  const candidates = ["/sitemap.xml", "/sitemap_index.xml", "/wp-sitemap.xml"];
  for (const path of candidates) {
    try {
      const testUrl = new URL(path, baseUrl).href;
      const res = await axios.head(testUrl, HEADERS);
      if (res.status === 200) return testUrl;
    } catch {}
  }

  throw new Error("Aucun sitemap détecté");
}

export async function extractUrlsFromSitemap(sitemapUrl) {
  const res = await axios.get(sitemapUrl, HEADERS);
  const result = await parseStringPromise(res.data);

  if (result.urlset && result.urlset.url) {
    return result.urlset.url.map((u) => u.loc[0]);
  }

  if (result.sitemapindex && result.sitemapindex.sitemap) {
    const nestedSitemaps = result.sitemapindex.sitemap.map((s) => s.loc[0]);
    const allGroups = {};
    let total = 0;

    for (const sub of nestedSitemaps) {
      if (
        total >= MAX_TOTAL_URLS ||
        Object.keys(allGroups).length >= MAX_GROUPS
      )
        break;
      try {
        const subRes = await axios.get(sub, HEADERS);
        const subResult = await parseStringPromise(subRes.data);
        if (subResult.urlset && subResult.urlset.url) {
          const urls = subResult.urlset.url.map((u) => u.loc[0]);
          total += urls.length;
          groupUrls(urls, allGroups);
        }
      } catch {
        // ignore
      }
    }

    return flattenGroups(allGroups);
  }

  throw new Error("Format de sitemap non pris en charge.");
}

function cleanUrls(urls) {
  const unique = new Set();
  const clean = urls.filter((url) => {
    try {
      const u = new URL(url);
      if (u.pathname.match(/\.(jpg|jpeg|png|webp|pdf|css|js)$/)) return false;
      if (u.search && u.search.includes("utm")) return false;
      unique.add(u.origin + u.pathname);
      return true;
    } catch {
      return false;
    }
  });
  return Array.from(unique);
}

function getUrlGroupKey(url) {
  const path = new URL(url).pathname;

  if (/\/bint\d+\/?$/.test(path)) return "marque";
  if (/\/fiche\//.test(path)) return "fiche-produit";
  if (/\/blog\//.test(path)) return "blog";
  if (path === "/") return "home";

  const segments = path.split("/").filter(Boolean);
  return segments[0] || "autre";
}

function groupUrls(urls, groups = {}) {
  const cleaned = cleanUrls(urls);
  for (const url of cleaned) {
    const key = getUrlGroupKey(url);
    if (!groups[key]) groups[key] = [];
    if (groups[key].length < MAX_URLS_PER_GROUP) {
      groups[key].push(url);
    }
  }
  return groups;
}

function flattenGroups(groups) {
  const limited = {};
  for (const [key, urls] of Object.entries(groups)) {
    limited[key] = urls.slice(0, MAX_URLS_PER_GROUP);
  }
  return limited;
}

export async function scrapeAndGroupSitemap(sitemapUrl) {
  const urlsOrGroups = await extractUrlsFromSitemap(sitemapUrl);
  if (!Array.isArray(urlsOrGroups)) return urlsOrGroups;
  const grouped = groupUrls(urlsOrGroups);
  return flattenGroups(grouped);
}

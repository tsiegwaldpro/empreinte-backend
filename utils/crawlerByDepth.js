// 📁 utils/crawlerByDepth.js

import axios from "axios";
import * as cheerio from "cheerio";
import { crawlWithBrowser } from "./crawlWithBrowser.js";

const HEADERS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  },
};

const MAX_DEPTH = 2; // Home + 1 clic
const MAX_URLS_PER_TYPE = 1;
const MAX_PAGES = 30;

function cleanUrl(base, href) {
  try {
    const url = new URL(href, base);
    if (url.origin !== new URL(base).origin) return null;
    if (url.pathname.match(/\.(jpg|jpeg|png|webp|pdf|css|js)$/)) return null;
    return url.origin + url.pathname;
  } catch {
    return null;
  }
}

function getGroupKey(path) {
  if (path === "/") return "home";
  if (/\/fiche\//.test(path)) return "fiche-produit";
  if (/\/blog\//.test(path)) return "blog";
  if (/\/bint\d+\/?$/.test(path)) return "fiche-marque";
  if (/\/product\//.test(path)) return "fiche-produit";
  if (/\/brand\//.test(path)) return "fiche-marque";
  if (/\.(html|htm)$/.test(path)) return "page-html";

  const segments = path.split("/").filter(Boolean);
  return segments[0] || "autre";
}

async function extractLinks(url) {
  try {
    console.log(`🔍 Extraction des liens depuis ${url}`);
    const res = await axios.get(url, HEADERS);
    const $ = cheerio.load(res.data);
    const links = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const clean = cleanUrl(url, href);
      if (clean) links.push(clean);
    });
    console.log(`✅ ${links.length} liens trouvés sur ${url}`);
    return Array.from(new Set(links));
  } catch (err) {
    console.warn(`⚠️ Erreur d'extraction sur ${url}: ${err.message}`);
    return [];
  }
}

function addToGroups(groups, url) {
  const path = new URL(url).pathname;
  const key = getGroupKey(path);
  if (!groups[key]) groups[key] = [];
  if (groups[key].length < MAX_URLS_PER_TYPE) {
    groups[key].push(url);
    console.log(`✅ Ajout de ${url} au groupe '${key}'`);
  }
}

export async function crawlSiteByDepth(baseUrl) {
  console.log(`🚀 Démarrage du crawl sur ${baseUrl}`);
  const visited = new Set();
  const queue = [{ url: baseUrl, depth: 0 }];
  const groups = {};

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const { url, depth } = queue.shift();
    if (visited.has(url) || depth > MAX_DEPTH) continue;
    visited.add(url);

    console.log(`➡️ Visite de ${url} (profondeur ${depth})`);
    const links = await extractLinks(url);
    for (const link of links) {
      addToGroups(groups, link);
      if (!visited.has(link)) {
        queue.push({ url: link, depth: depth + 1 });
      }
    }
  }

  if (Object.keys(groups).length === 0) {
    console.log(
      "⚠️ Aucun lien trouvé avec Cheerio, fallback vers Puppeteer..."
    );
    const puppeteerLinks = await crawlWithBrowser(baseUrl);
    for (const link of puppeteerLinks) {
      addToGroups(groups, link);
    }
  }

  console.log("🏁 Crawl terminé. Groupes trouvés:", Object.keys(groups));
  return groups;
}

export function pickOneUrlPerGroup(grouped) {
  return Object.entries(grouped).map(([group, urls]) => ({
    group,
    url: urls[0],
  }));
}

export function pickTopGroups(grouped, limit = 5) {
  return Object.entries(grouped)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, limit)
    .map(([group, urls]) => ({
      group,
      url: urls[0],
    }));
}

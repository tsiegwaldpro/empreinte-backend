import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

export default async function auditWithLighthouse(url) {
  const chrome = await launch({ chromeFlags: ["--headless"] });

  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  const report = runnerResult.lhr;

  // 🔎 Construction des maps : catégorie et poids
  const auditCategoryMap = {};
  const auditWeightMap = {};
  for (const [key, category] of Object.entries(report.categories)) {
    for (const auditRef of category.auditRefs) {
      auditCategoryMap[auditRef.id] = category.title;
      auditWeightMap[auditRef.id] = auditRef.weight || 0;
    }
  }

  // 🔧 Liste des recommandations enrichie
  const failingAudits = Object.values(report.audits)
    .filter((a) => a.score !== null && a.score < 0.9)
    .map((a) => {
      const weight = auditWeightMap[a.id] || 0;
      const rawImpact = (1 - a.score) * weight;
      const impact = Math.min(Math.round(rawImpact * 20), 100); // normalisé sur 100

      let impactLevel = "🟢";
      if (rawImpact > 0.8) impactLevel = "💥";
      else if (rawImpact > 0.4) impactLevel = "⚠️";

      return {
        id: a.id,
        title: a.title,
        score: a.score,
        description: a.description,
        displayValue: a.displayValue,
        group: auditCategoryMap[a.id] || "Autres",
        weight,
        impactLevel,
        impact,
      };
    });

  // 📊 Données pour calcul de l'empreinte
  const totalBytes = report.audits["total-byte-weight"].numericValue || 0;
  const domNodes = report.audits["dom-size"].numericValue || 0;
  const requests =
    report.audits["network-requests"].details?.items?.length || 0;

  const ecoIndex =
    100 -
    5 * (requests / 100) -
    3 * (totalBytes / 1024 / 1000) -
    2 * (domNodes / 1000);

  const ges = 2 + (3 * (100 - ecoIndex)) / 100;
  const energy = 0.8 + (1.5 * (100 - ecoIndex)) / 100;
  const water = 1 + (2 * (100 - ecoIndex)) / 100;

  await chrome.kill();

  return {
    url: report.finalUrl,
    performance: Math.round(report.categories.performance.score * 100),
    accessibility: Math.round(report.categories.accessibility.score * 100),
    bestPractices: Math.round(report.categories["best-practices"].score * 100),
    seo: Math.round(report.categories.seo.score * 100),
    totalByteWeight: report.audits["total-byte-weight"].displayValue,
    domSize: report.audits["dom-size"].displayValue,
    requests,
    recommandations: failingAudits,
    empreinte: {
      ecoIndex: parseFloat(ecoIndex.toFixed(2)),
      gesPerVisit: `${ges.toFixed(2)} gCO2e`,
      energyPerVisit: `${energy.toFixed(2)} Wh`,
      waterPerVisit: `${water.toFixed(2)} cl`,
      ges100Visits: `${((ges * 100) / 1000).toFixed(2)} kgCO2e`,
      water100Visits: `${((water * 100) / 100).toFixed(2)} L`,
    },
  };
}

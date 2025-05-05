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

  const failingAudits = Object.values(report.audits)
    .filter((a) => a.score !== null && a.score < 0.9)
    .map((a) => ({
      id: a.id,
      title: a.title,
      score: a.score,
      description: a.description,
      displayValue: a.displayValue,
    }));

  // 🔧 Données pour les calculs d'empreinte
  const totalBytes = report.audits["total-byte-weight"].numericValue || 0;
  const domNodes = report.audits["dom-size"].numericValue || 0;
  const requests =
    report.audits["network-requests"].details?.items?.length || 0;

  const ecoIndex =
    100 -
    5 * (requests / 100) -
    3 * (totalBytes / 1024 / 1000) -
    2 * (domNodes / 1000);
  const ges = 2 + (3 * (100 - ecoIndex)) / 100; // gCO2e
  const energy = 0.8 + (1.5 * (100 - ecoIndex)) / 100; // Wh
  const water = 1 + (2 * (100 - ecoIndex)) / 100; // cl

  await chrome.kill();

  return {
    url: report.finalUrl,
    performance: Math.round(report.categories.performance.score * 100),
    accessibility: Math.round(report.categories.accessibility.score * 100),
    bestPractices: Math.round(report.categories["best-practices"].score * 100),
    seo: Math.round(report.categories.seo.score * 100),
    totalByteWeight: report.audits["total-byte-weight"].displayValue,
    domSize: report.audits["dom-size"].displayValue,
    requests: requests,
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

// backend/services/auditService.js

import puppeteer from "puppeteer";

export async function auditWithPuppeteer(url) {
  console.log("📡 Lancement de l'audit sur :", url);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const title = await page.title();
  const performance = Math.floor(Math.random() * 21) + 80; // score 80-100
  const accessibility = Math.floor(Math.random() * 21) + 75;
  const bestPractices = Math.floor(Math.random() * 21) + 70;
  const seo = Math.floor(Math.random() * 21) + 85;

  await browser.close();

  return {
    performance,
    accessibility,
    bestPractices,
    seo,
    totalByteWeight: "1.2 MB",
    domSize: "900 nodes",
    requests: 45,
    recommandations: [
      {
        id: "title-check",
        group: "accessibility",
        title: "La balise <title> est à optimiser",
        description: `Le titre actuel est : \"${title}\"`,
        impact: 1, // <- Numérique pour compatibilité
        impactLevel: "low", // <- Chaîne pour affichage
        displayValue: title,
        actions: [
          {
            label: "Réécrire un titre plus descriptif",
            code: "document.title = 'Titre Amélioré';",
          },
        ],
      },
    ],
    empreinte: {
      ecoIndex: 75,
      gesPerVisit: "1.45 g",
      energyPerVisit: "0.9 Wh",
      waterPerVisit: "0.6 cl",
      ges100Visits: "145 g",
      water100Visits: "60 cl",
    },
    createdAt: new Date(),
  };
}

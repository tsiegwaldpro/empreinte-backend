import puppeteer from "puppeteer";

export async function auditWithPuppeteer(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const title = await page.title();

  await browser.close();

  return {
    recommandations: [
      {
        category: "accessibility",
        message: "La balise <title> est : " + title,
        impact: "low",
        score: 90,
      },
    ],
    performance: 90,
    accessibility: 90,
    bestPractices: 90,
    seo: 90,
    empreinte: 1.2,
    createdAt: new Date(),
  };
}

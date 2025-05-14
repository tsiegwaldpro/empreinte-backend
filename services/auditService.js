// backend/services/auditService.js
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { URL } from "url";

export async function runAudit(urlToTest) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const endpoint = new URL(browser.wsEndpoint());

  const result = await lighthouse(urlToTest, {
    port: endpoint.port,
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    logLevel: "info",
  });

  await browser.close();

  return result.lhr;
}

import puppeteer from "puppeteer";

export async function crawlWithBrowser(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

  const links = await page.$$eval("a", (as) =>
    as.map((a) => a.href).filter((href) => href.startsWith("http"))
  );

  await browser.close();
  return [...new Set(links)];
}

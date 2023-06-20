import puppeteer from "puppeteer";
const AMAZON_URL = "https://www.amazon.in";

export async function searchAmazon(searchQuery) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(AMAZON_URL);

  await page.type("#twotabsearchtextbox", searchQuery);
  await page.click('input.nav-input[type="submit"]');

  await page.waitForSelector('[data-component-type="s-search-result"]');

  const searchResults = await page.$$eval(
    '[data-component-type="s-search-result"]',
    (resuts) => {
      return resuts.map((result) => {
        const titleElement = result.querySelector("h2 a");
        const priceElement = result.querySelector(".a-price-whole");
        const linkElement = result.querySelector("h2 a");

        return {
          title: titleElement ? titleElement.textContent : "",
          price: priceElement ? priceElement.textContent : "",
          link: linkElement ? linkElement.href : "",
        };
      });
    },
  );

  console.log(searchResults);

  await browser.close();
}

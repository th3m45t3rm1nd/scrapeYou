import puppeteer from "puppeteer";

const FLIPKART_URL = "https://www.flipkart.com";

export async function searchFlipkart(searchQuery) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(FLIPKART_URL);

  await page.click("button._2KpZ6l._2doB4z");

  await page.type('input[type="text"][name="q"]', searchQuery);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.keyboard.press("Enter"),
  ]);

  await page.waitForSelector("div._1AtVbE");
  await page.screenshot({ path: "example.png" });

  const searchResults = await page.$$eval("div._1AtVbE", (resuts) => {
    return resuts.map((result) => {
      const titleElement = result.querySelector("div._4rR01T");
      console.log(titleElement);
      const priceElement = result.querySelector("div._30jeq3");
      const linkElement = result.querySelector('a[rel="noopener noreferrer"]');

      return {
        title: titleElement ? titleElement.textContent : "",
        price: priceElement ? priceElement.textContent : "",
        link: linkElement ? linkElement.href : "",
      };
    });
  });

  console.log(searchResults);

  await browser.close();
}

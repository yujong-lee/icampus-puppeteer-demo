const puppeteer = require("puppeteer");
const {id, password } = require('args-parser')(process.argv);

const baseUrl = "https://canvas.skku.edu";
const firstCardCover = "#DashboardCard_Container > div > div:nth-child(1) > div > div.ic-DashboardCard__header_hero";

const visit = async (browser, url, i) => {
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: `screenshots/${i}.png`});
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(baseUrl);
  
  await page.waitForSelector("#userid");
  await page.waitForSelector("#password");
  await page.type("#userid", id);
	await page.type("#password", password);
  await page.click("#btnLogin")

  await page.waitForSelector(firstCardCover);

  const classes = await page.evaluate(() => {
    const cards = Array.from(document.querySelector("#DashboardCard_Container > div").children);
    
    return cards.map((card) => {
      const title = card.querySelector("div > a > div > h3 > span")?.textContent;
      const url = card.querySelector("div > a")?.getAttribute("href");

      return { title, url};
    })
  })

  await Promise.all(
    classes.map(({ url }, i) => visit(browser, `${baseUrl}${url}/external_tools/5`, i))
  );

  await browser.close();
})();

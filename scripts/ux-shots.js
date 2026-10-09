// Before/after screenshots + visible-text count (mobile 390 and desktop 1440) of the main pages.
// Run with the Playwright MCP `browser_run_code_unsafe` (filename: scripts/ux-shots.js) while
// `npm run build && npm run preview` serves the site on port 4173. Change DIR for "before" / "after".
async (page) => {
  const BASE = "http://localhost:4173/the-cycle-space-site";
  const DIR = "docs/audit/ux-after";
  const pages = [["home", "/"], ["services", "/services/"], ["about", "/about/"], ["fr-home", "/fr/"]];
  const viewports = [[390, 844], [1440, 900]];
  const out = {};
  for (const [w, h] of viewports) {
    await page.setViewportSize({ width: w, height: h });
    for (const [name, route] of pages) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        for (let y = 0; y < document.body.scrollHeight; y += 300) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });
      const stats = await page.evaluate(() => {
        const main = document.querySelector("main");
        const text = main.innerText.replace(/\s+/g, " ").trim();
        const mainWords = text.split(" ").length;
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        const footerWords = footer ? footer.innerText.replace(/\s+/g, " ").trim().split(" ").length : 0;
        return { words: mainWords - footerWords, height: document.documentElement.scrollHeight, imgs: document.querySelectorAll("main img").length };
      });
      out[`${w} ${name}`] = stats;
      await page.screenshot({ path: `${DIR}/${w}-${name}.jpg`, type: "jpeg", quality: 72, fullPage: true });
    }
  }
  return out;
}

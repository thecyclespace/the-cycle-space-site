// Reproducible mobile audit. Run with the Playwright MCP `browser_run_code_unsafe`
// (filename: scripts/mobile-audit.js) while `npm run build && npm run preview` is running (port 4173),
// or adapt `async (page) => ...` to any Playwright runner.
// Output: horizontal overflow, undersized tap targets, console errors per route/viewport.
// Set SHOTS to a folder name (inside the repo) to also save screenshots.
async (page) => {
  const BASE = "http://localhost:4173/the-cycle-space-site";
  const SHOTS = "docs/audit/after";
  const routes = ["/", "/services/", "/blog/", "/about/", "/blog/period-calculator/", "/blog/basal-temperature-tracker/"]; // trailing slash = how GitHub Pages serves prerendered folders
  const viewports = [
    [320, 568], [360, 800], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900],
  ];
  const shotWidths = new Set([390, 1440]);
  const report = [];
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  for (const [w, h] of viewports) {
    await page.setViewportSize({ width: w, height: h });
    for (const route of routes) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      // reveal scroll animations
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const overflow = document.documentElement.scrollWidth - vw;
        const wide = [];
        document.querySelectorAll("body *").forEach((el) => {
          const b = el.getBoundingClientRect();
          if (b.width > 0 && (b.right > vw + 1 || b.left < -1)) {
            const cs = getComputedStyle(el);
            if (cs.position !== "fixed" && !el.closest("svg") && wide.length < 4)
              wide.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} r=${Math.round(b.right)}`);
          }
        });
        const small = [];
        document.querySelectorAll("a, button, input, select, textarea, summary").forEach((el) => {
          const b = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (b.width === 0 || cs.visibility === "hidden" || cs.display === "none") return;
          if (el.type === "hidden") return;
          if (b.height < 44 || b.width < 44) small.push(`${el.tagName.toLowerCase()}:${(el.innerText || el.getAttribute("aria-label") || el.type || "").trim().slice(0, 24)} ${Math.round(b.width)}x${Math.round(b.height)}`);
        });
        const header = document.querySelector("header");
        return { overflow, wide, smallCount: small.length, small: small.slice(0, 6), headerH: header ? Math.round(header.getBoundingClientRect().height) : 0, docH: document.documentElement.scrollHeight };
      });
      report.push({ vp: `${w}x${h}`, route, ...r });
      if (SHOTS && shotWidths.has(w) && ["/", "/services/"].includes(route)) {
        await page.screenshot({ path: `${SHOTS}/${w}${route === "/" ? "-home" : "-services"}.png`, fullPage: true });
      }
    }
  }
  const bad = report.filter((x) => x.overflow > 0);
  return {
    overflowFailures: bad.map((x) => `${x.vp} ${x.route} +${x.overflow}px ${x.wide.join(" | ")}`),
    tapTargetsBelow44: report.filter((x) => x.vp.startsWith("390")).map((x) => `${x.route}: ${x.smallCount} ${x.small.join("; ")}`),
    header390: report.filter((x) => x.vp.startsWith("390"))[0]?.headerH,
    consoleErrors: [...new Set(errors)].slice(0, 10),
  };
}

// After `npm run build`: checks that every page of the build shows the same text and the same title,
// description, canonical and hreflang as the site currently online. Use it before merging a change that
// is not supposed to alter the public site:  node scripts/compare-with-live.mjs
import fs from "node:fs";
const B = "https://thecyclespace.github.io/the-cycle-space-site";
const sm = fs.readFileSync("dist/sitemap.xml", "utf8");
const urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))];
const norm = (html) => {
  const root = html.slice(html.indexOf('<div id="root">'));
  return root.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, "\n").replace(/&[a-z#0-9]+;/g, " ").split("\n").map((s) => s.trim()).filter(Boolean).join("\n");
};
const attrs = (html) => [...html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)].map((m) => m[1]).filter((u) => !/assets\/|fonts\//.test(u)).sort().join("\n");
let same = 0;
for (const url of urls) {
  const rel = url.replace(B, "").replace(/^\//, "");
  const local = fs.readFileSync(`dist/${rel}${rel && !rel.endsWith("/") ? "/" : ""}index.html`, "utf8");
  const live = await (await fetch(url + (url.endsWith("/") ? "" : "/"))).text();
  const t = norm(local) === norm(live);
  const head = (h) => (h.match(/<title>[^<]*<\/title>/) || [""])[0] + (h.match(/<meta name="description"[^>]*>/) || [""])[0] + [...h.matchAll(/<link rel="(?:canonical|alternate)"[^>]*>/g)].map((m) => m[0]).join("");
  const h = head(local) === head(live);
  if (t && h) same++;
  else {
    console.log("DIFF", rel || "/", "text:", t, "head:", h);
    if (!t) { const a = norm(live).split("\n"), b = norm(local).split("\n"); for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) { console.log("  live :", a[i]); console.log("  local:", b[i]); break; } }
  }
  if (rel === "") { const a = new Set(attrs(live).split("\n")), b = new Set(attrs(local).split("\n")); console.log("home attrs only live:", [...a].filter((x) => !b.has(x)).slice(0, 8)); console.log("home attrs only local:", [...b].filter((x) => !a.has(x)).slice(0, 8)); }
}
console.log(`${same}/${urls.length} pages: same visible text and same title/description/canonical/hreflang as the live site`);

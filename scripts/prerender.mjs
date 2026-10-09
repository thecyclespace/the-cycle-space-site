// Static prerender, run after `vite build` and `vite build --ssr` (see package.json "build").
// For each route (English at the root, French under /fr) it writes dist/<route>/index.html with the
// real <head> (title, description, canonical, hreflang, Open Graph, JSON-LD) and the rendered page
// inside <div id="root">. The browser then hydrates it. Unknown URLs keep the SPA fallback 404.html.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssrEntry = path.resolve("dist-ssr/entry-server.js");
const { render, getRoutes, getRedirects, BASE } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function setTag(html, regex, replacement) {
  if (!regex.test(html)) throw new Error(`template tag not found: ${regex}`);
  return html.replace(regex, replacement);
}

function page({ path: route, meta, ld, lang }) {
  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = setTag(html, /<meta\s+name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}" />`);
  html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(meta.url)}" />`);
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(meta.ogTitle)}" />`);
  html = setTag(html, /<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(meta.ogDescription)}" />`);
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(meta.url)}" />`);
  html = setTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(meta.image)}" />`);
  html = setTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(meta.ogTitle)}" />`);
  html = setTag(html, /<meta\s+name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(meta.ogDescription)}" />`);
  html = setTag(html, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(meta.image)}" />`);
  html = setTag(html, /<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${lang === "fr" ? "fr_FR" : "en_US"}" />`);
  html = setTag(html, /<meta property="og:locale:alternate" content="[^"]*" \/>/, `<meta property="og:locale:alternate" content="${lang === "fr" ? "en_US" : "fr_FR"}" />`);
  if (lang === "fr") html = html.replace('<html lang="en">', '<html lang="fr">');
  const alternates = (meta.alternates || [])
    .map((a) => `<link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}" />`)
    .join("\n    ");
  const ldTags = ld
    .map((d) => `<script type="application/ld+json" data-prerendered>${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`)
    .join("\n    ");
  const extra = [alternates, ldTags].filter(Boolean).join("\n    ");
  if (extra) html = html.replace("</head>", `    ${extra}\n  </head>`);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${render(route)}</div>`);
  return html;
}

function write(route, html) {
  const outDir = route === "/" ? dist : path.join(dist, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
}

let count = 0;
for (const route of getRoutes()) {
  write(route.path, page(route));
  count++;
}

// Redirect pages for URLs that existed before the /fr split (French articles under /blog/<slug>).
let redirects = 0;
for (const r of getRedirects()) {
  const target = `${BASE}${r.to.replace(/^\//, "")}/`;
  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Redirection…</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${esc(r.canonical)}" />
    <meta http-equiv="refresh" content="0; url=${esc(target)}" />
    <script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
  </head>
  <body><a href="${esc(target)}">${esc(r.canonical)}</a></body>
</html>
`;
  write(r.from, html);
  redirects++;
}

// 404.html is the SPA shell served (with HTTP 404) for unknown URLs: keep it out of search indexes.
const notFound = path.join(dist, "404.html");
if (fs.existsSync(notFound)) {
  let html = fs.readFileSync(notFound, "utf8");
  html = html.replace(/<link rel="canonical"[^>]*>\s*/, "");
  html = html.replace("</head>", '    <meta name="robots" content="noindex, follow" />\n  </head>');
  fs.writeFileSync(notFound, html);
}

console.log(`✓ prerendered ${count} routes + ${redirects} redirects`);

import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Génère dist/sitemap.xml : pages statiques et articles publiés, en anglais (racine) et en français (/fr),
// avec les alternates hreflang réciproques (xhtml:link). L'URL de base vient de VITE_SITE_URL (même
// variable que le canonical des pages). `lastmod` : uniquement pour les articles (date réelle du
// frontmatter), jamais la date du build. Les URLs ont un "/" final, comme les canonicals.
function sitemapPlugin() {
  const baseUrl = (process.env.VITE_SITE_URL || "https://thecyclespace.com").replace(/\/$/, "");
  const abs = (p) => `${baseUrl}${p === "/" ? "/" : `${p}/`}`;
  const fr = (p) => (p === "/" ? "/fr" : `/fr${p}`);
  return {
    name: "generate-sitemap",
    apply: "build",
    closeBundle() {
      try {
        if (!fs.existsSync(path.resolve("./dist"))) return; // SSR pass writes to dist-ssr only
        const entries = []; // { loc, lastmod?, alternates?: [{hreflang, href}] }
        for (const p of ["/", "/services", "/blog", "/about"]) {
          const alternates = [
            { hreflang: "en", href: abs(p) },
            { hreflang: "fr", href: abs(fr(p)) },
            { hreflang: "x-default", href: abs(p) },
          ];
          entries.push({ loc: abs(p), alternates }, { loc: abs(fr(p)), alternates });
        }
        // Articles
        const blogDir = path.resolve("./src/content/blog");
        const posts = [];
        if (fs.existsSync(blogDir)) {
          for (const f of fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
            const raw = fs.readFileSync(path.join(blogDir, f), "utf8");
            const fm = (raw.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/) || [, ""])[1];
            if (/^draft:\s*true\s*$/m.test(fm)) continue;
            const field = (k) => (fm.match(new RegExp(`^${k}:\\s*["']?([^"'\\r\\n]+?)["']?\\s*$`, "m")) || [])[1];
            posts.push({
              slug: f.replace(/\.md$/, ""),
              lang: field("lang") === "fr" ? "fr" : "en",
              translation: field("translation"),
              date: (field("date") || "").slice(0, 10),
            });
          }
        }
        const bySlug = new Map(posts.map((p) => [p.slug, p]));
        const urlOf = (p) => abs(p.lang === "fr" ? fr(`/blog/${p.slug}`) : `/blog/${p.slug}`);
        const translationOf = (p) => {
          const declared = p.translation && bySlug.get(p.translation);
          if (declared && declared.lang !== p.lang) return declared;
          return posts.find((o) => o.translation === p.slug && o.lang !== p.lang);
        };
        for (const p of posts) {
          const t = translationOf(p);
          const en = p.lang === "en" ? p : t;
          const frp = p.lang === "fr" ? p : t;
          const alternates = t
            ? [
                { hreflang: "en", href: urlOf(en) },
                { hreflang: "fr", href: urlOf(frp) },
                { hreflang: "x-default", href: urlOf(en) },
              ]
            : undefined;
          entries.push({ loc: urlOf(p), lastmod: p.date || undefined, alternates });
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}${(e.alternates || [])
        .map((a) => `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
        .join("")}\n  </url>`,
  )
  .join("\n")}
</urlset>
`;
        fs.writeFileSync(path.resolve("./dist/sitemap.xml"), xml);
        // eslint-disable-next-line no-console
        console.log(`✓ sitemap.xml generated (${entries.length} URLs)`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("sitemap generation failed:", e);
      }
    },
  };
}

// Copie dist/index.html -> dist/404.html après le build.
// GitHub Pages sert 404.html pour toute URL inconnue ; comme c'est le shell de
// l'app, React Router prend le relais et affiche la bonne route (fallback SPA).
function spaFallbackPlugin() {
  return {
    name: "github-pages-spa-fallback",
    apply: "build",
    closeBundle() {
      try {
        const index = path.resolve("./dist/index.html");
        if (fs.existsSync(index)) {
          fs.copyFileSync(index, path.resolve("./dist/404.html"));
          // eslint-disable-next-line no-console
          console.log("✓ 404.html generated (SPA fallback for GitHub Pages)");
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("404.html generation failed:", e);
      }
    },
  };
}

// `base` = sous-chemin GitHub Pages (https://thecyclespace.github.io/the-cycle-space-site/).
// Pour passer au domaine personnalisé thecyclespace.com : remettre `base: "/"` et recréer public/CNAME.
// Le routeur (App.jsx) et les images suivent cette valeur via import.meta.env.BASE_URL.
export default defineConfig({
  base: "/the-cycle-space-site/",
  plugins: [
    react(),
    sitemapPlugin(),
    spaFallbackPlugin(),
    // Sert public/admin/index.html quand on demande /admin ou /admin/ — sans cela
    // le SPA fallback Vite renverrait le shell React Router.
    // En prod GitHub Pages, /admin/ sert nativement /admin/index.html (index de dossier).
    {
      name: "serve-admin-index",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // The address carries the site base ("/the-cycle-space-site/admin") and sometimes a query.
          const [pathname, query = ""] = (req.url || "").split("?");
          const suffix = query ? `?${query}` : "";
          if (/^(\/the-cycle-space-site)?\/admin$/.test(pathname)) {
            // Without the final slash, the admin would look for its files one folder too high.
            res.statusCode = 302;
            res.setHeader("Location", `${pathname}/${suffix}`);
            return res.end();
          }
          if (/^(\/the-cycle-space-site)?\/admin\/$/.test(pathname)) req.url = `${pathname}index.html${suffix}`;
          next();
        });
      },
    },
  ],
  server: { port: 5173, host: true },
});

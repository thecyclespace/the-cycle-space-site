import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Génère dist/sitemap.xml : routes statiques + chaque article publié (hors brouillons).
// L'URL de base vient de VITE_SITE_URL (même variable que le canonical des pages).
// `lastmod` n'est renseigné que pour les articles (date réelle du frontmatter) : on ne
// déclare jamais la date du build comme date de modification d'une page inchangée.
// Les URLs ont un "/" final, comme les canonicals et les dossiers servis par GitHub Pages.
function sitemapPlugin() {
  const baseUrl = (process.env.VITE_SITE_URL || "https://thecyclespace.com").replace(/\/$/, "");
  return {
    name: "generate-sitemap",
    apply: "build",
    closeBundle() {
      try {
        if (!fs.existsSync(path.resolve("./dist"))) return; // SSR pass writes to dist-ssr only
        const entries = ["/", "/services", "/blog", "/about"].map((r) => ({ loc: r }));
        const blogDir = path.resolve("./src/content/blog");
        if (fs.existsSync(blogDir)) {
          for (const f of fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
            const raw = fs.readFileSync(path.join(blogDir, f), "utf8");
            const fm = (raw.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/) || [, ""])[1];
            if (/^draft:\s*true\s*$/m.test(fm)) continue;
            const date = (fm.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m) || [])[1];
            entries.push({ loc: `/blog/${f.replace(/\.md$/, "")}`, lastmod: date });
          }
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${baseUrl}${e.loc === "/" ? "/" : `${e.loc}/`}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}
  </url>`,
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
        server.middlewares.use((req, _res, next) => {
          if (req.url === "/admin" || req.url === "/admin/") {
            req.url = "/admin/index.html";
          }
          next();
        });
      },
    },
  ],
  server: { port: 5173, host: true },
});

import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Génère dist/sitemap.xml en listant les routes statiques + chaque .md du blog.
// Override de l'URL via VITE_SITE_URL (sinon défaut = thecyclespace.com).
function sitemapPlugin() {
  const baseUrl = (process.env.VITE_SITE_URL || "https://thecyclespace.com").replace(/\/$/, "");
  return {
    name: "generate-sitemap",
    apply: "build",
    closeBundle() {
      try {
        const staticRoutes = ["/", "/services", "/blog", "/about"];
        const blogDir = path.resolve("./src/content/blog");
        const blogRoutes = fs.existsSync(blogDir)
          ? fs.readdirSync(blogDir)
              .filter((f) => f.endsWith(".md"))
              .map((f) => `/blog/${f.replace(/\.md$/, "")}`)
          : [];
        const all = [...staticRoutes, ...blogRoutes];
        const today = new Date().toISOString().split("T")[0];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
        fs.writeFileSync(path.resolve("./dist/sitemap.xml"), xml);
        // eslint-disable-next-line no-console
        console.log(`✓ sitemap.xml generated (${all.length} URLs)`);
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

// `base` = "/" : le site est servi à la racine du domaine personnalisé thecyclespace.com.
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

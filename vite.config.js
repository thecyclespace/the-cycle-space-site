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

// `base: "/"` -> déploiement Netlify (racine du domaine).
// Pour réactiver GitHub Pages : remettre `base: "/the-cycle-space-site/"`.
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    sitemapPlugin(),
    // Sert public/admin/index.html quand on demande /admin ou /admin/ — sans cela
    // le SPA fallback Vite renverrait le shell React Router.
    // En prod Netlify, le directory-index est géré nativement par Netlify.
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

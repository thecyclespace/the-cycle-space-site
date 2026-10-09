// Build-time only (vite build --ssr). Used by scripts/prerender.mjs to write one
// static HTML file per route, so crawlers and no-JS visitors get real content.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { posts, getTranslation } from "./lib/blog";
import { buildMeta, absoluteAsset, postAlternates, canonicalUrl } from "./lib/seo";
import { personSchema, articleSchema, faqSchema } from "./lib/schemas";
import { localizedPath, postPath } from "./lib/paths";
import { describeImage } from "./components/Picture";
import images from "./content/settings/images.json";
import enCopy from "./content/i18n/en.json";
import frCopy from "./content/i18n/fr.json";

const pages = { Home, Services, About, BlogList, BlogPost, NotFound };
export const BASE = import.meta.env.BASE_URL; // e.g. "/the-cycle-space-site/" or "/"
const BASENAME = BASE.replace(/\/$/, "");
const copy = { en: enCopy, fr: frCopy };

export function render(path) {
  return renderToString(
    <StaticRouter location={`${BASENAME}${path}`} basename={BASENAME}>
      <AppRoutes pages={pages} />
    </StaticRouter>
  );
}

// Every indexable route, in both languages, with its <head> data and JSON-LD.
export function getRoutes() {
  const routes = [];
  for (const lang of ["en", "fr"]) {
    const statics = [
      { path: "/", pageKey: null, ld: [] },
      { path: "/services", pageKey: "services", ld: [faqSchema(copy[lang].faq)] },
      { path: "/blog", pageKey: "blog", ld: [] },
      { path: "/about", pageKey: "about", ld: [personSchema(lang)] },
    ];
    for (const r of statics) {
      const path = localizedPath(r.path, lang);
      const route = { path, lang, meta: buildMeta(lang, r.pageKey, {}, path), ld: r.ld.filter(Boolean) };
      // The hero picture is the largest element of the home page: tell the browser to fetch it early.
      if (r.path === "/" && images.heroImage) {
        const d = describeImage(images.heroImage);
        if (d.avif) route.preload = { type: "image/avif", srcset: d.avif, sizes: "(min-width: 768px) 46vw, 100vw" };
      }
      routes.push(route);
    }
  }
  for (const post of posts) {
    const path = postPath(post);
    routes.push({
      path,
      lang: post.lang,
      meta: buildMeta(
        post.lang,
        "blog",
        {
          title: `${post.title} — The Cycle Space`,
          description: post.excerpt,
          image: absoluteAsset(post.coverImage),
          alternates: postAlternates(post, getTranslation(post)),
        },
        path
      ),
      ld: [articleSchema(post)],
    });
  }
  return routes;
}

// Old links: before the /fr URLs existed, French articles were served at /blog/<slug>.
// Each gets a small redirect page (meta refresh + JS) pointing to the new URL.
export function getRedirects() {
  return posts
    .filter((p) => p.lang === "fr")
    .map((p) => ({ from: `/blog/${p.slug}`, to: postPath(p), canonical: canonicalUrl(postPath(p)) }));
}

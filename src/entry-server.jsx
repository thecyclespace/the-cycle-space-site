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
import { posts } from "./lib/blog";
import { buildMeta, absoluteAsset } from "./lib/seo";
import { personSchema, articleSchema, faqSchema } from "./lib/schemas";
import enCopy from "./content/i18n/en.json";

const pages = { Home, Services, About, BlogList, BlogPost, NotFound };
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "");

export function render(path) {
  return renderToString(
      <StaticRouter location={`${BASENAME}${path === "/" ? "/" : path}`} basename={BASENAME}>
        <AppRoutes pages={pages} />
      </StaticRouter>
  );
}

// Every indexable route with its <head> data and JSON-LD (English = default language of the site).
export function getRoutes() {
  const statics = [
    { path: "/", pageKey: null, ld: [] },
    { path: "/services", pageKey: "services", ld: [faqSchema(enCopy.faq)] },
    { path: "/blog", pageKey: "blog", ld: [] },
    { path: "/about", pageKey: "about", ld: [personSchema()] },
  ];
  const routes = statics.map((r) => ({
    path: r.path,
    meta: buildMeta("en", r.pageKey, {}, r.path),
    ld: r.ld.filter(Boolean),
  }));
  for (const post of posts) {
    const path = `/blog/${post.slug}`;
    routes.push({
      path,
      lang: post.lang,
      meta: buildMeta(
        post.lang,
        "blog",
        { title: `${post.title} — The Cycle Space`, description: post.excerpt, image: absoluteAsset(post.coverImage) },
        path
      ),
      ld: [articleSchema(post)],
    });
  }
  return routes;
}

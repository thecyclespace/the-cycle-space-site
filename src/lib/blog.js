import { marked } from "marked";
import { localizedPath } from "./paths";
import { parseFrontmatter } from "./frontmatter";

// Charge tous les fichiers Markdown de src/content/blog/ au build (Vite import.meta.glob).
const modules = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

// Root-relative site links written in the Markdown body (e.g. [consultation](/services)) get the Vite
// base and the language of the article, so a French article links to /fr/services.
const SITE_LINK = /href="(\/(?:services|about|blog|resources)?(?:\/[a-z0-9-]+)*)(#[^"]*)?"/g;
function localizeLinks(html, lang) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return html.replace(SITE_LINK, (_, p, hash = "") => `href="${base}${localizedPath(p, lang)}${hash}"`);
}

// Préfixe le `base` Vite aux chemins absolus (ex. "/uploads/x.png") pour qu'ils
// résolvent aussi sur un sous-chemin GitHub Pages. Laisse les URLs http(s) intactes.
function withBase(src) {
  if (!src || /^https?:\/\//.test(src)) return src || null;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return src.startsWith("/") ? base + src : src;
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      date: toDate(data.date),
      excerpt: data.excerpt || "",
      coverImage: withBase(data.coverImage),
      tags: Array.isArray(data.tags) ? data.tags : [],
      tool: typeof data.tool === "string" && data.tool ? data.tool : null,
      translation: typeof data.translation === "string" && data.translation ? data.translation : null,
      lang: data.lang === "fr" ? "fr" : "en",
      draft: data.draft === true || data.draft === "true",
      bodyHtml: localizeLinks(marked.parse(content || "", { async: false }), data.lang === "fr" ? "fr" : "en"),
    };
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null;
}

export function formatDate(date, lang = "en") {
  if (!date) return "";
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // Same day for every visitor and for the prerender: without it, a visitor west of UTC gets the
    // previous day, the page no longer matches its prerendered HTML and React has to rebuild it.
    timeZone: "UTC",
  }).format(date);
}

// Translation of a post in the other language. Works both ways: if only one of the two
// articles declares `translation: <slug>`, the other one still finds it.
export function getTranslation(post) {
  if (!post) return null;
  const declared = post.translation ? getPost(post.translation) : null;
  if (declared && declared.lang !== post.lang) return declared;
  return posts.find((p) => p.translation === post.slug && p.lang !== post.lang) || null;
}

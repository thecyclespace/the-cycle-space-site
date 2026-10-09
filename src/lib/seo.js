import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "./i18n";
import seoData from "../content/seo/seo.json";
import { stripLang, localizedPath } from "./paths";

// Public URL of the site, INCLUDING its base path if any.
//   - today (GitHub Pages project site): https://thecyclespace.github.io/the-cycle-space-site
//   - once the custom domain is live:    https://thecyclespace.com
// Set it with VITE_SITE_URL at build time (see .github/workflows/deploy.yml).
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://thecyclespace.com"
).replace(/\/$/, "");

// Scheme + host only: used for assets whose path already contains the base ("/the-cycle-space-site/uploads/x.png").
export const SITE_ORIGIN = SITE_URL.replace(/^(https?:\/\/[^/]+).*$/, "$1");

// Canonical URL of a route. GitHub Pages serves folders with a trailing slash,
// so canonical, sitemap and internal redirects all agree on it.
export function canonicalUrl(pathname = "/") {
  const clean = pathname.replace(/\/+$/, "");
  return `${SITE_URL}${clean}/`;
}

// Absolute URL of a path that already includes the Vite base (cover images, brand assets).
export function absoluteAsset(path) {
  if (!path) return undefined;
  return /^https?:\/\//.test(path) ? path : `${SITE_ORIGIN}${path}`;
}

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.jpg`;

// hreflang pairs for a page that exists in both languages (/x and /fr/x), plus x-default (English).
export function staticAlternates(pathname = "/") {
  const base = stripLang(pathname);
  return [
    { hreflang: "en", href: canonicalUrl(base) },
    { hreflang: "fr", href: canonicalUrl(localizedPath(base, "fr")) },
    { hreflang: "x-default", href: canonicalUrl(base) },
  ];
}

// Alternates of an article: itself and its translation (if any), x-default = the English one.
export function postAlternates(post, translation) {
  if (!translation) return [];
  const en = post.lang === "en" ? post : translation;
  const fr = post.lang === "fr" ? post : translation;
  const at = (p) => canonicalUrl(localizedPath(`/blog/${p.slug}`, p.lang));
  return [
    { hreflang: "en", href: at(en) },
    { hreflang: "fr", href: at(fr) },
    { hreflang: "x-default", href: at(en) },
  ];
}

// Pure helper shared by the React hook (client) and the prerender script (build):
// one source of truth for the <head> of each route.
export function buildMeta(lang, pageKey, override = {}, pathname = "/") {
  const seo = seoData[lang] || seoData.en;
  const page = pageKey ? seo.pages?.[pageKey] : null;
  const title = override.title || page?.title || seo.title;
  const description = override.description || page?.description || seo.description;
  return {
    title,
    description,
    ogTitle: override.ogTitle || page?.ogTitle || seo.ogTitle || title,
    ogDescription: override.ogDescription || page?.ogDescription || seo.ogDescription || description,
    url: canonicalUrl(pathname),
    image: override.image || DEFAULT_OG_IMAGE,
    alternates: override.alternates || staticAlternates(pathname),
  };
}

// Met à jour <title>, meta description, OG, Twitter Card, canonical et html[lang]
// selon la langue active + la page courante (clef dans seoData[lang].pages).
// `override` (optionnel) = { title, description, ogTitle, ogDescription, image }.
export function usePageMeta(pageKey, override) {
  const { lang } = useI18n();
  const location = useLocation();
  const ovTitle = override?.title;
  const ovDescription = override?.description;
  const ovOgTitle = override?.ogTitle;
  const ovOgDescription = override?.ogDescription;
  const ovImage = override?.image;
  const ovAlternates = override?.alternates;
  const altKey = ovAlternates ? JSON.stringify(ovAlternates) : "";

  useEffect(() => {
    const m = buildMeta(
      lang,
      pageKey,
      { title: ovTitle, description: ovDescription, ogTitle: ovOgTitle, ogDescription: ovOgDescription, image: ovImage, alternates: ovAlternates },
      location.pathname
    );
    document.title = m.title;
    document.documentElement.lang = lang;

    setMeta('meta[name="description"]', m.description);
    setMeta('meta[property="og:title"]', m.ogTitle);
    setMeta('meta[property="og:description"]', m.ogDescription);
    setMeta('meta[property="og:url"]', m.url);
    setMeta('meta[property="og:image"]', m.image);
    setMeta('meta[name="twitter:title"]', m.ogTitle);
    setMeta('meta[name="twitter:description"]', m.ogDescription);
    setMeta('meta[name="twitter:image"]', m.image);
    setLink('link[rel="canonical"]', m.url);
    setAlternates(m.alternates);
  }, [lang, pageKey, ovTitle, ovDescription, ovOgTitle, ovOgDescription, ovImage, altKey, location.pathname]);
}

function setMeta(selector, content) {
  const el = document.querySelector(selector);
  if (el && content != null) el.setAttribute("content", content);
}

function setAlternates(alternates = []) {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove());
  for (const a of alternates) {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = a.hreflang;
    link.href = a.href;
    document.head.appendChild(link);
  }
}

function setLink(selector, href) {
  const el = document.querySelector(selector);
  if (el && href) el.setAttribute("href", href);
}

// Injecte un bloc <script type="application/ld+json"> dans le <head>.
// Les pages pré-rendues contiennent déjà ce JSON-LD (marqué data-prerendered) :
// on le remplace au montage pour ne jamais dupliquer les données structurées.
export function useJsonLd(data) {
  const key = data ? JSON.stringify(data) : null;
  useEffect(() => {
    if (!key) return;
    document.querySelectorAll('script[type="application/ld+json"][data-prerendered]').forEach((n) => n.remove());
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = key;
    document.head.appendChild(script);
    return () => script.remove();
  }, [key]);
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "./i18n";
import seoData from "../content/seo/seo.json";

// URL canonique du site. Override possible via VITE_SITE_URL au build.
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://thecyclespace.com"
).replace(/\/$/, "");

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

  useEffect(() => {
    const seo = seoData[lang];
    if (!seo) return;
    const page = pageKey ? seo.pages?.[pageKey] : null;
    const title = ovTitle || page?.title || seo.title;
    const description = ovDescription || page?.description || seo.description;
    const ogTitle = ovOgTitle || page?.ogTitle || seo.ogTitle || title;
    const ogDescription = ovOgDescription || page?.ogDescription || seo.ogDescription || description;
    const url = `${SITE_URL}${location.pathname}`;
    const image = ovImage || `${SITE_URL}/og.jpg`;

    document.title = title;
    document.documentElement.lang = lang;

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', ogTitle);
    setMeta('meta[property="og:description"]', ogDescription);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[name="twitter:title"]', ogTitle);
    setMeta('meta[name="twitter:description"]', ogDescription);
    setMeta('meta[name="twitter:image"]', image);
    setLink('link[rel="canonical"]', url);
  }, [lang, pageKey, ovTitle, ovDescription, ovOgTitle, ovOgDescription, ovImage, location.pathname]);
}

function setMeta(selector, content) {
  const el = document.querySelector(selector);
  if (el && content != null) el.setAttribute("content", content);
}

function setLink(selector, href) {
  const el = document.querySelector(selector);
  if (el && href) el.setAttribute("href", href);
}

// Injecte un bloc <script type="application/ld+json"> dans le <head>.
// Le JSON-LD étant ajouté côté client après hydratation, Google le verra
// au 2e passage du crawl (pas idéal — voir reco prerendering dans le README).
export function useJsonLd(data) {
  const key = data ? JSON.stringify(data) : null;
  useEffect(() => {
    if (!key) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = key;
    document.head.appendChild(script);
    return () => script.remove();
  }, [key]);
}

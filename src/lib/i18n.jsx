import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import enCopy from "../content/i18n/en.json";
import frCopy from "../content/i18n/fr.json";
import { langFromPath, localizedPath, stripLang } from "./paths";

const I18nContext = createContext(null);
const copy = { en: enCopy, fr: frCopy };

// The language comes from the URL (/fr/... = French), never from a stored preference:
// every page has one language, so search engines and visitors always get what the URL says.
export function I18nProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = langFromPath(location.pathname);
  const t = copy[lang];
  const path = useCallback((p) => localizedPath(p, lang), [lang]);
  // Switch language on the same page (the header handles articles, which need their translation).
  const setLang = useCallback(
    (nextLang) => navigate(localizedPath(stripLang(location.pathname), nextLang) + location.search + location.hash),
    [navigate, location.pathname, location.search, location.hash]
  );
  const value = useMemo(() => ({ lang, setLang, t, path }), [lang, setLang, t, path]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// Locks the i18n language for a subtree (used to align an embedded tool with
// the language of the article that hosts it).
export function I18nScope({ lang, children }) {
  const parent = useContext(I18nContext);
  const value = useMemo(() => {
    if (!parent) return null;
    const target = lang === "fr" || lang === "en" ? lang : parent.lang;
    if (target === parent.lang) return parent;
    return { ...parent, lang: target, t: copy[target], path: (p) => localizedPath(p, target) };
  }, [parent, lang]);
  if (!value) return children;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

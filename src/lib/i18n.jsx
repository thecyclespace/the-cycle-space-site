import { createContext, useContext, useMemo, useState } from "react";
import enCopy from "../content/i18n/en.json";
import frCopy from "../content/i18n/fr.json";

const I18nContext = createContext(null);
const STORAGE_KEY = "tcs_lang";
const copy = { en: enCopy, fr: frCopy };

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "en";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "fr" || saved === "en" ? saved : "en";
    } catch {
      return "en";
    }
  });
  const setLang = (newLang) => {
    setLangState(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch {}
  };
  const t = useMemo(() => copy[lang], [lang]);
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

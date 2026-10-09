// Where a "What brings you here?" card leads. The CMS stores a short key (a dropdown),
// so Elsa can never type a broken URL; the key is resolved to a path in the current language.
const TOOL_SLUGS = {
  regularity: { en: "is-your-cycle-regular", fr: "ton-cycle-est-il-regulier" },
  "post-contraception": { en: "post-contraception-timeline", fr: "apres-larret-de-la-contraception" },
  basal: { en: "basal-temperature-tracker", fr: "journal-temperature-basale" },
  "where-am-i": { en: "where-am-i-in-my-cycle", fr: "ou-en-suis-je-dans-mon-cycle" },
  calculator: { en: "period-calculator", fr: "calculateur-cycle-menstruel" },
};

// Returns an unlocalised site path ("/services", "/blog/<slug>"); wrap it with `path()` from useI18n().
export function concernHref(link, lang) {
  if (link === "about") return "/about";
  if (link === "blog") return "/blog";
  const tool = TOOL_SLUGS[link];
  if (tool) return `/blog/${tool[lang] || tool.en}`;
  return "/services";
}

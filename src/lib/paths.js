// Language lives in the URL: English at the root ("/services"), French under "/fr" ("/fr/services").
// Pure helpers (no React) shared by the router, the header, the SEO code and the prerender.

export function langFromPath(pathname = "/") {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

// "/fr/services" -> "/services", "/fr" -> "/", "/services" -> "/services"
export function stripLang(pathname = "/") {
  if (pathname === "/fr") return "/";
  return pathname.startsWith("/fr/") ? pathname.slice(3) : pathname;
}

// Prefix a site path ("/", "/services", "/services#inner-rhythm", "/blog/x") for a language.
export function localizedPath(path, lang) {
  const hashAt = path.indexOf("#");
  const pathname = hashAt >= 0 ? path.slice(0, hashAt) : path;
  const hash = hashAt >= 0 ? path.slice(hashAt) : "";
  const base = stripLang(pathname) || "/";
  const out = lang === "fr" ? (base === "/" ? "/fr" : `/fr${base}`) : base;
  return out + hash;
}

// Article URL: a French article lives under /fr, an English one at the root.
export function postPath(post) {
  return localizedPath(`/blog/${post.slug}`, post.lang);
}

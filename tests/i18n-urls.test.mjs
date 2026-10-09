// EN/FR URL structure: English at the root, French under /fr, reciprocal hreflang, old links preserved.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { langFromPath, stripLang, localizedPath, postPath } from "../src/lib/paths.js";

test("langFromPath / stripLang", () => {
  assert.equal(langFromPath("/"), "en");
  assert.equal(langFromPath("/services"), "en");
  assert.equal(langFromPath("/fr"), "fr");
  assert.equal(langFromPath("/fr/"), "fr");
  assert.equal(langFromPath("/fr/blog/x"), "fr");
  assert.equal(langFromPath("/frequently-asked"), "en"); // only the exact /fr segment counts
  assert.equal(stripLang("/fr"), "/");
  assert.equal(stripLang("/fr/services"), "/services");
  assert.equal(stripLang("/services"), "/services");
});

test("localizedPath keeps hashes, never double-prefixes and is reversible", () => {
  assert.equal(localizedPath("/", "fr"), "/fr");
  assert.equal(localizedPath("/", "en"), "/");
  assert.equal(localizedPath("/services#inner-rhythm", "fr"), "/fr/services#inner-rhythm");
  assert.equal(localizedPath("/fr/services", "fr"), "/fr/services");
  assert.equal(localizedPath("/fr/services", "en"), "/services");
  assert.equal(localizedPath(localizedPath("/blog/a", "fr"), "en"), "/blog/a");
});

test("postPath: English articles at the root, French under /fr", () => {
  assert.equal(postPath({ slug: "welcome", lang: "en" }), "/blog/welcome");
  assert.equal(postPath({ slug: "ton-cycle", lang: "fr" }), "/fr/blog/ton-cycle");
});

// ---- build output (skipped without dist/) ----
const dist = path.resolve("dist");
const built = fs.existsSync(path.join(dist, "sitemap.xml"));
const opts = { skip: built ? false : "run `npm run build` first" };
const read = (p) => fs.readFileSync(path.join(dist, p), "utf8");
const locs = () => [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const base = () => new URL(locs()[0]).pathname;
const fileOf = (url) => {
  const rel = new URL(url).pathname.slice(base().length);
  return rel === "" ? "index.html" : path.join(rel, "index.html");
};
const alternatesOf = (html) =>
  [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);

test("French pages exist, are marked lang=fr and have a French title", opts, () => {
  const fr = locs().filter((l) => new URL(l).pathname.startsWith(`${base()}fr/`) || new URL(l).pathname === `${base()}fr/`);
  assert.ok(fr.length >= 4 + 1, "expected the 4 static FR pages plus FR articles");
  for (const url of fr) {
    const html = read(fileOf(url));
    assert.match(html, /<html lang="fr"/, url);
    assert.match(html, /og:locale" content="fr_FR"/, url);
  }
  assert.ok(!read("fr/services/index.html").includes("<title>Services —"), "FR title must differ from EN");
});

test("hreflang is reciprocal: every alternate links back to the page that declares it", opts, () => {
  let checked = 0;
  for (const url of locs()) {
    const alts = alternatesOf(read(fileOf(url)));
    if (alts.length === 0) continue;
    assert.ok(alts.some(([, href]) => href === url), `${url} must list itself`);
    assert.ok(alts.some(([h]) => h === "x-default"), `${url} needs x-default`);
    for (const [, href] of alts) {
      const back = alternatesOf(read(fileOf(href)));
      assert.ok(back.some(([, h]) => h === url), `${href} does not link back to ${url}`);
      checked++;
    }
  }
  assert.ok(checked > 10);
});

test("sitemap carries xhtml alternates and no French article is listed under the English path", opts, () => {
  const xml = read("sitemap.xml");
  assert.match(xml, /xmlns:xhtml=/);
  assert.match(xml, /<xhtml:link rel="alternate" hreflang="fr"/);
  for (const url of locs()) {
    const p = new URL(url).pathname.slice(base().length);
    if (p.startsWith("blog/") && p !== "blog/") {
      const html = read(fileOf(url));
      assert.match(html, /<html lang="en"/, `${url} is listed as English but is not`);
    }
  }
});

test("old French article URLs (/blog/<slug>) are kept as redirects to /fr/blog/<slug>, noindex", opts, () => {
  const dir = path.resolve("src/content/blog");
  let n = 0;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const fm = fs.readFileSync(path.join(dir, f), "utf8");
    if (!/^lang:\s*fr\s*$/m.test(fm) || /^draft:\s*true/m.test(fm)) continue;
    const slug = f.replace(/\.md$/, "");
    const html = read(path.join("blog", slug, "index.html"));
    assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=[^"]*/fr/blog/${slug}/"`), slug);
    assert.match(html, /name="robots" content="noindex"/);
    assert.ok(!locs().some((l) => l.endsWith(`/blog/${slug}/`) && !l.includes("/fr/")), `${slug} must not be in the sitemap at the old URL`);
    n++;
  }
  assert.ok(n >= 1);
});

test("every internal link of a prerendered page points to a page in the same language", opts, () => {
  for (const url of locs()) {
    const html = read(fileOf(url));
    const isFr = /<html lang="fr"/.test(html);
    const body = html.slice(html.indexOf('<div id="root">'));
    const b = base();
    for (const m of body.matchAll(/<a [^>]*href="([^"#]*)"/g)) {
      const href = m[1];
      if (!href.startsWith(b)) continue; // external or asset
      const rest = href.slice(b.length - 1); // keep the leading slash
      if (/\.(pdf|png|jpg|jpeg|svg|xml|txt)$/i.test(rest) || rest.startsWith("/admin")) continue;
      const linkIsFr = rest === "/fr" || rest.startsWith("/fr/");
      assert.equal(linkIsFr, isFr, `${url} links to ${href} in the other language`);
    }
  }
});

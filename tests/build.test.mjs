// Checks the OUTPUT of `npm run build` (dist/). Skipped when dist/ does not exist.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const has = fs.existsSync(path.join(dist, "sitemap.xml"));
const opts = { skip: has ? false : "run `npm run build` first" };
const read = (p) => fs.readFileSync(path.join(dist, p), "utf8");

const sitemapPaths = () =>
  [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const base = () => {
  const home = new URL([...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)][0][1]).pathname;
  return home; // e.g. "/the-cycle-space-site/" or "/"
};
const fileFor = (urlPath) => {
  const rel = urlPath.slice(base().length);
  return rel === "" ? "index.html" : path.join(rel, "index.html");
};

test("every sitemap URL has a prerendered HTML file", opts, () => {
  for (const p of sitemapPaths()) assert.ok(fs.existsSync(path.join(dist, fileFor(p))), `missing file for ${p}`);
});

test("each prerendered page has a unique title, a canonical, a description and visible text without JavaScript", opts, () => {
  const titles = new Set();
  for (const p of sitemapPaths()) {
    const html = read(fileFor(p));
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, `${p} title`);
    assert.ok(!titles.has(title) || p === base(), `duplicate title on ${p}`);
    titles.add(title);
    assert.match(html, /<link rel="canonical" href="https?:\/\/[^"]+\/"/, `${p} canonical`);
    assert.match(html, /<meta name="description" content="[^"]{30,}/, `${p} description`);
    const body = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] || "";
    const text = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    assert.ok(text.length > 300, `${p} has only ${text.length} chars of text in the initial HTML`);
    assert.match(body, /<h1[ >]/, `${p} h1`);
  }
});

test("canonical of a page matches its sitemap URL", opts, () => {
  const locs = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const html = read(fileFor(new URL(loc).pathname));
    assert.ok(html.includes(`<link rel="canonical" href="${loc}"`), `canonical mismatch for ${loc}`);
  }
});

test("structured data is present and valid JSON on services, about and posts", opts, () => {
  const types = (p) =>
    [...read(fileFor(p)).matchAll(/<script type="application\/ld\+json" data-prerendered>(.*?)<\/script>/g)].map((m) =>
      JSON.parse(m[1])
    );
  const b = base();
  assert.equal(types(`${b}services/`)[0]["@type"], "FAQPage");
  assert.equal(types(`${b}about/`)[0]["@type"], "Person");
  const art = types(`${b}blog/welcome/`)[0]["@graph"].map((n) => n["@type"]);
  assert.deepEqual(art, ["Article", "BreadcrumbList"]);
});

test("sitemap: static pages have no lastmod, posts use their real date; robots protects /admin/", opts, () => {
  const blocks = read("sitemap.xml").split("<url>").slice(1);
  for (const blk of blocks) {
    const isPost = blk.includes("/blog/") && !/\/blog\/<\/loc>/.test(blk);
    assert.equal(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(blk), isPost, blk.trim().slice(0, 90));
  }
  const robots = read("robots.txt");
  assert.match(robots, /Disallow: \/admin\//);
  assert.ok(!/Disallow: \/uploads\//.test(robots), "uploads must stay indexable (article images)");
});

test("404.html is the SPA shell (empty root) and is not indexable", opts, () => {
  const html = read("404.html");
  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /<meta name="robots" content="noindex/);
});

test("Calendly script is not part of the initial HTML (loaded on demand)", opts, () => {
  for (const p of sitemapPaths()) assert.ok(!read(fileFor(p)).includes("assets.calendly.com"), p);
});

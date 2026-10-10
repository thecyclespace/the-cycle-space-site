// Images, accessibility texts and home-page content that the new design depends on.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const images = json("src/content/settings/images.json");
const manifest = json("src/content/images.manifest.json");
const en = json("src/content/i18n/en.json");
const fr = json("src/content/i18n/fr.json");
const pub = (p) => new URL(`../public${p}`, import.meta.url);

test("every site image points to an existing file (optimised set or an upload)", () => {
  for (const [key, src] of Object.entries(images)) {
    assert.ok(src.startsWith("/"), `${key} must be a site path`);
    assert.ok(fs.existsSync(pub(src)), `${key}: ${src} does not exist in public/`);
  }
});

test("optimised images have AVIF + WebP files for every declared width, and are light", () => {
  const MAX_BYTES = 180 * 1024; // the largest variant of any image
  for (const [name, entry] of Object.entries(manifest)) {
    assert.ok(entry.widths.length >= 2, name);
    for (const w of entry.widths) {
      for (const ext of ["webp", "avif"]) {
        const f = pub(`/images/site/${name}-${w}.${ext}`);
        assert.ok(fs.existsSync(f), `missing ${name}-${w}.${ext}`);
        assert.ok(fs.statSync(f).size < MAX_BYTES, `${name}-${w}.${ext} is heavier than 180 KB`);
      }
    }
  }
});

test("no heavy raw PNG is shipped in public/ (originals stay in assets-source/)", () => {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
  const heavy = walk(path.resolve("public")).filter((f) => /\.(png|jpe?g)$/i.test(f) && fs.statSync(f).size > 600 * 1024);
  assert.deepEqual(heavy, []);
});

test("images used on the home page have an alternative text in both languages", () => {
  for (const data of [en, fr]) {
    for (const k of ["elsa", "tool"]) assert.ok(data.imageAlts[k] && data.imageAlts[k].length > 15, `imageAlts.${k}`);
  }
});

test("home: 'What brings you here' cards use known icons and destinations (no free-typed URL)", () => {
  const icons = new Set(["drop", "mood", "cycle", "waves", "capsule", "sprout"]);
  const links = new Set(["services", "about", "blog", "regularity", "post-contraception", "basal", "where-am-i", "calculator"]);
  for (const data of [en, fr]) {
    assert.ok(data.concerns.items.length >= 4 && data.concerns.items.length <= 8);
    for (const it of data.concerns.items) {
      assert.ok(icons.has(it.icon), `icon ${it.icon}`);
      assert.ok(links.has(it.link), `link ${it.link}`);
      assert.ok(it.title.length <= 40, `card title too long: ${it.title}`);
    }
  }
  assert.equal(en.concerns.items.length, fr.concerns.items.length);
});

test("tool links of the cards point to existing articles in both languages", () => {
  const dir = new URL("../src/content/blog/", import.meta.url);
  const slugs = new Set(fs.readdirSync(dir).map((f) => f.replace(/\.md$/, "")));
  const src = read("src/lib/concernLinks.js");
  for (const m of src.matchAll(/(?:en|fr): "([^"]+)"/g)) assert.ok(slugs.has(m[1]), `concernLinks.js: article "${m[1]}" does not exist`);
});

test("every offer has a one-line summary; offers shown on the home page are short", () => {
  for (const data of [en, fr]) {
    for (const s of data.services) {
      assert.ok(s.summary && s.summary.length <= 120, `summary of ${s.title}`);
      assert.ok(s.tag.length <= 50, `tag of ${s.title}`);
    }
  }
});

test("hero copy stays short (mobile first screen)", () => {
  for (const data of [en, fr]) {
    assert.ok(data.heroTitle.length <= 70, "hero title");
    assert.ok(data.heroText.length <= 110, "hero subtitle");
    assert.ok(data.trust.length <= 60, "hero reassurance line");
  }
});

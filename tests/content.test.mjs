// Content / CMS compatibility checks. They protect Elsa from publishing something that breaks the site.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCopy } from "./_content.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const en = loadCopy("en");
const fr = loadCopy("fr");
const site = json("src/content/settings/site.json");
const seo = json("src/content/seo/seo.json");
const guide = json("src/content/settings/guide.json");

function keysDeep(o, prefix = "") {
  return Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? keysDeep(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

test("EN and FR files expose exactly the same keys", () => {
  assert.deepEqual(keysDeep(en).sort(), keysDeep(fr).sort());
});

test("nav uses the {label, route} shape expected by the CMS and routes exist", () => {
  const routes = new Set(["/", "/services", "/blog", "/about"]);
  for (const data of [en, fr]) {
    assert.equal(data.nav.length, 4);
    for (const item of data.nav) {
      assert.equal(typeof item.label, "string");
      assert.ok(routes.has(item.route), `unknown route ${item.route}`);
    }
  }
});

test("services: required fields, valid action, 3-4 cards, same count in both languages", () => {
  assert.equal(en.services.length, fr.services.length);
  assert.ok(en.services.length >= 3 && en.services.length <= 4);
  for (const data of [en, fr]) {
    for (const s of data.services) {
      for (const f of ["title", "tag", "body", "cta"]) assert.ok(s[f], `service "${s.title}" missing ${f}`);
      assert.ok(["intro", "checkin", "waitlist"].includes(s.action), `bad action on "${s.title}"`);
    }
  }
});

test("Calendly URLs: default link preserved, optional links empty or valid", () => {
  assert.equal(site.bookingUrl, "https://calendly.com/thecyclespaceadmin");
  for (const k of ["bookingUrlIntroduction", "bookingUrlCheckIn"]) {
    assert.ok(site[k] === "" || /^https:\/\/calendly\.com\/\S+$/.test(site[k]), `${k} is not a calendly.com link`);
  }
});

test("guide lead email is a valid address; one guide per language, in the CMS upload folder, under its size limit", () => {
  assert.match(guide.guideLeadEmail, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  for (const k of ["guidePdfEn", "guidePdfFr"]) {
    assert.match(guide[k], /^\/uploads\/[^/]+\.pdf$/, `${k} must be a PDF uploaded through the CMS`);
    const file = new URL(`../public${guide[k]}`, import.meta.url);
    assert.ok(fs.existsSync(file), `${guide[k]} is missing`);
    assert.ok(fs.statSync(file).size <= 3_000_000, `${guide[k]} is heavier than the CMS upload limit`);
  }
  assert.notEqual(guide.guidePdfEn, guide.guidePdfFr);
  for (const k of ["guideCoverEn", "guideCoverFr"]) {
    assert.ok(fs.existsSync(new URL(`../public${guide[k]}`, import.meta.url)), `${guide[k]} (guide cover) is missing`);
  }
  const form = read("src/components/GuideForm.jsx");
  assert.ok(form.includes("guidePdfFr") && form.includes("guidePdfEn"), "the form serves the guide of the page language");
});

test("method has 4 phases with the fields the page renders", () => {
  for (const data of [en, fr]) {
    assert.equal(data.method.phases.length, 4);
    for (const p of data.method.phases) {
      for (const f of ["num", "title", "tag", "body", "outcome", "quote"]) assert.ok(p[f], `phase ${p.num} missing ${f}`);
      assert.ok(p.points.length >= 1);
    }
  }
});

test("SEO file has title/description for every page, in both languages", () => {
  for (const lang of ["en", "fr"]) {
    for (const key of ["services", "blog", "about", "notFound"]) {
      assert.ok(seo[lang].pages[key]?.title && seo[lang].pages[key]?.description, `${lang}.${key}`);
    }
  }
});

test("blog posts: frontmatter has title, date and lang; translations point to an existing post", () => {
  const dir = new URL("../src/content/blog/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const slugs = new Set(files.map((f) => f.replace(/\.md$/, "")));
  for (const f of files) {
    const fm = fs.readFileSync(new URL(f, dir), "utf8").match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/)?.[1] || "";
    assert.match(fm, /^title:/m, `${f} title`);
    assert.match(fm, /^date:/m, `${f} date`);
    assert.match(fm, /^lang:\s*(en|fr)\s*$/m, `${f} lang`);
    const tr = fm.match(/^translation:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
    if (tr) assert.ok(slugs.has(tr.trim()), `${f} translation "${tr}" does not exist`);
  }
});

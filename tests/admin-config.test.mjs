// The admin (public/admin/config.yml) and the content files must describe the same thing:
// a field without data shows up empty to Elsa, data without a field can never be edited,
// and a value outside a drop-down list is silently replaced when she saves.
// These tests also guard what the admin is allowed to write to.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parse } from "yaml";
import { PAGES, readPage } from "./_content.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");
const config = parse(read("public/admin/config.yml"));
const LOCALES = ["fr", "en"];
const collection = (name) => config.collections.find((c) => c.name === name);
const fileEntries = config.collections.flatMap((c) => (c.files || []).map((f) => ({ ...f, collection: c.name })));
const targets = (file) => (file.file.includes("{{locale}}") ? LOCALES.map((l) => file.file.replace("{{locale}}", l)) : [file.file]);

// Walks the fields of a form together with the data of its file.
function compare(fields, data, path, problems) {
  const names = fields.map((f) => f.name);
  for (const key of Object.keys(data)) if (!names.includes(key)) problems.push(`${path}.${key}: in the file but not in the admin`);
  const expectedOrder = names.filter((n) => n in data);
  if (JSON.stringify(Object.keys(data)) !== JSON.stringify(expectedOrder)) problems.push(`${path}: keys are not in the order of the admin form`);
  for (const field of fields) {
    const here = `${path}.${field.name}`;
    if (!(field.name in data)) {
      if (field.required !== false) problems.push(`${here}: required in the admin but missing in the file`);
      continue;
    }
    const value = data[field.name];
    if (field.widget === "object") compare(field.fields, value, here, problems);
    else if (field.widget === "list") {
      if (!Array.isArray(value)) problems.push(`${here}: the admin expects a list`);
      else if (field.fields) value.forEach((item, i) => compare(field.fields, item, `${here}[${i}]`, problems));
      else if (value.some((item) => typeof item !== "string")) problems.push(`${here}: list items must be text`);
      if (Array.isArray(value) && field.min && value.length < field.min) problems.push(`${here}: fewer than ${field.min} items`);
      if (Array.isArray(value) && field.max && value.length > field.max) problems.push(`${here}: more than ${field.max} items`);
    } else if (field.widget === "select") {
      const options = field.options.map((o) => (typeof o === "object" ? o.value : o));
      if (!options.includes(value)) problems.push(`${here}: "${value}" is not in the drop-down list`);
    } else if (["string", "text", "image", "file"].includes(field.widget)) {
      if (typeof value !== "string") problems.push(`${here}: expected text`);
      else if (field.pattern && value !== "" && !new RegExp(field.pattern[0]).test(value)) problems.push(`${here}: the current value breaks its own rule (${field.pattern[1]})`);
    }
  }
}

test("every form of the admin matches its file, both ways, and in the same order", () => {
  const problems = [];
  for (const file of fileEntries) {
    for (const target of targets(file)) compare(file.fields, JSON.parse(read(target)), target.split("/").pop(), problems);
  }
  assert.deepEqual(problems, []);
});

test("the pages are edited in French and English side by side, one file per page and language", () => {
  assert.deepEqual(config.i18n.locales, LOCALES);
  assert.equal(config.i18n.default_locale, "fr");
  const pages = collection("pages");
  assert.deepEqual(pages.files.map((f) => f.name).sort(), [...PAGES].sort(), "one admin page per content page");
  const untranslated = [];
  const walk = (fields, path) => {
    for (const f of fields) {
      if (f.i18n !== true) untranslated.push(`${path}.${f.name}`);
      if (f.fields) walk(f.fields, `${path}.${f.name}`);
      if (f.field && f.field.i18n !== true) untranslated.push(`${path}.${f.name}[]`);
    }
  };
  for (const file of pages.files) {
    assert.equal(file.file, `src/content/pages/${file.name}.{{locale}}.json`);
    assert.equal(file.i18n, true);
    walk(file.fields, file.name);
    for (const lang of LOCALES) assert.ok(readPage(file.name, lang), `${file.name}.${lang}.json`);
  }
  // Every field keeps its own value per language: saving French can never overwrite English.
  assert.deepEqual(untranslated, []);
});

test("the admin can only write to the content and media folders (never code, workflows or settings of the project)", () => {
  const allowed = [/^src\/content\/(pages|settings|seo)\/[a-z.{}]+\.json$/];
  for (const file of fileEntries) assert.ok(allowed.some((re) => re.test(file.file)), `${file.file} is outside the content folders`);
  for (const c of config.collections.filter((c) => c.folder)) assert.equal(c.folder, "src/content/blog");
  assert.equal(config.media_folder, "public/uploads");
  const mediaFolders = new Set();
  const walk = (fields) => {
    for (const f of fields || []) {
      if (f.media_folder) mediaFolders.add(f.media_folder);
      walk(f.fields);
    }
  };
  config.collections.forEach((c) => {
    if (c.media_folder) mediaFolders.add(c.media_folder);
    walk(c.fields);
    (c.files || []).forEach((f) => walk(f.fields));
  });
  assert.deepEqual([...mediaFolders], ["/public/images/site"]);
  const raw = read("public/admin/config.yml");
  for (const forbidden of [".github/", "package.json", "vite.config", "node_modules", "src/components", "src/pages", "src/lib", "scripts/"]) {
    assert.ok(!raw.replace(/^\s*#.*$/gm, "").includes(forbidden), `config.yml mentions ${forbidden}`);
  }
});

test("no secret in the admin: only the public address of the sign-in service", () => {
  const files = ["public/admin/config.yml", "public/admin/index.html", ...fs.readdirSync(new URL("public/admin/", root)).filter((f) => f.endsWith(".js")).map((f) => `public/admin/${f}`)];
  for (const f of files) {
    const src = read(f);
    for (const re of [/gh[pousr]_[A-Za-z0-9]{20,}/, /github_pat_[A-Za-z0-9_]{20,}/, /client_secret/i, /Bearer\s+[A-Za-z0-9._-]{20,}/, /access_token\s*[:=]\s*["'][^"']+["']/i]) {
      assert.ok(!re.test(src), `${f} looks like it contains a secret (${re})`);
    }
  }
  assert.match(config.backend.base_url, /^https:\/\/[a-z0-9.-]+\.workers\.dev$/);
  assert.equal(config.backend.branch, "main");
  assert.equal(config.backend.repo, "thecyclespace/the-cycle-space-site");
});

test("labels are written for Elsa: plain French, no technical word, every field explained by its name", () => {
  const banned = /\b(hero|kicker|cta|tag|slug|placeholder|modal|json|markdown|frontmatter|seo|commit|url|disclaimer|tagline|handle|credentials?|header|footer|item)\b/i;
  const bad = [];
  const walk = (fields, path) => {
    for (const f of fields || []) {
      const here = `${path} › ${f.label}`;
      if (!f.label || f.label.length < 3) bad.push(`${path}.${f.name}: no label`);
      else if (banned.test(f.label)) bad.push(here);
      if (f.hint && banned.test(f.hint.replace(/<!-- calculator -->/g, ""))) bad.push(`${here} (hint)`);
      walk(f.fields, here);
    }
  };
  for (const c of config.collections) {
    if (banned.test(c.label) || banned.test(c.description || "")) bad.push(c.label);
    walk(c.fields, c.label);
    for (const f of c.files || []) {
      if (banned.test(f.label) || banned.test(f.description || "")) bad.push(f.label);
      walk(f.fields, f.label);
    }
  }
  assert.deepEqual(bad, []);
});

test("the admin has at most 7 sections and reaches the home page title in 2 clicks", () => {
  assert.ok(config.collections.length <= 7);
  assert.equal(config.collections[0].name, "pages", "the pages are the first section, opened by default");
  assert.equal(config.collections[0].files[0].name, "home");
  const firstFields = config.collections[0].files[0].fields.slice(0, 3).map((f) => f.name);
  assert.ok(firstFields.includes("heroTitle"), "the main title is visible without scrolling");
});

test("articles: the form covers what the site reads, and the drop-down lists match the existing articles", () => {
  const blog = collection("blog");
  const names = blog.fields.map((f) => f.name);
  for (const k of ["title", "date", "excerpt", "coverImage", "draft", "lang", "translation", "tags", "tool", "body"]) assert.ok(names.includes(k), `article field ${k}`);
  assert.equal(blog.fields.find((f) => f.name === "draft").default, true, "a new article starts as a draft");
  const tools = blog.fields.find((f) => f.name === "tool").options.map((o) => o.value);
  const dir = new URL("src/content/blog/", root);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const tool = fs.readFileSync(new URL(f, dir), "utf8").match(/^tool:\s*["']?([a-z-]*)["']?\s*$/m)?.[1];
    if (tool) assert.ok(tools.includes(tool), `${f}: tool "${tool}" is not in the drop-down list`);
  }
});

test("uploads are limited and made lighter; the admin script is pinned and the page is not indexed", () => {
  const media = config.media_libraries;
  assert.ok(media.default.config.max_file_size <= 3_000_000);
  assert.equal(media.default.config.transformations.raster_image.format, "webp");
  assert.ok(media.default.config.transformations.raster_image.width <= 2400);
  assert.deepEqual(media.stock_assets.providers, []);
  const html = read("public/admin/index.html");
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(html, /unpkg\.com\/@sveltia\/cms@\d+\.\d+\.\d+\/dist\/sveltia-cms\.js/, "the admin script version is pinned");
  assert.match(read("public/robots.txt"), /Disallow: \/.*admin/);
});

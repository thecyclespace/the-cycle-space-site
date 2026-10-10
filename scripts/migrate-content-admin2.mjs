// One-off, idempotent migration for "Admin 2.0".
//
// Before: every text of the site lived in two big files (src/content/i18n/en.json and fr.json),
//         edited through one 58-field form per language.
// After:  one small file per page and per language (src/content/pages/<page>.<lang>.json), so that
//         the admin can show "Page d'accueil", "Mes accompagnements"… with a Français / English switch.
//
// Nothing is rewritten: every key keeps its name and its value, it only moves to the file of its page.
// The site merges the files back into the same object as before (src/content/copy.js).
// Running the script again changes nothing.
//
//   node scripts/migrate-content-admin2.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const at = (p) => path.join(root, p);
const readJson = (p) => JSON.parse(fs.readFileSync(at(p), "utf8"));
// Same shape as the admin writes: 2 spaces, final newline.
const writeJson = (p, data) => {
  fs.mkdirSync(path.dirname(at(p)), { recursive: true });
  fs.writeFileSync(at(p), JSON.stringify(data, null, 2) + "\n");
};

// Which page each text belongs to. The order is the order of the fields in the admin (top of the page first).
export const PAGES = {
  home: ["heroKicker", "heroTitle", "heroText", "heroSecondary", "trust", "heroCaption", "mobileHeroTitle", "mobileHeroText", "concerns", "meetElsa", "offersTitle", "offersCta", "homeTool"],
  services: ["pillarsTitle", "pillarsSubtitle", "services", "servicesLabels", "method", "journeyTitle", "journey", "faq"],
  about: ["aboutTitle", "about", "credentials", "aboutText", "manifestoTitle", "manifestoText", "manifestoQuote", "forYouTitle", "forYou"],
  resources: ["resourcesTitle", "resourcesText", "guideEmailLabel", "emailPlaceholder", "guideConsent", "download", "guideNoEmail", "guideSending", "guideInvalidEmail", "guideConsentRequired", "guideThanksTitle", "guideThanksText", "guideSentText", "guideFailedText", "guideDownloadAgain"],
  shared: ["nav", "book", "finalTitle", "finalText", "finalCta", "modalTitle", "modalText", "calendly", "calendlyLoading", "calendlyError", "footerTagline", "disclaimer", "imageAlts"],
};
const LANGS = ["en", "fr"];
const log = [];

// 1. Texts: split the two big files by page.
for (const lang of LANGS) {
  const old = `src/content/i18n/${lang}.json`;
  if (!fs.existsSync(at(old))) continue;
  const all = readJson(old);
  // Descriptions of two pictures that no page displays any more.
  for (const dead of ["online", "blog"]) delete all.imageAlts?.[dead];
  const placed = new Set();
  for (const [page, keys] of Object.entries(PAGES)) {
    const data = {};
    for (const key of keys) {
      if (!(key in all)) throw new Error(`${old}: "${key}" is missing`);
      data[key] = all[key];
      placed.add(key);
    }
    writeJson(`src/content/pages/${page}.${lang}.json`, data);
  }
  const left = Object.keys(all).filter((k) => !placed.has(k));
  if (left.length) throw new Error(`${old}: no page for ${left.join(", ")}`);
  fs.rmSync(at(old));
  log.push(`${old} -> ${Object.keys(PAGES).length} page files`);
}
if (fs.existsSync(at("src/content/i18n")) && fs.readdirSync(at("src/content/i18n")).length === 0) fs.rmdirSync(at("src/content/i18n"));

// 2. Settings: the free guide gets its own file, Elsa's photo joins the other pictures.
const site = readJson("src/content/settings/site.json");
const images = readJson("src/content/settings/images.json");
const guideKeys = ["guidePdfFr", "guidePdfEn", "guideCoverFr", "guideCoverEn", "guideLeadEmail"];
if (guideKeys.some((k) => k in site)) {
  const guide = fs.existsSync(at("src/content/settings/guide.json")) ? readJson("src/content/settings/guide.json") : {};
  for (const k of guideKeys) {
    if (k in site) {
      guide[k] = site[k];
      delete site[k];
    }
  }
  writeJson("src/content/settings/guide.json", Object.fromEntries(guideKeys.filter((k) => k in guide).map((k) => [k, guide[k]])));
  log.push("site.json -> guide.json (PDFs, covers, sign-up email)");
}
if ("elsaImage" in site) {
  // The admin can only show and replace pictures stored in its upload folder.
  let value = site.elsaImage;
  if (!value.startsWith("/uploads/")) {
    const source = at(`public/${value.replace(/^\//, "")}`);
    const target = `public/uploads/${path.basename(value)}`;
    if (!fs.existsSync(at(target))) fs.copyFileSync(source, at(target));
    value = `/uploads/${path.basename(value)}`;
  }
  delete site.elsaImage;
  const next = { elsaImage: value };
  for (const [k, v] of Object.entries(images)) next[k] = v;
  for (const k of Object.keys(images)) delete images[k];
  Object.assign(images, next);
  log.push("site.json elsaImage -> images.json");
}
// Pictures that no page displays any more.
for (const dead of ["onlineImage", "blogImage"]) {
  if (dead in images) {
    delete images[dead];
    log.push(`images.json: removed unused ${dead}`);
  }
}
writeJson("src/content/settings/site.json", site);
writeJson("src/content/settings/images.json", images);

// 3. Same key order in the files as in the admin forms: when Elsa saves a page, the admin rewrites the
//    file in the order of its fields. Doing it once here keeps her first change small and readable.
const config = parse(fs.readFileSync(at("public/admin/config.yml"), "utf8"));
function ordered(fields, data) {
  if (Array.isArray(data)) return data.map((item) => ordered(fields, item));
  if (!data || typeof data !== "object") return data;
  const out = {};
  for (const field of fields) {
    if (!(field.name in data)) continue;
    out[field.name] = field.fields ? ordered(field.fields, data[field.name]) : data[field.name];
  }
  for (const key of Object.keys(data)) if (!(key in out)) out[key] = data[key]; // never drop anything
  return out;
}
let reordered = 0;
for (const collection of config.collections) {
  for (const file of collection.files || []) {
    const targets = file.file.includes("{{locale}}") ? LANGS.map((l) => file.file.replace("{{locale}}", l)) : [file.file];
    for (const target of targets) {
      const before = fs.readFileSync(at(target), "utf8").replace(/\r\n/g, "\n");
      const after = JSON.stringify(ordered(file.fields, JSON.parse(before)), null, 2) + "\n";
      if (after !== before) {
        fs.writeFileSync(at(target), after);
        reordered++;
      }
    }
  }
}
if (reordered) log.push(`${reordered} file(s) put in the order of the admin forms`);

console.log(log.length ? log.map((l) => `✓ ${l}`).join("\n") : "Nothing to migrate: the content is already in the Admin 2.0 layout.");

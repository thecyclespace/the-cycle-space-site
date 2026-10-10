// French editorial guard-rails: keeps calques, anglicisms and over-familiar phrases out of the French site.
// If a legitimate use appears (e.g. inside a quotation), reword it or add an explicit exception below.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCopy } from "./_content.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const fr = loadCopy("fr");

const BANNED = [
  [/\bpatterns?\b/i, "pattern → tendance / schéma / rythme"],
  [/\btrack(?:er|ing)\b/i, "tracker/tracking → journal, suivi"],
  [/\bwellness\b/i, "wellness → bien-être"],
  [/sautes? d'humeur/i, "sautes d'humeur → variations d'humeur"],
  [/\bgalère\b/i, "galère → période difficile"],
  [/\bbosser\b/i, "bosser → travailler"],
  [/ça colle/i, "ça colle → cela te convient"],
  [/\bpas juste\b/i, "pas juste → pas seulement"],
  [/\bbizarre\b/i, "bizarre → inhabituel"],
  [/plein de\b/i, "plein de → de nombreux"],
  [/pur désespoir/i, "expression à faire valider par Elsa"],
  [/mis(?:e|es)? en lumière peut se libérer/i, "calque de 'what gets surfaced gets released'"],
  [/délégation de ta santé/i, "calque de 'outsourcing your health'"],
  [/\bfertile window\b/i, "fenêtre fertile → période fertile"],
  [/\bbody literacy\b/i, "body literacy → connaissance de son corps"],
];

function strings(o, out = []) {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach((v) => strings(v, out));
  else if (o && typeof o === "object") Object.values(o).forEach((v) => strings(v, out));
  return out;
}

const FR_BLOG = fs
  .readdirSync(new URL("../src/content/blog/", import.meta.url))
  .filter((f) => f.endsWith(".md"))
  .map((f) => [f, read(`src/content/blog/${f}`)])
  .filter(([, raw]) => /^lang:\s*fr\s*$/m.test(raw))
  // style rules apply to what readers see (title, excerpt, body), not to technical frontmatter keys
  .map(([f, raw]) => [f, raw.replace(/^(?:tags|tool|lang|translation|draft|coverImage|date):.*\n(?:[ \t]+-.*\n)*/gm, "")]);

const TOOLS = fs.readdirSync(new URL("../src/components/tools/", import.meta.url)).filter((f) => f.endsWith(".jsx"));
const frBlock = (src) => (src.match(/\n  fr: \{[\s\S]*?\n  \},?\n/) || [""])[0];

test("fr.json: no banned expression (calques, anglicisms, over-familiar wording)", () => {
  const all = strings(fr);
  for (const [re, hint] of BANNED) {
    const hit = all.find((s) => re.test(s));
    assert.ok(!hit, `fr.json contains "${hit?.slice(0, 80)}" (${hint})`);
  }
});

test("French articles: no banned expression", () => {
  assert.ok(FR_BLOG.length >= 5);
  for (const [file, raw] of FR_BLOG) {
    for (const [re, hint] of BANNED) assert.ok(!re.test(raw), `${file}: ${hint}`);
  }
});

test("French strings of the tools: no banned expression", () => {
  for (const f of TOOLS) {
    const src = frBlock(read(`src/components/tools/${f}`));
    assert.ok(src.length > 200, `${f}: French block not found`);
    for (const [re, hint] of BANNED) assert.ok(!re.test(src), `${f}: ${hint}`);
  }
});

// The owner chose "vous" for the French site (October 2026). Elsa speaks as "je"; the reader is "vous".
const TU = /(?<![\p{L}'’-])(tu|te|toi|ton|ta|tes)(?![\p{L}-])|(?<!\p{L})t['’](?=\p{L})/iu;

test("vouvoiement only: no 'tu' form in the French copy, articles and tools", () => {
  const all = strings(fr)
    .concat(FR_BLOG.map(([, raw]) => raw))
    .concat(TOOLS.map((f) => frBlock(read(`src/components/tools/${f}`))));
  const hit = all.map((s) => s.match(new RegExp(`.{0,40}(?:${TU.source}).{0,40}`, "iu"))).find(Boolean);
  assert.ok(!hit, `tutoiement found: ${hit?.[0]}`);
});

test("the official CTAs and hero of the brief are in place", () => {
  assert.equal(fr.heroTitle, "Comprenez mieux votre cycle. Retrouvez confiance en votre corps.");
  assert.equal(fr.book, "Réserver un appel gratuit");
  assert.equal(fr.finalCta, "Réserver mon appel gratuit");
  assert.equal(fr.services[0].cta, "Réserver un appel gratuit");
});

test("French offers keep their Calendly actions (no commercial change)", () => {
  assert.deepEqual(fr.services.map((s) => s.action), ["intro", "checkin", "intro", "waitlist"]);
});

test("accessibility labels exist in French in the header", () => {
  const header = read("src/components/Header.jsx");
  for (const label of ["Ouvrir le menu", "Fermer le menu", "Passer en anglais", "Navigation principale"]) {
    assert.ok(header.includes(label), `Header.jsx lacks "${label}"`);
  }
});

// Feedback from first readers: "is it a doctor, a practitioner or an AI behind this?"
test("a real person speaks: Elsa is named, with her profession, at the top of the home page", () => {
  for (const key of ["heroKicker", "heroText"]) {
    assert.match(fr[key], /Elsa/, `${key} names Elsa`);
    assert.match(fr[key], /ostéopathe/i, `${key} states her profession`);
  }
  assert.match(fr.heroText, /\b(je|j')/i, "the hero is written in the first person");
  assert.match(fr.about.intro, /pas médecin/, "the About introduction says what Elsa is not");
  assert.match(fr.faq.items[0].a, /Elsa/, "the first FAQ answer says who is behind the site");
});

test("the method is explained in plain words on the home page", () => {
  assert.ok(fr.method.homeTitle && fr.method.intro.includes("Inner Rhythm"));
  for (const p of fr.method.phases) {
    assert.ok(p.homeTitle && !/^(Decode|Regulate|Reconnect|Embody)$/.test(p.homeTitle), `${p.title}: plain French name`);
    assert.ok(p.short && p.short.length >= 40 && p.short.length <= 130, `${p.title}: one concrete sentence`);
  }
  const home = read("src/pages/Home.jsx");
  assert.ok(home.indexOf("<Method />") < home.indexOf("t.concerns.title"), "the method comes right after the hero");
});

test("menopause is one of the 'what brings you here' cards, and the undecided have a way in", () => {
  assert.ok(fr.concerns.items.some((i) => /ménopause/i.test(i.title)), "menopause card");
  assert.ok(fr.concerns.unsure && fr.concerns.unsure.length > 40, "sentence for women who do not recognise themselves in a card");
});

test("the home page shows Elsa's own photo at the top, not a stock picture", () => {
  const home = read("src/pages/Home.jsx");
  const hero = home.slice(home.indexOf("1. Hero"), home.indexOf("<Method />"));
  assert.ok(hero.includes("images.elsaImage"), "hero uses Elsa's photo");
  assert.ok(!hero.includes("<Picture"), "no decorative picture in the hero");
});

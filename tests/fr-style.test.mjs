// French editorial guard-rails: keeps calques, anglicisms and over-familiar phrases out of the French site.
// If a legitimate use appears (e.g. inside a quotation), reword it or add an explicit exception below.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const fr = JSON.parse(read("src/content/i18n/fr.json"));

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

test("tutoiement only: no 'vous' form in the French copy", () => {
  const all = strings(fr).concat(FR_BLOG.map(([, raw]) => raw));
  const hit = all.find((s) => /(?<![-\w])(vous|votre|vos)(?![-\w])/i.test(s.replace(/The Cycle Space|Inner Rhythm/g, "")));
  assert.ok(!hit, `vouvoiement found: ${hit?.slice(0, 80)}`);
});

test("the official CTAs and hero of the brief are in place", () => {
  assert.equal(fr.heroTitle, "Comprends mieux ton cycle. Retrouve confiance en ton corps.");
  assert.equal(fr.book, "Réserver un appel gratuit");
  assert.equal(fr.trust, "15 à 20 minutes · En ligne · Français et anglais");
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

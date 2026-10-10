// The CMS rewrites an article's header in its own YAML style when Elsa saves it:
// the site must read every style the CMS can produce, not only the hand-written one.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseFrontmatter } from "../src/lib/frontmatter.js";

const fm = (header, body = "Hello") => parseFrontmatter(`---\n${header}\n---\n${body}`);

test("plain values, booleans, dates and arrays", () => {
  const { data, content } = fm('title: Hello\ndate: 2026-05-01T10:00:00.000Z\ndraft: false\nlang: fr\ntags: [a, "b c"]\ntool: ""');
  assert.deepEqual(data, { title: "Hello", date: "2026-05-01T10:00:00.000Z", draft: false, lang: "fr", tags: ["a", "b c"], tool: "" });
  assert.equal(content, "Hello");
});

test("a title containing a colon or quotes", () => {
  assert.equal(fm("title: SPM : par où commencer ?").data.title, "SPM : par où commencer ?");
  assert.equal(fm('title: "Le \\"bon\\" moment"').data.title, 'Le "bon" moment');
  assert.equal(fm("title: 'L''arrêt de la pilule'").data.title, "L'arrêt de la pilule");
});

test("a long text wrapped on several lines is read in full", () => {
  const plain = fm("excerpt: An introduction, and how it\n  can help you work with your body,\n  not against it.\nlang: en").data;
  assert.equal(plain.excerpt, "An introduction, and how it can help you work with your body, not against it.");
  assert.equal(plain.lang, "en");
  const quoted = fm('excerpt: "Un guide éducatif, mois par mois,\n  après l\'arrêt de la pilule."').data;
  assert.equal(quoted.excerpt, "Un guide éducatif, mois par mois, après l'arrêt de la pilule.");
});

test("block styles: folded (>) and literal (|)", () => {
  assert.equal(fm("excerpt: >-\n  Première ligne\n  deuxième ligne\ntitle: T").data.excerpt, "Première ligne deuxième ligne");
  assert.equal(fm("excerpt: |\n  Ligne 1\n  Ligne 2\ntitle: T").data.excerpt, "Ligne 1\nLigne 2");
});

test("block arrays and an empty value", () => {
  const { data } = fm('tags:\n  - welcome\n  - "body literacy"\ntranslation:\nlang: en');
  assert.deepEqual(data.tags, ["welcome", "body literacy"]);
  assert.deepEqual(data.translation, []);
  assert.equal(data.lang, "en");
});

test("Windows line endings", () => {
  const { data, content } = parseFrontmatter("---\r\ntitle: A\r\nexcerpt: one\r\n  two\r\n---\r\nBody");
  assert.equal(data.excerpt, "one two");
  assert.equal(content, "Body");
});

test("every article of the site has a complete header once parsed", () => {
  const dir = new URL("../src/content/blog/", import.meta.url);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const { data, content } = parseFrontmatter(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.ok(typeof data.title === "string" && data.title.length > 3, `${f}: title`);
    assert.ok(typeof data.excerpt === "string" && /[.!?»"]$/.test(data.excerpt.trim()), `${f}: excerpt looks cut: "${String(data.excerpt).slice(-40)}"`);
    assert.ok(["en", "fr"].includes(data.lang), `${f}: lang`);
    assert.ok(content.trim().length > 100, `${f}: body`);
  }
});

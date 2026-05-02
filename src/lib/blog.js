import { marked } from "marked";

// Charge tous les fichiers Markdown de src/content/blog/ au build (Vite import.meta.glob).
const modules = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Parser YAML frontmatter minimal — couvre la forme produite par Decap CMS :
// strings (avec/sans guillemets), booléens, dates ISO (laissées en string),
// arrays inline `[a, b]` ET arrays bloc avec `- item` sur lignes suivantes.
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: raw };
  const lines = m[1].split(/\r?\n/);
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const kv = line.match(/^([^:]+):(.*)$/);
    if (!kv) continue;
    const key = kv[1].trim();
    let val = kv[2].trim();

    if (val === "") {
      // Liste bloc : prochaines lignes "  - item"
      const items = [];
      while (i + 1 < lines.length) {
        const itemMatch = lines[i + 1].match(/^\s+-\s+(.+)$/);
        if (!itemMatch) break;
        let item = itemMatch[1].trim();
        if (/^(["']).*\1$/.test(item)) item = item.slice(1, -1);
        items.push(item);
        i++;
      }
      data[key] = items;
      continue;
    }

    if (/^\[.*\]$/.test(val)) {
      const inner = val.slice(1, -1).trim();
      data[key] = inner === "" ? [] : inner.split(",").map((s) => {
        const t = s.trim();
        return /^(["']).*\1$/.test(t) ? t.slice(1, -1) : t;
      });
    } else if (/^(["']).*\1$/.test(val)) {
      data[key] = val.slice(1, -1);
    } else if (val === "true") data[key] = true;
    else if (val === "false") data[key] = false;
    else data[key] = val;
  }
  return { data, content: m[2] };
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      date: toDate(data.date),
      excerpt: data.excerpt || "",
      coverImage: data.coverImage || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      tool: data.tool || null,
      lang: data.lang === "fr" ? "fr" : "en",
      draft: data.draft === true || data.draft === "true",
      bodyHtml: marked.parse(content || "", { async: false }),
    };
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null;
}

export function formatDate(date, lang = "en") {
  if (!date) return "";
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

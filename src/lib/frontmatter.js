// Small frontmatter reader for the articles (no Node dependency, runs in the browser).
// It understands what the CMS writes: plain and quoted strings, booleans, ISO dates (kept as strings),
// inline arrays `[a, b]`, block arrays (`- item`), and long texts wrapped on several lines
// (plain or quoted continuation lines, and the `>` / `|` block styles).

function unquote(value) {
  if (/^"[\s\S]*"$/.test(value)) {
    return value.slice(1, -1).replace(/\\(["\\/nt])/g, (_, c) => (c === "n" ? "\n" : c === "t" ? "\t" : c));
  }
  if (/^'[\s\S]*'$/.test(value)) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

function scalar(value) {
  if (/^\[.*\]$/.test(value)) {
    const inner = value.slice(1, -1).trim();
    return inner === "" ? [] : inner.split(",").map((s) => unquote(s.trim()));
  }
  if (/^(["'])[\s\S]*\1$/.test(value)) return unquote(value);
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: raw };
  const lines = m[1].split(/\r?\n/);
  const data = {};
  const indented = (l) => l !== undefined && (/^\s+\S/.test(l) || l.trim() === "");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const kv = line.match(/^([^\s:][^:]*):(.*)$/);
    if (!kv) continue;
    const key = kv[1].trim();
    let val = kv[2].trim();

    // Block array: following lines "  - item"
    if (val === "" && /^\s*-\s+/.test(lines[i + 1] || "")) {
      const items = [];
      while (i + 1 < lines.length) {
        const item = lines[i + 1].match(/^\s*-\s+(.+)$/);
        if (!item) break;
        items.push(unquote(item[1].trim()));
        i++;
      }
      data[key] = items;
      continue;
    }

    // Block text: `>` folds the lines into one paragraph, `|` keeps the line breaks
    const block = val.match(/^([>|])[+-]?$/);
    if (block) {
      const parts = [];
      while (indented(lines[i + 1])) parts.push(lines[++i].trim());
      data[key] = parts.join(block[1] === "|" ? "\n" : " ").trim();
      continue;
    }

    // Long text wrapped on the next lines (indented continuation lines)
    while (/^\s+\S/.test(lines[i + 1] || "") && !/^\s*-\s+/.test(lines[i + 1])) {
      const next = lines[++i].trim();
      val = val.endsWith("\\") ? val.slice(0, -1) + next.replace(/^\\/, "") : val ? `${val} ${next}` : next;
    }

    data[key] = val === "" ? [] : scalar(val);
  }
  return { data, content: m[2] };
}

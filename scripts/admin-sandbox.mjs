// Local sandbox for the admin (Sveltia CMS): try the configuration with the real content,
// without GitHub, without a token and without touching the repository.
//
//   node scripts/admin-sandbox.mjs        then open http://localhost:4321/admin/
//
// What it serves:
//   /admin/…                 the admin exactly as it will be published (public/admin)
//   /uploads/…, /…           the public folder (so that pictures show up in the admin)
//   /__repo__/manifest.json  the list of files an editor is allowed to change
//   /__repo__/file/<path>    one of those files, raw
//   POST /__repo__/out/<path>  receives a file saved inside the sandbox; it is written to
//                              .admin-sandbox/ (git-ignored) so it can be compared with the original
//
// Automated checks (tests/admin and the audit) copy those files into the browser's private
// file system and point Sveltia's "work with a local repository" mode at that copy.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 4321);
const OUT = path.join(root, ".admin-sandbox");
// The only places the admin may read or write (same list as tests/admin-config.test.mjs).
const EDITABLE = ["src/content", "public/uploads", "public/images/site"];
const EXTRA = ["public/admin/config.yml", "public/elsa.jpg", ".gitignore"];
// To investigate a problem seen with the real folder, more of the project can be copied (read-only use):
//   SANDBOX_ALSO=docs,tests,.admin-sandbox node scripts/admin-sandbox.mjs
const ALSO = (process.env.SANDBOX_ALSO || "").split(",").map((d) => d.trim()).filter((d) => d && fs.existsSync(path.join(root, d)));

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".yml": "text/yaml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".pdf": "application/pdf", ".woff2": "font/woff2",
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

const inside = (base, rel) => {
  const full = path.resolve(base, rel);
  return full === base || full.startsWith(base + path.sep) ? full : null;
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const p = decodeURIComponent(url.pathname);

    if (p === "/__repo__/manifest.json") {
      const files = EDITABLE.concat(ALSO).flatMap((d) => walk(d)).concat(EXTRA).filter((f) => fs.existsSync(path.join(root, f)));
      return send(res, 200, JSON.stringify(files), TYPES[".json"]);
    }
    if (p.startsWith("/__repo__/file/")) {
      const rel = p.slice("/__repo__/file/".length);
      const allowed = EDITABLE.concat(ALSO).some((d) => rel.startsWith(d + "/")) || EXTRA.includes(rel);
      const full = allowed && inside(root, rel);
      if (!full || !fs.existsSync(full)) return send(res, 404, "not found");
      return send(res, 200, fs.readFileSync(full), "application/octet-stream");
    }
    if (p.startsWith("/__repo__/out/") && req.method === "POST") {
      const full = inside(OUT, p.slice("/__repo__/out/".length));
      if (!full) return send(res, 400, "bad path");
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, Buffer.concat(chunks));
        send(res, 200, "ok");
      });
      return;
    }

    let rel = p === "/" ? "/admin/" : p;
    if (rel.endsWith("/")) rel += "index.html";
    const full = inside(path.join(root, "public"), "." + rel);
    if (!full || !fs.existsSync(full) || fs.statSync(full).isDirectory()) return send(res, 404, "not found");
    send(res, 200, fs.readFileSync(full), TYPES[path.extname(full).toLowerCase()] || "application/octet-stream");
  })
  .listen(PORT, () => console.log(`Admin sandbox: http://localhost:${PORT}/admin/  (saved files go to .admin-sandbox/)`));

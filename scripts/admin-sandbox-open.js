// Playwright helper: opens the admin sandbox (node scripts/admin-sandbox.mjs) signed in on a private,
// in-browser copy of the content. Nothing is read from or written to GitHub or to the working tree.
// Usage with the Playwright MCP: browser_run_code_unsafe { filename: "scripts/admin-sandbox-open.js" }
async (page) => {
  const BASE = "http://localhost:4321";
  await page.setViewportSize({ width: 1440, height: 900 });

  // Sveltia's "work with a local repository" mode asks for a folder: hand it the private copy.
  await page.addInitScript(() => {
    window.showDirectoryPicker = async () => {
      const root = await navigator.storage.getDirectory();
      return root.getDirectoryHandle("repo");
    };
    for (const proto of [FileSystemDirectoryHandle.prototype, FileSystemFileHandle.prototype]) {
      proto.queryPermission = async () => "granted";
      proto.requestPermission = async () => "granted";
    }
  });

  await page.goto(`${BASE}/admin/`, { waitUntil: "domcontentloaded" });
  const copied = await page.evaluate(async () => {
    const opfs = await navigator.storage.getDirectory();
    await opfs.removeEntry("repo", { recursive: true }).catch(() => {});
    const repo = await opfs.getDirectoryHandle("repo", { create: true });
    const write = async (rel, data) => {
      const parts = rel.split("/");
      let dir = repo;
      for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part, { create: true });
      const file = await (await dir.getFileHandle(parts.at(-1), { create: true })).createWritable();
      await file.write(data);
      await file.close();
    };
    await write(".git/HEAD", "ref: refs/heads/main\n");
    await write(".git/config", "[core]\n\trepositoryformatversion = 0\n");
    const files = await (await fetch("/__repo__/manifest.json")).json();
    for (const rel of files) await write(rel, await (await fetch(`/__repo__/file/${rel}`)).arrayBuffer());
    indexedDB.databases && (await indexedDB.databases()).forEach((db) => indexedDB.deleteDatabase(db.name));
    localStorage.clear();
    return files.length;
  });

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const buttons = await page.getByRole("button").allInnerTexts();
  const local = page.getByRole("button", { name: /dépôt local|local repository/i }).first();
  let opened = false;
  if (await local.count()) {
    await local.click();
    await page.waitForTimeout(4000);
    opened = true;
  }
  return { copied, buttons, opened, text: (await page.evaluate(() => document.body.innerText)).slice(0, 700) };
}

// Playwright helper: copies what the sandboxed admin has written (its private copy of the content)
// to .admin-sandbox/ so it can be compared with the repository:  git diff --no-index src/content .admin-sandbox/src/content
async (page) => {
  return page.evaluate(async () => {
    const repo = await (await navigator.storage.getDirectory()).getDirectoryHandle("repo");
    const sent = [];
    async function walk(dir, prefix) {
      for await (const [name, handle] of dir.entries()) {
        const rel = prefix ? `${prefix}/${name}` : name;
        if (name === ".git") continue;
        if (handle.kind === "directory") await walk(handle, rel);
        else {
          await fetch(`/__repo__/out/${rel}`, { method: "POST", body: await (await handle.getFile()).arrayBuffer() });
          sent.push(rel);
        }
      }
    }
    await walk(repo, "");
    return sent.length;
  });
}

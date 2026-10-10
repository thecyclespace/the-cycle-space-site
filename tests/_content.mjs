// Shared by the tests: reads the texts the way the site does (one file per page and language, merged).
import fs from "node:fs";

const dir = new URL("../src/content/pages/", import.meta.url);

export const PAGE_FILES = fs.readdirSync(dir).filter((f) => /^[a-z]+\.(en|fr)\.json$/.test(f)).sort();
export const PAGES = [...new Set(PAGE_FILES.map((f) => f.split(".")[0]))];
export const readPage = (page, lang) => JSON.parse(fs.readFileSync(new URL(`${page}.${lang}.json`, dir), "utf8"));

export function loadCopy(lang) {
  const all = {};
  for (const page of PAGES) {
    for (const [key, value] of Object.entries(readPage(page, lang))) {
      if (key in all) throw new Error(`"${key}" is defined in two page files (${lang})`);
      all[key] = value;
    }
  }
  return all;
}

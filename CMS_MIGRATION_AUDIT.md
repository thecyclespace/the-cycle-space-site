# CMS Migration Audit — The Cycle Space

**Date:** 2026-06-03
**Goal:** Replace the existing **Decap CMS + Netlify Identity / Git Gateway** setup with
**Sveltia CMS** using a **GitHub backend**, deployed on **GitHub Pages** (GitHub Actions, custom
domain `thecyclespace.com`) — 100% GitHub, no third-party host, no separate CMS server. Preserve
the existing design, layout, components, routing, animations and responsive behavior.

> **Hosting note:** an earlier pass targeted Vercel; on request the project is now **GitHub
> Pages only**. Vercel config was removed (see "Hosting: GitHub Pages only" below). The Sveltia
> CMS + GitHub backend is unaffected by the host — it commits to GitHub and the Pages Action rebuilds.

---

## 1. Framework & build tool

| Item | Finding |
|---|---|
| Framework | **Vite 5 + React 18** (SPA), **React Router 7** for routing |
| Language | JavaScript / JSX (no TypeScript) |
| Styling | Tailwind CSS 3 (+ `@tailwindcss/typography`), Framer Motion for animations |
| Package manager | **npm** (`package-lock.json` present, no `pnpm`/`yarn`/`bun` lockfiles) |
| Build command | `npm run build` → `vite build` (outputs to `dist/`) |
| Dev command | `npm run dev` → `vite` (port 5173) |
| Content loading | **Build-time**: JSON via native `import` ([src/lib/i18n.jsx](src/lib/i18n.jsx)), blog via `import.meta.glob('../content/blog/*.md', { eager: true, query: '?raw' })` ([src/lib/blog.js](src/lib/blog.js)) |

> This is a **Vite SPA**, not Next.js/Astro. There is no server runtime — all content is bundled
> at build time. That is exactly the model Sveltia CMS targets (Git-based, static, redeploy on commit).

## 2. Existing CMS

**The "heavy/paid" CMS = Decap CMS 3 + Netlify Identity + Git Gateway.**

| Where | What |
|---|---|
| [public/admin/index.html](public/admin/index.html) | Loads `decap-cms@^3.0.0` + `netlify-identity-widget` from CDN, plus a custom `preview.js` |
| [public/admin/config.yml](public/admin/config.yml) | `backend: git-gateway`, `publish_mode: editorial_workflow`, `local_backend: true` |
| [public/admin/preview.js](public/admin/preview.js) | Decap custom preview template (`CMS.registerPreviewTemplate` / `registerPreviewStyle`) |
| [public/admin/preview.css](public/admin/preview.css) | Stylesheet for the Decap preview iframe |
| [index.html](index.html) (root) | Loads `netlify-identity-widget` + a post-login redirect to `/admin/` |
| [netlify.toml](netlify.toml) | Netlify build config tuned to limit Git-Gateway-triggered build credits |

**No npm CMS dependency** — Decap and Netlify Identity are loaded from CDN only, so `package.json`
has **nothing to remove**. The migration is a CDN/script + config swap, not a dependency change.

**Why replace it:** Netlify Identity is being sunset and Git Gateway ties the project to Netlify's
build credits (the whole `netlify.toml` + editorial-workflow setup exists to ration 300 build
min/month). Sveltia CMS talks to GitHub directly (no Identity, no Git Gateway, no Netlify lock-in)
and is a drop-in replacement that reads the same `config.yml`.

**Not present (searched, none found):** Sanity, Contentful, Strapi, Builder.io, Prismic, TinaCMS,
Payload, Directus. No `studio/` folder, no CMS SDK imports, no CMS API clients, no CMS env vars.

## 3. Current content model (already file-based — no extraction needed)

The previous work already moved **all** editable content out of the components and into
`src/content/`. Nothing is hardcoded in components that needs migrating:

```
src/content/
├── i18n/
│   ├── en.json     # every English string on the site (nav, hero, manifesto, services, CTA, modal, footer…)
│   └── fr.json     # same, French
├── settings/
│   └── site.json   # siteName, bookingUrl (Calendly), contactEmail, instagramUrl, elsaImage, guide PDF…
├── seo/
│   └── seo.json    # title / description / OG (EN + FR)
└── blog/
    └── *.md        # 11 Markdown posts (articles + interactive-tool pages), YAML frontmatter
```

- **Texts:** `src/content/i18n/{en,fr}.json`, consumed by [src/lib/i18n.jsx](src/lib/i18n.jsx).
- **Blog:** `src/content/blog/*.md` with frontmatter, parsed in [src/lib/blog.js](src/lib/blog.js) (`marked`).
- **Images / media:** stored in `public/` (`elsa.jpg`, `Know_Your_Cycle_EN.pdf`) and `public/uploads/`
  (CMS upload target). Referenced by filename from the JSON/Markdown.
- **SEO:** `src/content/seo/seo.json` + per-route updates in [src/lib/seo.js](src/lib/seo.js).

> Because the content model is richer than (and already supersedes) the generic
> `/pages/*.md` template in the brief, we **keep the existing model** — it maps 1:1 to the
> real bilingual site and the React components already consume it. Re-shaping it into
> `pages/home.md` etc. would be a pointless rewrite that risks breaking the design.

## 4. Supabase usage

**Supabase is NOT used anywhere in this project.** A full-text search for `supabase` /
`SUPABASE` returns zero matches. There is no Supabase client, no env vars, no DB calls.
→ **Nothing to remove, nothing to preserve.**

Dynamic features that DO exist (and are unrelated to Supabase):
- **Guide PDF lead form** (`guide-download`) — currently wired to **Netlify Forms**
  ([src/components/GuideForm.jsx](src/components/GuideForm.jsx), hidden form in [index.html](index.html)).
  This is a Netlify platform feature, **not** part of the CMS. See "Out of scope / follow-ups" below.
- **Calendly booking modal** — external embed, no backend.
- **Cycle-tracking tools** — pure client-side (`localStorage`), no backend.

## 5. Risk assessment

**Safe to change (CMS-only):**
- `public/admin/index.html` — swap Decap+Identity script for the Sveltia script.
- `public/admin/config.yml` — switch backend `git-gateway` → `github`; drop Netlify-specific keys.
- `public/admin/preview.js` + `preview.css` — **delete** (Decap-specific; Sveltia forbids a separate
  preview stylesheet here and uses its own built-in preview).
- `index.html` (root) — remove the Netlify Identity widget + redirect (auth now handled by Sveltia).

**Must preserve (untouched):**
- All of `src/` (components, pages, lib, utils), Tailwind config, the entire visual identity.
- All content files in `src/content/` — they are the source of truth and already correct.
- The booking modal, the cycle tools, the guide form component, the existing routes.
- `public/uploads/` as the media folder (kept identical so existing image refs keep resolving).

**Files modified by this migration:**
- `public/admin/index.html`, `public/admin/config.yml`, `index.html` (root).
- `README.md` (docs updated), plus **new** `public/CNAME`, `CMS_GUIDE.md`, this audit file,
  and a `404.html` SPA fallback generated at build time (`vite.config.js`).

**Files deleted by this migration:**
- `public/admin/preview.js`, `public/admin/preview.css`.

**Netlify fully removed (second pass, on request):**
- Deleted `netlify.toml` and `public/_redirects`.
- Removed the hidden `guide-download` Netlify Forms `<form>` from root `index.html`.
- Removed the Netlify Forms POST (`captureLead`) from [src/components/GuideForm.jsx](src/components/GuideForm.jsx).
  → The guide **PDF download still works**; only the **email lead-capture** is disabled.
- Updated Netlify-referencing comments in `vite.config.js`.

**Hosting: GitHub Pages only (third pass, on request — Vercel dropped):**
- Deleted `vercel.json`.
- Deleted the stray `.github/workflows/jekyll-gh-pages.yml` (would have tried to build the repo as
  Jekyll and conflicted with the Vite build).
- Kept [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — it `npm run build`s and
  publishes `dist/` to GitHub Pages via GitHub Actions. Each push to `main` (incl. CMS commits) redeploys.
- Added [public/CNAME](public/CNAME) = `thecyclespace.com` (copied into `dist/` at build → domain persists).
- Added a `404.html` SPA fallback (copy of `index.html`) generated at build time in `vite.config.js`,
  since GitHub Pages has no rewrite engine.
- `base` stays `/` (custom domain at root) → all existing `/uploads/*` and `/elsa.jpg` paths keep working.
- One-time setup: repo **Settings → Pages → Source = GitHub Actions**, point DNS at GitHub Pages,
  enable **Enforce HTTPS**.

**Follow-ups (documented, not done — would need an external service/account):**
- **Email lead-capture** for the guide PDF must use an **external form service** (Formspree, Getform…)
  wired into `GuideForm.jsx` — GitHub Pages is fully static, so there is no serverless option.
  Does not affect the CMS or the build.

---

## Removed old CMS dependencies

| Dependency | How it was loaded | Reason removed | Files affected |
|---|---|---|---|
| `decap-cms@^3.0.0` | CDN `<script>` in `public/admin/index.html` | Replaced by Sveltia CMS (GitHub backend, no Netlify lock-in) | `public/admin/index.html` |
| `netlify-identity-widget` | CDN `<script>` in `public/admin/index.html` **and** root `index.html` | Sveltia authenticates to GitHub directly (PAT or OAuth) — Identity no longer needed | `public/admin/index.html`, `index.html` |
| Decap custom preview (`preview.js` + `preview.css`) | `<script src="/admin/preview.js">` | Decap-specific API; Sveltia uses its own built-in preview and a separate preview stylesheet is not used | `public/admin/index.html`; files deleted |
| `git-gateway` backend / `editorial_workflow` / `local_backend` | `public/admin/config.yml` keys | Netlify-specific; replaced by `backend: github`. Local dev now uses Sveltia's File System Access API (no proxy) | `public/admin/config.yml` |

> **No `package.json` dependencies were added or removed** — both the old (Decap) and new
> (Sveltia) CMS load entirely from CDN. `npm install` / `npm run build` are unaffected.

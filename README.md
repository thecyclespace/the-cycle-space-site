# The Cycle Space

Site web — éducation du cycle, santé féminine et accompagnement en ligne.

## Stack

- Vite + React 18
- Tailwind CSS 3
- Framer Motion
- **Sveltia CMS** (interface d'admin sur `/admin`, backend GitHub) — voir [CMS_GUIDE.md](CMS_GUIDE.md)
- Déploiement : **GitHub Pages** (GitHub Actions, domaine `thecyclespace.com`)

## Démarrer

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

## Build production

```bash
npm run build
npm run preview
```

## Configuration

- Couleurs et typographies : `tailwind.config.js`
- Polices Google Fonts (EB Garamond + Inter) : chargées dans `index.html`
- Lien Calendly, email, Instagram, image principale : éditables via le CMS (`/admin`, voir [CMS_GUIDE.md](CMS_GUIDE.md)) ou directement dans `src/content/settings/site.json`

## Bilingue

EN par défaut, bouton EN/FR dans le header. Les `<title>` et meta description sont mis à jour à la volée selon la langue.

---

## Contenu éditable via Sveltia CMS

Tous les textes, images, liens et métadonnées SEO du site sont stockés dans `src/content/` :

```
src/content/
├── pages/              # Les textes, un fichier par page et par langue
│   ├── home.fr.json     # (home, services, about, resources, shared)
│   └── home.en.json
├── settings/
│   └── site.json        # Calendly, email, Instagram, image, guide PDF
├── seo/
│   └── seo.json         # Title + description SEO (EN et FR)
└── blog/
    └── *.md             # Articles et outils interactifs (frontmatter YAML)
```

Ces fichiers sont **éditables via l'interface Sveltia CMS sur `/admin`** OU directement avec un
éditeur de texte. Le guide complet pour la personne qui édite le site est dans
**[CMS_GUIDE.md](CMS_GUIDE.md)**.

### Édition en local (sans rien déployer)

Sveltia CMS n'utilise **aucun proxy** (contrairement à l'ancien Decap). Il suffit de :

```bash
npm run dev
```

Puis ouvrir **http://localhost:5173/admin/** dans **Chrome ou Edge**. Sveltia utilise l'API
*File System Access* du navigateur pour lire/écrire directement les fichiers du dépôt local —
pas d'authentification, pas de serveur CMS, pas de `decap-server`.

---

## Déploiement GitHub Pages (100 % GitHub, aucun service tiers)

Le site est un SPA Vite statique, construit et publié par **GitHub Actions** sur **GitHub Pages**.
Le workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) fait `npm ci → npm run build`
puis publie `dist/`.

**Configuration (une seule fois) :**

1. Sur GitHub : **Settings → Pages → Build and deployment → Source = GitHub Actions**.
2. **Domaine personnalisé** : le fichier [public/CNAME](public/CNAME) (`thecyclespace.com`) est copié
   dans `dist/` au build, donc le domaine est conservé à chaque déploiement. Côté registrar DNS,
   pointer `thecyclespace.com` vers GitHub Pages (enregistrements `A` 185.199.108–111.153, et un
   `CNAME` `www → thecyclespace.github.io`). Cocher **Enforce HTTPS** dans Settings → Pages.
3. *(Optionnel)* Si tu changes de domaine, mets à jour `public/CNAME` **et** `VITE_SITE_URL`
   (sitemap + canonical SEO ; défaut `https://thecyclespace.com`).

**Fonctionnement :** à chaque `git push` sur `main` (y compris les commits créés par le CMS),
le workflow rebuild et publie automatiquement. Mise à jour en ligne ~1–2 min après.

**Fallback SPA :** le build génère `dist/404.html` (copie de `index.html`). GitHub Pages le sert
pour toute URL inconnue, donc les liens profonds (`/blog/...`, `/about`, …) ouvrent bien l'app et
React Router affiche la bonne page. `/admin/` est servi nativement (index de dossier).

> ℹ️ Limite GitHub Pages : un lien profond chargé directement renvoie un statut HTTP 404 (avec
> le contenu correct affiché). Sans serveur, c'est le seul fallback possible — sans impact pour
> les visiteurs ; les crawlers modernes indexent quand même via le `sitemap.xml`.

### Connexion au CMS en production

- **Simple (par défaut)** : sur `/admin`, bouton **« Sign In with Token »** → coller un
  GitHub Personal Access Token (droit *Contents: Read and write* sur le dépôt).
- **Confort (recommandé plus tard)** : OAuth GitHub via le **Sveltia CMS Authenticator** déployé
  sur Cloudflare Workers, puis renseigner `base_url:` dans `public/admin/config.yml`.

Détails pas-à-pas : **[CMS_GUIDE.md](CMS_GUIDE.md)**.

---

## Workflow CMS ↔ code local — éviter les conflits

Le CMS commit directement sur GitHub. Si tu travailles aussi en local sur le code, les deux flux
peuvent se croiser. Pour éviter les conflits Git : **toujours `git pull --rebase` avant de coder**,
et re-`pull --rebase` juste avant de `push`.

### Qui touche quoi — la séparation à respecter

**Zone CMS uniquement** — édite-les *toujours* via `/admin` (ou avec précaution en local) :

```
src/content/settings/site.json    # contact, calendly, instagram…
src/content/seo/seo.json          # titres et meta des pages
src/content/blog/*.md             # tous les articles et outils
src/content/pages/<page>.en.json   # textes EN, un fichier par page
src/content/pages/<page>.fr.json   # textes FR, un fichier par page
public/uploads/*                  # images uploadées via le CMS
```

**Zone code uniquement** — édite-les *toujours* en local + `git push` :

```
src/components/    src/lib/    src/pages/    src/utils/
package.json    vite.config.js    tailwind.config.js    .github/workflows/deploy.yml
public/admin/config.yml    public/admin/index.html    public/CNAME
index.html    src/App.jsx    src/main.jsx    src/index.css
```

En cas de conflit sur un fichier "content", **laisse gagner le CMS** (`git checkout --theirs …`) ;
sur un fichier "code", garde ta version locale (`git checkout --ours …`).

---

## Limites connues

- L'interface Sveltia CMS est en anglais (libellés du CMS lui-même). Les labels des champs du
  formulaire, eux, sont en français (définis dans `config.yml`).
- Les images uploadées via le CMS arrivent dans `public/uploads/`. Les images existantes
  (`public/elsa.jpg`) ne sont pas dans le sélecteur — saisis le
  nom du fichier à la main (ex. `elsa.jpg`).
- Le SEO bilingue (canonical, meta, OG, JSON-LD) est mis à jour côté client après hydratation.
  Les crawlers modernes (Google, Bing) exécutent le JS, donc le SEO fonctionne. Le canonical
  pointe vers `SITE_URL` ([src/lib/seo.js](src/lib/seo.js)) — surcharge via `VITE_SITE_URL`.
- **Formulaire guide PDF** : le téléchargement du PDF fonctionne, mais la **collecte des emails**
  (lead capture) a été retirée en même temps que Netlify. GitHub Pages étant 100 % statique (pas de
  serveur), la réactiver passe par un **service externe gratuit** type [Formspree](https://formspree.io)
  ou [Getform](https://getform.io), à brancher dans [src/components/GuideForm.jsx](src/components/GuideForm.jsx).
  Voir [CMS_MIGRATION_AUDIT.md](CMS_MIGRATION_AUDIT.md).

## Migration de l'ancien CMS

Ce projet utilisait auparavant **Decap CMS + Netlify Identity / Git Gateway**. La migration vers
Sveltia CMS (backend GitHub) est documentée dans **[CMS_MIGRATION_AUDIT.md](CMS_MIGRATION_AUDIT.md)**.
Aucune dépendance npm n'est concernée : l'ancien comme le nouveau CMS se chargent en CDN.

---

## Build, prérendu et tests (mis à jour)

- `npm run build` fait trois choses : build client (`vite build`), build serveur (`vite build --ssr src/entry-server.jsx`) puis `scripts/prerender.mjs`, qui écrit un fichier HTML par route (`dist/services/index.html`, `dist/blog/<slug>/index.html`…) avec titre, description, canonical, Open Graph et JSON-LD. Les nouveaux articles créés dans le CMS sont pris en compte automatiquement.
- `VITE_SITE_URL` (défini dans `.github/workflows/deploy.yml`) = URL publique utilisée pour canonicals, sitemap et données structurées. Aujourd'hui l'adresse `github.io` ; à remplacer par `https://thecyclespace.com` avec `base: "/"` et `public/CNAME` au moment de brancher le domaine (voir `NAMECHEAP_DNS.md`).
- `npm test` : tests des calculateurs, de la cohérence contenu/CMS et (après un build) du HTML généré.
- `scripts/mobile-audit.js` : audit mobile reproductible (voir `docs/PHASE1_MOBILE.md`).
- Documents : `AUDIT_BASELINE.md`, `docs/PHASE1_MOBILE.md`, `docs/PHASE2_CMS_CONVERSION.md`, `docs/PHASE3_SEO.md`, `docs/PHASE4_VERIFICATION.md`, `docs/PROPOSITIONS_CONTENU.md`, `GUIDE_ELSA.md`.
- Langues : anglais à la racine, français sous `/fr/` (langue lue dans l'URL, `hreflang` réciproque). Voir `docs/PHASE5_FR_EN_URLS.md`.
- Images : originaux dans `assets-source/` (hors dépôt) ; `python scripts/optimize-images.py` produit les versions AVIF/WebP de `public/images/site/` et le manifeste. Voir `docs/PHASE6_UX_REFRESH.md`.

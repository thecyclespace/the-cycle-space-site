# The Cycle Space

Site web — éducation du cycle, santé féminine et accompagnement en ligne.

## Stack

- Vite + React 18
- Tailwind CSS 3
- Framer Motion
- **Decap CMS 3** (interface d'admin sur `/admin`)

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
- Lien Calendly, email, Instagram, image principale : éditables via le CMS (`/admin`) ou directement dans `src/content/settings/site.json`

## Bilingue

EN par défaut, bouton EN/FR dans le header. Les `<title>` et meta description sont mis à jour à la volée selon la langue.

---

## Contenu éditable via Decap CMS

Tous les textes, images, liens et métadonnées SEO du site sont stockés dans `src/content/` :

```
src/content/
├── i18n/
│   ├── en.json          # Tous les textes en anglais
│   └── fr.json          # Tous les textes en français
├── settings/
│   └── site.json        # Calendly, email, Instagram, image, guide PDF
└── seo/
    └── seo.json         # Title + description SEO (EN et FR)
```

Ces fichiers sont **éditables via l'interface Decap CMS sur `/admin`** OU directement avec un éditeur de texte.

### Édition via Decap CMS en local (sans Netlify)

```bash
# Terminal 1
npx decap-server

# Terminal 2
npm run dev
```

Puis http://localhost:5173/admin/. En mode `local_backend`, les modifications du CMS s'écrivent directement dans `src/content/` — pas d'authentification, pas de Netlify.

---

## Déploiement Netlify + Decap CMS

Le site est conçu pour Netlify avec authentification via **Netlify Identity + Git Gateway**.

### ⚠️ Important — Consommation de credits Netlify

> **Chaque publication depuis l'admin déclenche un build de production Netlify.**
>
> Sur le free tier (300 minutes de build / mois), un build prend ~1 min. Si tu publies 50 modifications par mois, tu consommes ~50 minutes. Les optimisations ci-dessous sont **essentielles** pour rester dans le quota.

### Optimisations en place pour limiter les builds

| Optimisation | Effet | Où c'est défini |
|---|---|---|
| **Editorial workflow activé** | Les sauvegardes restent en brouillon. Seul un « Publish » explicite déclenche un build. Tu peux préparer plusieurs modifications puis publier en lot. | `public/admin/config.yml` → `publish_mode: editorial_workflow` |
| **Branch deploys + Deploy previews désactivés** | Les branches `cms/...` créées par Decap (brouillons) ne déclenchent **aucun build**. Seul le merge sur `main` déclenche un build. | `netlify.toml` (fast-fail `exit 1`) + dashboard Netlify |
| **`build.ignore` script** | Si un commit ne touche aucun fichier source pertinent (ex: changement de `README.md` uniquement), le build est sauté. | `netlify.toml` → `[build].ignore` |
| **Cache des assets hashés** | Les assets Vite sont servis avec `Cache-Control: max-age=1y` → bandwidth réduit côté visiteurs. | `netlify.toml` → `[[headers]]` |

### Configuration Netlify (à faire une fois)

1. **Connecter le dépôt GitHub à Netlify**
   - [app.netlify.com](https://app.netlify.com) → « Add new site » → « Import an existing project » → GitHub → `the-cycle-space-site`
   - Build command : `npm run build` (pré-rempli depuis `netlify.toml`)
   - Publish directory : `dist`
   - Branch : `main`

2. **Activer Netlify Identity**
   - Site settings → Identity → **Enable Identity**
   - Registration : **Invite only** (recommandé, sinon n'importe qui peut s'inscrire)
   - External providers : optionnel (Google si tu veux te connecter via ton compte Google)

3. **Activer Git Gateway**
   - Site settings → Identity → Services → **Enable Git Gateway**
   - Cela autorise Decap CMS à pousser des commits sur GitHub via Netlify, sans token GitHub côté client.

4. **🔥 IMPÉRATIF — Désactiver Deploy Previews et Branch Deploys** (économie de credits)
   - Site settings → Build & deploy → Continuous deployment → Deploy contexts → **Edit settings**
   - **Branch deploys** : `None`
   - **Deploy Previews** : `None`
   - Sans ce réglage, chaque sauvegarde de brouillon dans le CMS déclenche un build Netlify (×2 si Deploy Preview activé).

5. **Inviter les utilisateurs** (Elsa + toute autre personne devant éditer le contenu)
   - Site overview → Identity → **Invite users** → saisir l'email
   - Le destinataire reçoit un lien d'invitation, définit son mot de passe puis est redirigé vers `/admin/`.

6. **Activer la capture des leads (Netlify Forms)**
   - Le formulaire `guide-download` est déjà déclaré dans `index.html` — Netlify le détecte automatiquement au premier déploiement.
   - Site settings → **Forms** → vérifier que le formulaire `guide-download` apparaît dans la liste après le 1er déploiement.
   - Site settings → **Forms → Form notifications → Add notification** :
     - Type : **Email notification**
     - Event : **New form submission**
     - Form : `guide-download`
     - Email to notify : `thecyclespaceadmin@gmail.com`
   - Optionnel : Site settings → Forms → Spam filtering → activer reCAPTCHA si tu reçois trop de spam.
   - Quota : 100 soumissions/mois sur le free tier. Au-delà, payant.
   - Les soumissions sont aussi consultables dans Site overview → Forms → guide-download (CSV exportable).

### Workflow d'édition recommandé (anti-builds inutiles)

1. Connecte-toi sur `https://<ton-site>.netlify.app/admin/`
2. Modifie plusieurs entrées (textes EN, textes FR, paramètres, SEO…). Chaque sauvegarde reste **en brouillon** (badge `Draft`).
3. Quand tu es satisfaite de l'ensemble, clique **Publish** sur chaque brouillon — ou utilise « Status → Ready → Publish » dans l'onglet Workflow.
4. Decap merge les branches brouillons dans `main` → **un seul build Netlify est déclenché par cycle de publication**.
5. Le site est mis à jour ~1 min plus tard.

> 💡 Astuce : si tu modifies le même texte 5 fois avant d'être satisfaite, ce n'est pas grave — c'est le **Publish** qui déclenche le build, pas le **Save**.

### Migration depuis GitHub Pages

Le site était précédemment déployé sur GitHub Pages. Le `base` de Vite est passé de `/the-cycle-space-site/` à `/`.

Pour désactiver GitHub Pages (recommandé après vérification que Netlify fonctionne) :
- **Option A** : modifie `.github/workflows/deploy.yml` — supprime la ligne `branches: [main]` sous `push:` (ou supprime tout le bloc `push:`), garde `workflow_dispatch:` pour déclencher manuellement si besoin.
- **Option B** : supprime `.github/workflows/deploy.yml`.
- Le site GitHub Pages restera accessible mais ne sera plus mis à jour. Pour le supprimer définitivement : Repo settings → Pages → Source → None.

Si tu veux **garder GitHub Pages comme miroir** : remets `base: "/the-cycle-space-site/"` dans `vite.config.js` (mais alors le site Netlify sera cassé — on ne peut pas avoir les deux `base` en même temps).

---

## Workflow CMS ↔ code local — éviter les conflits

Le CMS Decap commit directement sur GitHub via Git Gateway. Si tu travailles aussi en local sur le code, les deux flux peuvent se croiser. Cette section explique comment éviter les conflits Git.

### Qui touche quoi — la séparation à respecter

**Zone CMS uniquement** — édite-les *toujours* via `/admin`, jamais en local :

```
src/content/settings/site.json    # contact, calendly, instagram…
src/content/seo/seo.json          # titres et meta des pages
src/content/blog/*.md             # tous les articles et outils
src/content/i18n/en.json          # tous les textes EN
src/content/i18n/fr.json          # tous les textes FR
public/uploads/*                  # images uploadées via le CMS
```

**Zone code uniquement** — édite-les *toujours* en local + `git push`, jamais via le CMS :

```
src/components/    src/lib/    src/pages/    src/utils/
package.json    vite.config.js    tailwind.config.js    netlify.toml
public/admin/config.yml    public/_redirects    public/robots.txt
index.html    src/App.jsx    src/main.jsx    src/index.css
```

Si tu respectes cette séparation, tu n'auras quasiment jamais de conflit Git.

### La règle d'or — toujours `pull --rebase` avant de coder

```bash
cd <repo>
git pull --rebase
```

Cela télécharge tous les commits CMS poussés depuis ta dernière session, et les rejoue avant tes modifications locales.

### Workflow type d'une session de code local

```bash
# 1. Début de session — sync down les modifs CMS
git pull --rebase

# 2. Travailler — modifier des fichiers de la zone "code"
git add <fichiers-modifiés>
git commit -m "..."

# 3. Avant de push — re-pull au cas où le CMS a publié pendant ta session
git pull --rebase
git push
```

### Si le push est rejeté (cas le plus fréquent)

Cela arrive quand le CMS a publié quelque chose depuis ton dernier pull :

```bash
git pull --rebase    # rejoue tes commits locaux par-dessus les commits CMS
git push             # cette fois ça passe
```

### Si un conflit éclate sur un fichier "content" (rare)

Si tu n'as pas respecté la séparation et qu'un conflit apparaît sur un fichier édité aussi via le CMS, **laisse gagner le CMS** (c'est lui la source de vérité du contenu) :

```bash
git checkout --theirs src/content/i18n/en.json
git add src/content/i18n/en.json
git rebase --continue
```

À l'inverse, si le conflit est sur un fichier "code" (ce qui ne devrait pas arriver), c'est ta version locale qui doit gagner :

```bash
git checkout --ours src/components/Header.jsx
git add src/components/Header.jsx
git rebase --continue
```

---

## Limites connues

- L'interface Decap CMS est en anglais (Decap 3 ne propose pas de traduction française complète des libellés du CMS lui-même).
- Les images uploadées via le CMS arrivent dans `public/uploads/`. Les images existantes (`public/elsa.jpg`, `public/Know_Your_Cycle_EN.pdf`) ne sont pas listées dans le sélecteur d'images du CMS — saisis le nom du fichier à la main pour les référencer (ex: `elsa.jpg`).
- Le SEO bilingue (canonical, meta, OG, JSON-LD) est mis à jour côté client après hydratation. Les crawlers modernes (Google, Bing) exécutent le JS, donc le SEO fonctionne. La balise canonical pointe toujours vers `SITE_URL` (défini dans `src/lib/seo.js`, par défaut `https://thecyclespace.com`) — surcharge possible via la variable d'env Netlify `VITE_SITE_URL` tant que le domaine définitif n'est pas branché.

## Améliorations possibles

- Mettre le SEO statique au build via `vite-plugin-html` (meilleur SEO pour les anciens crawlers).
- Ajouter un OAuth Google externe dans Netlify Identity (login plus simple pour Elsa).
- Connecter un domaine personnalisé (`thecyclespace.com`) dans Netlify et mettre à jour `site_url` dans `public/admin/config.yml`.

## Dépendances ajoutées pour le CMS

**Aucune.** Decap CMS et Netlify Identity sont chargés en CDN dans `public/admin/index.html` et `index.html`. Les fichiers de contenu sont importés en JSON natif (Vite supporte nativement les imports JSON).

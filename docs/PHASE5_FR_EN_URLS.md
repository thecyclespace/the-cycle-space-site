# Phase 5 — URL distinctes EN / FR

Branche `feature/fr-en-urls` (PR séparée, basée sur `improve/mobile-seo-cms-2026`).

## Principe

| | Avant | Après |
|---|---|---|
| Langue | Mémorisée dans le navigateur (`localStorage`), une seule URL par page | **Dans l'URL** : anglais à la racine (`/services/`), français sous `/fr` (`/fr/services/`) |
| URL anglaises existantes | — | **Inchangées** (aucune redirection nécessaire) |
| Articles français | `/blog/<slug>` | **`/fr/blog/<slug>`** ; l'ancienne URL est conservée en page de redirection (`meta refresh` + JS, `noindex`, canonical vers la nouvelle) |
| SEO | Google ne voyait que l'anglais ; pas de `hreflang` | Pages FR pré-rendues (`<html lang="fr">`, titre/description/canonical/OG français), `hreflang` **réciproque** (`en`, `fr`, `x-default`), sitemap bilingue avec `xhtml:link` |
| Bascule FR/EN (en-tête) | Changeait la langue sur place | Navigue vers **la même page** dans l'autre langue ; un article va à sa traduction (`translation`, dans les deux sens), sinon à la liste d'articles de l'autre langue (jamais de 404) |
| Hydratation | Cas particulier si la langue mémorisée était FR | Plus de cas particulier : le HTML pré-rendu correspond toujours à l'URL |

## Détails techniques

- `src/lib/paths.js` : `langFromPath`, `stripLang`, `localizedPath`, `postPath` (fonctions pures, testées).
- `src/lib/i18n.jsx` : la langue est lue dans l'URL ; `useI18n()` expose `path(p)` pour construire un lien dans la langue courante.
- `AppRoutes.jsx` : mêmes pages montées à la racine et sous `fr`.
- Un article n'existe qu'à l'URL de sa langue (`lang:` dans le frontmatter) : `/blog/<article-fr>` redirige vers `/fr/blog/<article-fr>`.
- Les liens internes écrits dans le Markdown (`[…](/services)`) sont convertis au chargement (base Vite + langue de l'article). Corrige au passage un défaut existant : ces liens ignoraient le sous-chemin `/the-cycle-space-site/`.
- Titres SEO français de `services` et `blog` rendus distincts de l'anglais (un titre unique par URL) : « Offres et accompagnement », « Articles et ressources ».
- Build : 19 pages pré-rendues + 5 pages de redirection ; sitemap de 19 URL.

## Vérifié

- `npm test` : **31/31** (dont : parité des `hreflang` — chaque alternate renvoie vers la page qui le déclare —, FR en `lang="fr"`, redirections d'anciens liens, aucun lien interne vers l'autre langue).
- Navigateur : bascule d'accueil/Services/article dans les deux sens, article sans traduction → liste FR, ancien lien FR → nouvelle URL, 404 en français, modale Calendly en français, aucun lien d'article hors langue.
- Audit mobile (7 largeurs × 11 routes dont 5 françaises) : 0 débordement, 0 erreur console. Un débordement trouvé grâce aux textes français plus longs (accueil FR à 320/360 px) a été corrigé.

## Ce qui change pour Elsa

- Un article en français est publié à `/fr/blog/<nom>`. Le CMS reste identique ; le champ « Langue de l'article » détermine l'URL.
- Pour relier deux versions : champ **Slug de l'article traduit** sur l'un OU l'autre (la liaison fonctionne dans les deux sens).
- Les textes du site se modifient toujours dans les deux collections « Textes du site — Français / Anglais ».

## Limites / à décider

- **Préférence de langue** : l'ancienne préférence mémorisée (`tcs_lang`) n'est plus utilisée. Les visiteurs reviennent sur la version de l'URL qu'ils ouvrent. Pas de redirection automatique selon la langue du navigateur (déconseillée pour le SEO) ; un lien « FR / EN » est présent dans l'en-tête. Un bandeau de suggestion de langue peut être ajouté plus tard si souhaité.
- Les liens déjà partagés vers un article français (`/blog/<slug-fr>`) fonctionnent grâce à la redirection ; Google les remplacera progressivement par les nouvelles URL.
- GitHub Pages sert `/fr` et `/fr/services` (sans slash) par une redirection 301 vers la version avec slash.
- Au moment de brancher le domaine, rien de spécifique à cette phase : `VITE_SITE_URL` suffit (canonicals, sitemap, hreflang en dépendent).

## Retour arrière

`git revert` des commits de la branche : retour à une URL unique par page, langue mémorisée. Les articles français retrouvent leur URL `/blog/<slug>`.

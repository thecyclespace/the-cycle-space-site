# Phase 3 — SEO technique

## 1. Ce qui a changé

| Sujet | Avant | Après |
|---|---|---|
| HTML initial | Coquille vide : titre, canonical, contenu uniquement après exécution de JS | **15 pages pré-rendues** (`dist/<route>/index.html`) : vrai `<title>`, description, canonical, Open Graph, JSON-LD et contenu dans le HTML. Aucune nouvelle dépendance : `react-dom/server` + un script (`scripts/prerender.mjs`) |
| Statut HTTP des routes profondes | `404` (fallback `404.html`) | **200** sur toutes les pages (dossiers `…/services/index.html`). Les URL inconnues restent en 404 (`404.html` = coquille, `noindex`) |
| Nouveaux articles | — | Pré-rendus **automatiquement** à chaque build (le CMS crée un `.md`, le build fait le reste) |
| Hydratation | La page pré-rendue était remplacée | Réutilisée (`hydrateRoot`), sauf visiteuses dont la langue mémorisée est le français (pas de décalage de contenu) |
| Canonical / URL | Domaine fixe, indépendamment de l'hébergement | **Une variable `VITE_SITE_URL`** (workflow GitHub) pilote canonical, Open Graph, sitemap et données structurées. Valeur actuelle : l'adresse `github.io`. À passer à `https://thecyclespace.com` quand le DNS sera branché |
| Slash final | incohérent | Canonical, sitemap et dossiers servis : tous avec `/` final |
| Sitemap | `lastmod` = date du build, brouillons inclus | `lastmod` **uniquement pour les articles** (date réelle), brouillons exclus |
| robots.txt | `/uploads/` bloqué (images d'articles non indexables) | `/uploads/` autorisé ; `/admin/` exclu |
| Données structurées | JSON-LD ajouté par JS | Dans le HTML initial : `Article` + `BreadcrumbList` (articles), `Person` (À propos), `FAQPage` (Services, questions réellement affichées). Source unique `lib/schemas.js` ; pas de doublon après chargement |
| Polices | CSS Google Fonts bloquant (requête vers Google à chaque visite) | **Auto-hébergées** (`public/fonts`, `src/fonts.css`, sous-ensemble latin FR/EN/PT/ES, préchargées) : plus aucune requête vers Google (meilleur pour la vie privée / RGPD) |
| Hero accueil | Apparition animée (texte invisible tant que JS n'a pas tourné) | Texte visible dès le HTML |

## 2. Ce qui n'a PAS changé

URL, slugs et dates des articles (aucun renommage, donc **aucune redirection nécessaire**), contenus, Calendly, outils. `base` Vite : toujours `/the-cycle-space-site/`. Aucun DNS touché.

## 3. Résultats

Lighthouse mobile (simulation 4G lente, build pré-rendu, page d'accueil) :

| | Avant (Phase 1) | Après |
|---|---|---|
| Performance | 85 | **96** |
| Accessibilité | 95 | **100** |
| Bonnes pratiques | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 2,9 s | 1,7 s |
| LCP | 3,6 s | **2,7 s** (cible : ≤ 2,5 s) |
| CLS | 0 | 0,013 |
| TBT | 60 ms | 30 ms |

**Ce sont des mesures de laboratoire** (une exécution, machine locale), pas des données de terrain : ne pas les présenter comme des Core Web Vitals réels. **Après auto-hébergement des polices** (médiane de 3 passages) : Performance 92, FCP 1,9 s, **LCP 3,2 s**. Le LCP de 2,7 s mesuré juste avant était flatté : dans la simulation, la police Google n'était pas encore chargée au moment de la mesure. Sans le préchargement des polices, le FCP monte à 2,4 s (donc conservé). Le LCP est désormais dominé par le poids du JavaScript (≈ 430 Ko, dont Framer Motion) sous réseau 4G lent simulé. Pistes : alléger/retirer Framer Motion (remplacer par CSS), `font-display: optional`. Non faites : changement de comportement visuel à valider.

Tests automatisés (`npm test`) : toutes les pages du sitemap existent, titres uniques, canonical = URL du sitemap, ≥ 300 caractères de texte et un `h1` dans le HTML initial, JSON-LD valide, pas de `lastmod` sur les pages statiques, `404.html` en `noindex`, aucun script Calendly dans le HTML initial.

## 4. Stratégie EN/FR : décision en attente (non migrée)

Le site sert une seule URL par page, la langue étant mémorisée dans le navigateur. Conséquences : Google voit la version **anglaise** ; pas de `hreflang` possible ; les articles français sont accessibles mais leur « version langue » n'est pas distincte d'une page d'accueil/Services anglaise.

Plan recommandé (non lancé, car il change les URL et exige validation) :

1. URL `/fr/…` pour le français, `/…` (ou `/en/…`) pour l'anglais ; langue déduite de l'URL, plus de `localStorage` comme source de vérité.
2. `hreflang` réciproque + `x-default`, canonical par langue, sitemap bilingue.
3. Redirection de l'ancien comportement : conserver les URL actuelles pour l'anglais (pas de redirection nécessaire) ; le français obtient de nouvelles URL.
4. Bouton FR/EN : navigue vers l'URL équivalente (déjà géré pour les articles via `translation`).
5. Effort estimé : 1 journée + tests. Aucun risque pour les URL existantes.

## 5. À faire / à valider

- **Domaine** : quand `thecyclespace.com` est branché → `VITE_SITE_URL=https://thecyclespace.com` dans `.github/workflows/deploy.yml`, `base: "/"` dans `vite.config.js`, recréer `public/CNAME`.
- **Google Search Console / Bing Webmaster** : à configurer par Elsa (propriété du domaine) ; soumettre `…/sitemap.xml`. Aucun chiffre de trafic n'est inventé.
- **Contenu éditorial** (douleurs menstruelles, SPM, SOPK…) : plan dans le document d'origine, **à rédiger et relire par Elsa avec sources médicales** ; non généré.
- Compléter la fiche `Person` (diplômes, titre) uniquement avec des éléments vérifiés par Elsa.

## 6. Rollback

`git revert` : le script de build revient à `vite build` seul (pas de pré-rendu), le site redevient une SPA classique. Aucun contenu touché.

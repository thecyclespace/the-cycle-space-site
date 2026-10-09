# AUDIT_BASELINE — Phase 0

Date : 9 octobre 2026 · Branche : `improve/mobile-seo-cms-2026` (créée depuis `main` @ `6dd2f42`)
Plan suivi : `THE_CYCLE_SPACE_PLAN_CLAUDE_CODE_CODEX.md`

## 1. État du dépôt

- Stack : React 18, Vite 5, Tailwind 3, Framer Motion 11, React Router 7 (SPA). Hébergement GitHub Pages (workflow `.github/workflows/deploy.yml`).
- `vite.config.js` : `base: "/the-cycle-space-site/"` (le domaine `thecyclespace.com` n'est **pas** branché ; `public/CNAME` retiré, voir `NAMECHEAP_DNS.md`).
- Contenu : `src/content/i18n/{en,fr}.json`, `settings/site.json`, `seo/seo.json`, `blog/*.md` (11 articles).
- CMS : Sveltia (`public/admin/`), backend GitHub + OAuth via Cloudflare Worker (`base_url` dans `config.yml`). **Non testé en ligne dans cette phase** (pas d'accès authentifié) — voir §5.
- Outils (inchangés, formules intactes) : calculateur de règles, phase du cycle, régularité, post-contraception, température basale.

## 2. Routes

| Route | Contenu | Remarque |
|---|---|---|
| `/` | Accueil (hero, manifeste, méthode, pour qui, calculateur, CTA) | |
| `/services` | 4 offres + méthode détaillée + parcours | |
| `/blog`, `/resources` | Ressources : guide PDF, outils, articles | `/resources` = même page que `/blog` |
| `/blog/:slug` | Article (Markdown) ou outil interactif | 11 slugs |
| `/about` | Présentation d'Elsa | |
| `*` | NotFound | servi via `404.html` (statut HTTP 404 sur Pages) |

## 3. Mesures de référence (avant Phase 1)

Outil : `scripts/mobile-audit.js` (Playwright, 7 viewports × 6 routes, dev server).

| Mesure | Avant |
|---|---|
| Débordement horizontal | **2 échecs** : `/services` à 320 px (+20 px), `/` à 768 px (+65 px) |
| Bouton menu mobile | **18 × 18 px** |
| Logo (lien accueil) | 242 × 32 px |
| Liens/boutons texte (CTA Services, Méthode, outil) | 20 px de haut |
| Hauteur du header à 390 px | 65 px |
| JS initial (build) | 492,9 Ko (gzip ≈ 156 Ko) — une seule chunk |
| Erreurs console | 0 |
| Hero | `min-h-[80vh]` (`vh`, sensible aux barres mobiles) ; titre fixe 2,75 rem |
| Formulaire du guide | Demande un email, enregistre l'adresse en `localStorage`, promet « l'occasion­nelle actualité » alors que **rien n'est transmis** |
| Animations | Framer Motion sans respect de `prefers-reduced-motion` |

Captures « avant » : `docs/audit/before/` (390 et 1440 px). Les captures pleine page ont été prises pendant un scroll animé : le header peut y apparaître décalé (artefact du test, pas du site).

## 4. Constats SEO / technique (non traités en Phase 1)

- Site 100 % client-side : le HTML initial ne contient ni titre par page, ni canonical, ni contenu d'article ; routes profondes servies avec **statut 404** par GitHub Pages (fallback `404.html`). → Phase 3.
- `sitemap.xml` : `lastmod` = date du build pour toutes les URL ; ne contient pas encore `hreflang`.
- `seo.js` : métadonnées mises à jour via JS uniquement.
- Langue EN/FR : un seul URL par page (langue en `localStorage`). → Phase 3.
- Domaine : `SITE_URL` pointe sur `https://thecyclespace.com`, alors que le site est actuellement servi sur `github.io/the-cycle-space-site/` → canonicals/OG incohérents tant que le DNS n'est pas fait. **Validation requise.**

## 5. Constats CMS (non traités en Phase 1)

- Format `nav` : `config.yml` attend `[{label, route}]`, les JSON contiennent un tableau de chaînes (EN) ou d'objets (FR). `Header.jsx` (`resolveNav`) accepte les deux formats → pas de régression, mais incohérence à réconcilier en Phase 2.
- Nouveaux champs ajoutés lors de la mise à jour de marque (offres, méthode, liens Calendly par offre) déjà déclarés dans `config.yml`.
- Connexion OAuth Cloudflare Worker et droits d'Elsa à tester en conditions réelles (Phase 2).

## 6. Calendly

- URL effective : `https://calendly.com/thecyclespaceadmin` (`site.json › bookingUrl`).
- `bookingUrlIntroduction` et `bookingUrlCheckIn` sont **vides** → toutes les offres ouvrent la même page Calendly.
- Constat réel (test 9/10) : l'URL ouvre **un seul type d'événement, « 30 Minute Meeting »**. Il n'existe donc pas encore d'événement distinct « Introduction » / « Rhythm Check-In ». **Action métier pour Elsa** : créer ces événements dans Calendly puis coller leurs liens dans le CMS (Réglages).

## 7. Risques identifiés

| Risque | Gravité | Statut |
|---|---|---|
| Promesse d'email non tenue (guide) | Haute (confiance / RGPD) | Corrigé Phase 1 |
| Zones tactiles trop petites | Moyenne | Corrigé Phase 1 |
| Débordements horizontaux | Moyenne | Corrigé Phase 1 |
| HTML non indexable / 404 sur routes profondes | Haute (SEO) | Phase 3 |
| Domaine / canonical incohérents | Moyenne | Décision à valider |
| Claims santé (« symptoms are signals », « regulate ») | À valider par Elsa | Non modifié |
| Mots de passe partagés en clair par messagerie | Haute | Hors code ; à changer + 2FA |

## 8. Changements autorisés sans arbitrage métier (appliqués en Phase 1)

Responsive, accessibilité tactile, performance front, honnêteté du formulaire. **Aucun texte clinique, prix, titre professionnel, URL Calendly ou DNS modifié.**

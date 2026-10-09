# Phase 4 — Vérification finale

Branche `improve/mobile-seo-cms-2026`. Build testé : `VITE_SITE_URL=https://thecyclespace.github.io/the-cycle-space-site npm run build` (celui du workflow).

## 1. Ce qui a été testé

| Contrôle | Méthode | Résultat |
|---|---|---|
| Build complet (client + SSR + pré-rendu) | `npm run build` | OK, 15 routes pré-rendues, sitemap 15 URL |
| Tests automatisés | `npm test` | **23/23** (calculateurs, contenu/CMS, sortie du build) |
| Pages sans JavaScript | Playwright `javaScriptEnabled:false`, mobile 390 px | `/`, `/services/`, `/about/`, article : statut 200, `h1` et texte présents |
| Avec JavaScript | Playwright, 9 routes × 2 viewports | Aucune erreur ni avertissement console ; hydratation sans erreur ; menu mobile ouvre/ferme (Échap) ; JSON-LD sans doublon |
| Langue française mémorisée | `localStorage tcs_lang=fr` | Page rendue en français (`html[lang=fr]`), sans erreur |
| Mobile | `scripts/mobile-audit.js`, 7 viewports (320 → 1440) × 6 routes | **0 débordement horizontal**, 0 erreur console, 0 cible tactile < 44 px (hors liens dans un paragraphe et champ anti-bot) |
| Formulaire du guide | Playwright, appel FormSubmit **simulé** (aucun email réel envoyé) | Email invalide → erreur ; sans consentement → erreur et **aucun appel réseau** ; succès → PDF + payload `{email, language, consent, source}` ; échec réseau → PDF quand même + message honnête ; téléchargement direct OK |
| Calendly | Modale ouverte à 320×568 | Calendrier chargé et défilant ; Échap ferme ; URL inchangée |
| Lighthouse mobile (lab) | Accueil, build pré-rendu | Perf 92 · A11y 100 · Bonnes pratiques 100 · SEO 100 · LCP 3,2 s · FCP 1,9 s (après polices auto-hébergées, voir PHASE3) |
| Calculateurs | Tests de caractérisation (année bissextile 2024, cycles 21/45 jours, dates invalides, tri) | Comportement actuel verrouillé ; **aucune formule modifiée** |

## 2. Ce qui n'a PAS été testé (à faire avant fusion)

- Vrai iPhone / vrai Android, Safari iOS, clavier virtuel recouvrant un bouton.
- Connexion `/admin` (OAuth Cloudflare), publication réelle depuis le CMS, test utilisateur « non-tech » des 5 scénarios.
- Réception réelle d'un email FormSubmit (nécessite l'activation par Elsa).
- Lecteurs d'écran (NVDA/VoiceOver) ; seul un contrôle clavier et Lighthouse (100) ont été faits.
- Core Web Vitals **terrain** (aucune donnée, site non indexé).
- Workflow GitHub Actions en conditions réelles (le build local utilise les mêmes commandes ; `package-lock.json` inchangé, aucune dépendance ajoutée).
- Liens externes (Instagram, Calendly) et PDF hors du navigateur de test.
- Écran « booking » après sélection d'un événement Calendly : un seul événement existe (« 30 Minute Meeting »).

## 3. Critères d'acceptation du plan

| Domaine | État |
|---|---|
| Mobile (pas de scroll horizontal, cibles ≥ 44 px) | ✅ mesuré |
| Navigation (menu, langues, Services) | ✅ |
| Calendly (URL conservée, fallback) | ✅ inchangé ; tests d'URL |
| Outils (mobile + avertissements) | ✅ pas de débordement ; avertissements existants conservés |
| Elsa autonome | 🟡 configuré et documenté ; **non testé en conditions réelles** |
| CMS compatibilité | ✅ test automatique (aucun champ orphelin / cassé) |
| Blog (brouillons, traductions) | ✅ test des traductions ; publication réelle non testée |
| SEO (HTML indexable, canonicals, sitemap, robots) | ✅ ; **EN/FR (hreflang) non fait** — décision requise |
| Vitesse | 🟡 mesurée en lab ; LCP 3,2 s (> 2,5 s) : à améliorer (poids JS) |
| A11y | 🟡 Lighthouse 100 + clavier ; pas de lecteur d'écran |
| Sécurité | ✅ aucun secret committé ; aucune donnée de cycle envoyée |
| Maintenance | ✅ aucune dépendance ajoutée |

## 4. Décisions restantes

Domaine et date de bascule DNS · destinataire des inscriptions et outil d'emailing · prix · titres professionnels · formulations santé · page de confidentialité · migration d'URL EN/FR · photo et parcours d'Elsa. Détails : `docs/PROPOSITIONS_CONTENU.md`, `docs/PHASE3_SEO.md`.

## 5. Déploiement et retour arrière

- **Avant de fusionner** : relire la PR, tester sur un vrai téléphone via l'aperçu, activer FormSubmit (envoyer un test d'inscription et cliquer le lien reçu), vérifier le CMS avec Elsa. Comparer `main` pour ne pas écraser d'éditions CMS récentes (les fichiers de contenu sont les seuls partagés : `src/content/**` et `public/admin/config.yml`).
- **Déploiement** : la fusion dans `main` déclenche le workflow existant (aucun changement d'hébergeur).
- **Retour arrière** : `git revert -m 1 <merge>` (ou revert des 4 commits de la branche). Site et CMS reviennent à l'état précédent, sans perte de contenu. Pour désactiver seulement le pré-rendu : remettre `"build": "vite build"` dans `package.json`.

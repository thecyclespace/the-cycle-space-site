# Phase 1 — Mobile, réservation, erreurs prioritaires

Branche `improve/mobile-seo-cms-2026`. Audit de départ : `AUDIT_BASELINE.md`.
Reproduire les mesures : lancer `npm run dev -- --port 5199`, puis exécuter `scripts/mobile-audit.js` avec Playwright (`browser_run_code_unsafe`).

## 1. Ce qui a changé

| Sujet | Changement | Fichiers |
|---|---|---|
| Menu mobile | Bouton 44×44, `aria-controls`, fermeture par Échap et à chaque navigation, liens 48 px, défilement interne si écran court, `openBooking("intro")` explicite | `components/Header.jsx` |
| Header | Plus compact en mobile (61 px au lieu de 65 px, logo cliquable 44 px) | `components/Header.jsx` |
| Débordements | Titres responsives (`clamp()` pour le hero, `break-words`, paliers `sm/md/lg`), `min-w-0` sur les grilles | `pages/Home.jsx`, `Services.jsx`, `About.jsx`, `BlogList.jsx`, `BlogPost.jsx`, `NotFound.jsx`, `components/Method.jsx`, `FinalCTA.jsx` |
| Hero | `svh` au lieu de `vh`, titre fluide, pastille décorative masquée en mobile (elle recouvrait le kicker) | `pages/Home.jsx`, `components/ui.jsx` |
| Lisibilité | Texte courant des cartes Services et Méthode passé à 16 px en mobile | `Services.jsx`, `Method.jsx` |
| Zones tactiles | CTA texte à 44 px minimum (Services, Méthode, Accueil, retour blog) | idem |
| Calendly (modale) | Plein écran en mobile (`100dvh`), en-tête compact, description masquée < 640 px, bouton fermer 44 px, zone du calendrier défilante. **URL, chargement à la demande et fallback inchangés.** | `components/BookingModal.jsx` |
| Formulaire du guide | Téléchargement direct, **plus de champ email** ni de stockage `localStorage` : la promesse « on t'enverra des nouvelles » n'était pas tenue. Textes EN/FR corrigés | `components/GuideForm.jsx`, `i18n/en.json`, `fr.json` |
| Performance | Routes Services / À propos / Blog / Article en `React.lazy` : JS initial **492,9 Ko → 423,6 Ko** (gzip ≈ 156 → 139 Ko). Les outils (calculateurs) sont dans le chunk Article | `App.jsx`, `Layout.jsx` |
| Animations | `MotionConfig reducedMotion="user"` + `scroll-behavior: smooth` seulement si `prefers-reduced-motion: no-preference` | `App.jsx`, `index.css` |
| Accessibilité | Focus visible global (`:focus-visible`), messages d'erreur des outils plus contrastés (`#9B2F2F` sur fond clair) | `index.css`, `components/tools/*` |

## 2. Ce qui n'a PAS changé

- Calendly : `bookingUrl` et son fallback, chargement du widget à la demande, paramètres de couleur.
- Calculateurs : toutes les formules, règles et avertissements. Seule la couleur des messages d'erreur a été modifiée.
- Identité visuelle (palette, typographies, logos), textes de marque, articles, slugs, CMS (`config.yml` non modifié dans cette phase), PDF du guide.

## 3. Résultats (même script, avant → après)

| Mesure | Avant | Après |
|---|---|---|
| Débordement horizontal (7 viewports × 6 routes) | 2 échecs | **0** |
| Bouton menu | 18×18 px | 44×44 px |
| Cibles < 44 px sur Accueil / Services / Blog / À propos (390 px) | 4 / 6 / 2 / 2 | **0 / 0 / 0 / 0** |
| Cibles < 44 px sur un article | 3–5 | 0–2 (liens **dans** un paragraphe, exemptés) |
| JS initial | 492,9 Ko | 423,6 Ko |
| Erreurs console | 0 | 0 |
| Modale Calendly 320×568 | calendrier réduit à ~150 px | calendrier visible et défilant ; Échap ferme |

Captures : `docs/audit/before/` et `docs/audit/after/` (390 et 1440 px ; `320-menu.png`, `320-calendly.png`, `390-hero-viewport.png`).

**Limites des mesures** : tests réalisés dans Chromium émulé (pas de Safari iOS ni de vrai Android), serveur de développement, aucune donnée de terrain. Lighthouse / Core Web Vitals n'ont pas été mesurés dans cette phase ; ne pas les citer comme acquis.

## 4. Parcours vérifié

Accueil → menu → Services → « Book a Rhythm Check-In » → modale Calendly (iframe chargé, « 30 Minute Meeting » visible) → Échap. Aussi : menu ouvert/fermé par Échap et après navigation, à 320 px.

> **Mise à jour Phase 2** : le formulaire du guide a ensuite été rétabli avec un envoi réel à Elsa, un consentement explicite et un téléchargement indépendant de l'envoi (voir `docs/PHASE2_CMS_CONVERSION.md`).

## 5. À valider / à faire par Elsa ou Florent

1. Créer dans Calendly les événements « Introduction » (15–20 min) et « Rhythm Check-In » (90 min), puis coller leurs liens dans le CMS (Réglages). Aujourd'hui un seul événement existe (« 30 Minute Meeting »).
2. Formulaire du guide : si une liste d'emails est souhaitée, choisir un prestataire (Brevo, MailerLite…) et un texte de consentement. Rien n'est collecté en attendant.
3. Tester sur un vrai iPhone et un vrai Android avant fusion.

## 6. Rollback

Aucun changement de données ni de configuration. `git revert <commit>` de la phase, ou ne pas fusionner la branche. Le formulaire de guide précédent est dans l'historique (`GuideForm.jsx`).

# Phase 6 — Refonte UX/UI ciblée (desktop + mobile)

Branche `design/ux-refresh` (basée sur `feature/fr-en-urls`). Direction : **montrer avant d'expliquer**. Pas de refonte totale : React/Vite, composants, palette, logo, Calendly, outils, CMS, blog, EN/FR et URL sont conservés.

## 1. Résultats mesurés (même script avant/après)

| Mesure | Avant | Après |
|---|---|---|
| Accueil mobile (390 px) : mots visibles | 532 | **230 (−57 %)** |
| Accueil mobile : hauteur de page | 6 948 px | 5 449 px (−22 %) |
| Accueil desktop (1440 px) : mots visibles | 540 | 292 (−46 %) |
| Services mobile : mots visibles (hors détails repliés) | 906 | 640 (−29 %) |
| Services mobile : hauteur de page | 9 385 px | **5 985 px (−36 %)** (méthode repliée en accordéon) |
| Lighthouse mobile (accueil, labo) | Perf 94 · LCP 3,0 s | **Perf 96–97 · LCP 2,6–2,7 s** · A11y/BP/SEO 100 |
| Lighthouse desktop | 100 · LCP 0,6 s | 100 · LCP 0,6 s |
| Poids transféré (accueil) | n/m | 324 Ko, images comprises |
| Débordements horizontaux (7 largeurs × 11 pages) | 0 | 0 |
| Erreurs console | 0 | 0 |
| Tests automatiques | 31 | **39** |

Captures : `docs/audit/ux-before/` et `docs/audit/ux-after/` (390 et 1440 px : accueil, services, à propos, accueil FR). Mesures de **laboratoire** (simulation 4G lente), pas des données de terrain. Le LCP mobile reste à ≈ 2,6 s (cible 2,5 s).

> « −50 à 65 % de texte » : atteint sur l'accueil mobile (−57 %). Sur Services, le texte détaillé n'est pas supprimé : il est replié (« Voir le détail ») et la méthode en 4 phases reste complète.

## 2. Ce qui a changé

**Accueil** (7 sections au lieu de 6 blocs denses) : 1) hero éditorial (titre, une phrase, appel gratuit, une photo) ; 2) « Qu'est-ce qui t'amène ? » (6 cartes à icône) ; 3) méthode Inner Rhythm compacte (4 cartes) ; 4) présentation d'Elsa ; 5) trois offres ; 6) outil gratuit (teaser avec image) ; 7) appel final sur paysage doux.

**Services** : fiches simples (nom, durée, prix si renseigné, bénéfice en 1 phrase, « pour qui », bouton) ; description complète, public et livrable dans un panneau « Voir le détail » (texte toujours dans le HTML). La méthode détaillée, le parcours et la FAQ sont conservés.

**À propos** : plus humaine et plus courte au premier écran (photo, présentation en 2 phrases, qualifications, bouton). Le manifeste (« This is not symptom management… ») et « Tu es probablement au bon endroit si… / Ce n'est peut-être pas pour toi… » y ont été **déplacés depuis l'accueil** (aucun texte supprimé). L'histoire personnelle est repliée sur téléphone, ouverte sur grand écran.

**Navigation mobile** : bouton « réserver » flottant et discret, affiché seulement après le premier écran, masqué quand la fenêtre de réservation est ouverte ou qu'un champ de formulaire a le focus (il ne recouvre jamais un champ ni le clavier). Menu, bascule EN/FR et zones tactiles inchangés (Phase 1).

**Images** (4 sur l'accueil + la vraie photo d'Elsa) :
- Pipeline `scripts/optimize-images.py` : PNG de 2–3 Mo → AVIF + WebP en 3 largeurs (480/800/1200 px). Le hero fait **15 Ko** (AVIF, mobile) au lieu de 2,2 Mo. 10 images publiées (2,4 Mo au total). Les 20 originaux restent **hors dépôt** dans `assets-source/` (ignoré par Git, jamais déployé).
- `<Picture>` : `<picture>` AVIF → WebP, `srcset`/`sizes`, `width`/`height`, `object-position` (visage préservé), hero **sans lazy loading** et préchargé dans le HTML.
- Textes alternatifs descriptifs (modifiables, EN/FR) ; images d'ambiance en `alt=""`.
- `babu.png` (2 Mo, image de couverture de l'article « Welcome ») converti en WebP de 69 Ko ; l'article a été mis à jour.
- Affectation retenue : hero = 01 ; consultation en ligne = 04 (prévue, non affichée à ce stade) ; outil = 08 ; bandeau final = 20 ; ambiance Services = 09 ; ambiance Ressources = 07. Non utilisées : 02 (corps, jugée trop intime), 17 (contient du texte intégré à l'image, anglais seulement), 10/12/14 (références d'icônes : les icônes ont été redessinées en SVG sur le même principe).

**Design** : hero crème avec photo chaude (au lieu du fond sombre), alternance crème / sable / brun foncé, titres moins gigantesques (hero 6xl max), cartes arrondies, ombres légères, une seule animation discrète (apparition au scroll, désactivée si « mouvement réduit »). Palette de la charte inchangée.

## 3. Ce qui n'a PAS changé

Liens et parcours Calendly (testés, ci-dessous), calculateurs (formules, avertissements), blog et articles, URL, hreflang, EN/FR, SEO existant (un `h1` par page, métadonnées, JSON-LD), CMS Sveltia, workflow GitHub Pages. Aucune dépendance ajoutée.

## 4. Vérifications

- **Calendly** : 4 points d'entrée testés (hero EN, Services « Rhythm Check-In » et « Introduction » EN, carte d'accueil FR) : la fenêtre s'ouvre et charge `https://calendly.com/thecyclespaceadmin` (URL inchangée, un seul type d'événement existe encore : voir `AUDIT_BASELINE.md`).
- **Cartes « Qu'est-ce qui t'amène ? »** : toutes mènent à une page existante, en EN et en FR (tests automatiques + navigateur).
- **Bouton flottant** : invisible en haut de page, visible après défilement, masqué pendant la saisie.
- **Tests** : `npm test` 39/39 (dont : images existantes et légères, aucune image lourde dans `public/`, textes alternatifs, icônes/liens des cartes valides, hero court).
- **Build** : `npm run build` OK (19 pages pré-rendues).

## 5. Ce qu'Elsa peut modifier (sans code)

Voir `GUIDE_ELSA.md` : titre/sous-titre du hero, cartes « Qu'est-ce qui t'amène ? » (intitulé, icône, destination par liste déroulante), présentation d'Elsa, offres (résumé, public, détail, prix), intertitres de À propos, **images principales** (menu « 🖼 Images du site »), textes alternatifs, liens Calendly, articles.

## 6. À valider / limites

1. **Textes du hero (proposés, à valider par Elsa)** : « Understand your cycle. Feel better in your body. » / « Personalised support for periods, PMS and hormonal changes. » / « Book a free call ». Réassurance : j'ai écrit **« 15–20 min »** (durée réelle de l'Introduction d'après Elsa) au lieu de « 20 minutes ». Traduction française proposée : « Comprends ton cycle. Sens-toi mieux dans ton corps. ». Les anciens textes restent dans l'historique Git.
2. **Photo d'Elsa** : `elsa.jpg` ne fait que **400 × 400 px** (affichée à ≈ 300–420 px) : correcte aujourd'hui, floue sur écran Retina. Fournir une photo de 1200 px minimum améliorera nettement la page. Elle ne doit pas être remplacée par une image générée (non fait).
3. **Images générées par IA** (ambiance) : à signaler comme telles si la réglementation ou l'éthique de la marque l'exige ; ne pas les présenter comme des clientes ou des témoignages.
4. **Qualifications** affichées : reprises telles quelles des textes existants (non vérifiées de mon côté).
5. **Outil gratuit** : le calculateur n'est plus intégré dans l'accueil (carte + bouton vers l'article qui le contient, inchangé). À valider : certains préfèrent garder l'outil directement sur l'accueil.
6. **Veille concurrentielle** (Clue, Flo, Holland & Barrett) : **non réalisée** ; la direction suit le brief et les bonnes pratiques mobiles, sans analyse de ces sites.
7. **Prix** : champ prévu, aucun prix inventé.
8. **Services mobile** : la méthode détaillée (4 phases) est repliée en accordéon sur téléphone (bouton « Voir le détail », `aria-expanded`) et toujours affichée dès la largeur tablette ; le texte reste dans la page.
9. **Mesures** : labo uniquement ; pas de vrai iPhone/Android ni de lecteur d'écran dans cette phase.

## 7. Retour arrière

`git revert` des commits de la branche. Les anciens contenus (hero, manifeste, listes) sont dans l'historique ; les images d'origine sont dans `assets-source/` (local).

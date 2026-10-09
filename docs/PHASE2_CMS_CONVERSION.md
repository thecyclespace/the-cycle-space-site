# Phase 2 — Autonomie d'Elsa et conversion

## 1. Ce qui a changé

| Sujet | Changement | Fichiers |
|---|---|---|
| Collecte des adresses du guide | Formulaire réel : email + **case de consentement** (texte indique que l'email va à Elsa), envoi par email à Elsa via **FormSubmit** (service gratuit pour sites statiques, sans compte), champ anti-bot, **le téléchargement ne dépend jamais de l'envoi**, lien « Télécharger sans email ». Seuls email, langue et consentement sont transmis, **aucune donnée de santé**. | `components/GuideForm.jsx`, `i18n/*.json`, `settings/site.json › guideLeadEmail` |
| CMS : schéma | Format `nav` unifié (`[{label, route}]` dans EN et FR, comme attendu par le CMS ; `Header` accepte toujours les anciens formats). Champs `mobileHeroTitle/Text` manquants côté FR ajoutés au CMS. | `i18n/en.json`, `public/admin/config.yml` |
| CMS : nouveaux champs | Prix affiché (optionnel) par offre, FAQ (questions/réponses), champs du formulaire guide, email de réception des inscriptions, SEO par page (Services, Ressources, À propos) | `public/admin/config.yml` |
| CMS : sécurité de saisie | Liens Calendly validés (`https://calendly.com/…` ou vide), email validé, action des boutons en liste déroulante : Elsa ne peut pas casser un bouton | `public/admin/config.yml` |
| Page Services | Prix affiché si renseigné, FAQ en accordéons (`<details>`, accessibles au clavier) | `pages/Services.jsx` |
| Guide d'Elsa | 5 scénarios, FAQ, consignes | `GUIDE_ELSA.md` |
| Tests CMS | Aucune clé de contenu orpheline (chaque texte du site est éditable), parité EN/FR, offres valides, liens Calendly valides | `tests/content.test.mjs` |

Le test de compatibilité a fait remonter un **vrai défaut existant** (champs mobile du hero absents du CMS français) : corrigé.

## 2. Ce qui n'a PAS changé

- Calendly (URL, modale, fallback), calculateurs, collections CMS existantes (noms et fichiers inchangés : aucun contenu perdu), authentification OAuth, textes de marque.
- **Pas de refonte du CMS en back-office sur mesure** : Sveltia reste l'outil. Les collections gardent leur structure (un fichier JSON par langue). Découper un même fichier en plusieurs « menus » risquait d'écraser des champs à l'enregistrement : non fait, voir §4.

## 3. Ce qu'Elsa peut modifier seule

Textes d'accueil, offres (titre, descriptif, public, résultat, prix, bouton), FAQ, méthode en 4 phases, liens Calendly par offre, email de contact et de réception du guide, image principale, articles (brouillon/publication/traduction), SEO de chaque page. Voir `GUIDE_ELSA.md`.

## 4. Limites connues / décisions

- **Je n'ai pas pu tester `/admin` en conditions réelles** (connexion OAuth Cloudflare, droits d'Elsa, enregistrement) : pas d'accès authentifié. **À faire avec Elsa : parcourir les 5 scénarios de `GUIDE_ELSA.md` une première fois**. Test utilisateur final non réalisé.
- Pas d'aperçu en direct dans le CMS (`preview: false`) : l'aperçu se fait sur le site après publication (1 à 3 min).
- Restauration d'une version précédente : par Florent via l'historique GitHub (pas de manipulation Git demandée à Elsa).
- Compression automatique des images : non faite (limite 3 Mo déjà imposée par le CMS) ; à envisager si les articles s'alourdissent.
- **FormSubmit** : l'adresse destinataire est visible dans le code du site (`thecyclespaceadmin@gmail.com`, adresse reprise de la conversation avec Elsa, modifiable dans le CMS). À la première inscription, FormSubmit envoie un email d'activation à cette adresse : **le lien doit être cliqué une fois, sinon aucune inscription n'arrive**. Anti-spam basique (champ piège). Si le volume augmente, passer à un vrai outil d'emailing (Brevo, MailerLite…).
- RGPD/LGPD : le texte de consentement et la durée de conservation doivent être validés, et une **page de confidentialité** reste à écrire (non créée : contenu juridique).

## 5. Décisions à valider

Prix des offres, destinataire des inscriptions, existence d'une politique de report, wording du consentement, choix d'un outil d'emailing, propositions de `docs/PROPOSITIONS_CONTENU.md`.

## 6. Rollback

`git revert` des commits de phase. Le CMS n'ayant pas changé de structure, les contenus édités entre-temps restent compatibles (champs ajoutés = optionnels).

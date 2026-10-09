# THE CYCLE SPACE. Plan d'amélioration incrémental pour Claude Code / Codex

**Projet :** `thecyclespace/the-cycle-space-site`  
**Site de référence :** https://thecyclespace.github.io/the-cycle-space-site/  
**Domaine souhaité (à vérifier avant toute modification DNS ou canonical) :** `https://thecyclespace.com`  
**Priorité produit :** expérience mobile, simplicité, confiance, référencement, conversion et autonomie éditoriale d'Elsa.  
**Principe directeur : NE PAS REFAIRE LE SITE DE ZÉRO.**

---

## 0. Ton rôle et ta mission

Tu es **Staff Frontend Engineer React**, **Senior Product Designer mobile-first**, **Technical SEO specialist** et **expert CMS no-code pour les petites entreprises de santé féminine**.

Audit le dépôt existant, puis améliore le site **par petites modifications vérifiables**. Conserve ce qui fonctionne déjà. Préserve l'identité de marque, les contenus, les outils, l'expérience de réservation et la capacité d'Elsa, qui n'est pas technique, à mettre à jour seule son site.

**Ne me pose pas de questions non bloquantes.** Réalise les étapes sûres, documente les décisions et liste les éléments qui exigent une validation métier (prix, titres professionnels, promesses de santé, domaine final, outil d'emailing). Ne déploie pas de changements destructeurs ni de migration lourde sans preuve de nécessité.

### Objectifs, par ordre de priorité

1. **Mobile excellent.** Une expérience fluide et lisible sur smartphones, y compris écran étroit, connexion lente et navigation au pouce.
2. **Préserver et fiabiliser.** Calendly fonctionne déjà : ne change ni le lien effectif ni le parcours de réservation sans raison. Maintiens les outils de cycle et les contenus.
3. **Elsa autonome.** Elle doit pouvoir éditer les textes, les offres, les prix si publiés, les images, les pages principales, le SEO et les articles depuis un CMS simple, sans Git, JSON, Markdown ni terminal.
4. **SEO solide.** Corriger les URL, les réponses HTTP, le pré-rendu HTML, les métadonnées, les langues, le sitemap et les liens internes.
5. **Conversion plus claire.** Expliquer l'accompagnement, instaurer la confiance et faciliter la réservation, sans marketing agressif.
6. **Accessibilité, confidentialité et exactitude des contenus santé.**
7. **Maintenance simple.** Pas de services supplémentaires, migrations majeures ou complexité permanente sans bénéfice mesurable.

## 1. Contexte existant. À contrôler dans la branche actuelle

D'après le dépôt public examiné lors de la préparation du plan :

- React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion + React Router.
- GitHub Pages, avec `base: '/the-cycle-space-site/'` dans `vite.config.js` et fallback SPA `404.html`.
- Articles Markdown sous `src/content/blog/` ; contenus EN/FR dans `src/content/i18n/` ; paramètres dans `src/content/settings/site.json` ; SEO sous `src/content/seo/seo.json`.
- **Sveltia CMS existe déjà** sous `public/admin/`, configuration `public/admin/config.yml`, et documentation `CMS_GUIDE.md`. Il faut **l'améliorer**, pas le remplacer automatiquement.
- Le CMS utilise GitHub et semble déjà disposer d'un mécanisme OAuth via Cloudflare Worker. Vérifier le fonctionnement réel, les accès et l'ergonomie pour Elsa. Ne jamais afficher ni committer tokens ou secrets.
- Réservation Calendly via `src/lib/booking.jsx` et `site.json`, avec URL de secours `https://calendly.com/thecyclespaceadmin` et champs spécifiques aux offres actuellement possiblement vides. **Les liens fonctionnent selon le demandeur. Conserver à l'identique jusqu'à vérification fonctionnelle.**
- Plusieurs outils interactifs : calculateur de cycle, phase du cycle, régularité, arrêt de contraception, température basale.
- Le formulaire du guide dans `src/components/GuideForm.jsx` télécharge le PDF mais, selon le code observé, ne transmet pas l'adresse à une liste. Il faut corriger la promesse faite à l'utilisatrice, pas inventer de stockage.
- Le dépôt comporte un `robots.txt`, un sitemap généré au build et des métadonnées ajoutées côté client.
- **Risque de désalignement CMS/contenu :** la configuration du champ `nav` dans `config.yml` semble prévoir des objets `{label, route}`, tandis que `en.json` observé contient un tableau de chaînes. Inspecter aussi `fr.json`, `Layout` et la logique i18n avant de changer le format. Migrer avec compatibilité et tests si nécessaire.

**Important :** ces éléments sont des hypothèses de départ tirées du dépôt au 9 octobre 2026. La branche actuelle et les comportements réels prévalent. Ne pas écraser des changements récents.

## 2. Règles de sécurité et non-régression. Impératives

### Préserver

- Logo, palette, typographies et ambiance chaleureuse/elegante. Pas de refonte visuelle radicale.
- Textes existants et traductions, tant que leur remplacement n'est pas explicitement approuvé. Conserver les originaux dans Git.
- Calendly : URL actuelle, ouverture modale ou lien externe, sélection de l'offre, comportement desktop/mobile.
- Tous les calculateurs, leurs règles de calcul et avertissements, sans modifier les formules sans tests et validation.
- PDF téléchargeable et liens déjà publiés, avec redirections si une URL doit changer.
- Articles existants, dates et slugs; ne pas supprimer ou fusionner automatiquement.
- GitHub Actions, publication GitHub Pages et Sveltia CMS existants.
- Version anglaise et française.

### Workflow Git

1. Examiner `git status`, branche active, historique récent, `README.md`, `CMS_GUIDE.md`, workflow de déploiement et tous les points d'entrée.
2. Créer une branche dédiée `improve/mobile-seo-cms-2026` (si elle n'existe pas) ; ne pas committer directement sur `main`.
3. Établir un inventaire des routes, captures mobile/desktop et tests de référence.
4. Faire des commits petits, compréhensibles et réversibles, par phase.
5. Ne jamais effectuer `git reset --hard`, nettoyage destructeur ou réécriture d'historique. Ne pas écraser des éditions récentes du CMS.
6. Avant fusion, comparer les données éditées sur `main` pour éviter de perdre les changements faits par Elsa.
7. Ne pas lancer une migration Astro/Next ni changer d'hébergeur par défaut. Proposer cette option uniquement si les solutions légères ne suffisent pas.
8. Ne jamais mettre de données personnelles, de secrets ou de formulaires de santé dans des logs ou des analytics.

## 3. Priorité absolue : audit et amélioration MOBILE-FIRST

**Tester réellement, pas seulement redimensionner une fenêtre desktop.** Contrôler au minimum :

- 320 x 568 : ancien petit smartphone, contrôle des débordements.
- 360 x 800 et 390 x 844 : Android / iPhone courants.
- 430 x 932 : grand smartphone.
- 768 x 1024 : tablette portrait.
- 1024 x 768 et 1440 x 900 : tablette paysage et ordinateur.
- Émulation tactile, clavier mobile, Safari iOS et Chrome Android si disponibles.
- Connexion lente simulée, CPU modeste, mode économie de données.

### 3.1 En-tête et navigation

- Logo identifiable et menu hamburger accessible sur petits écrans.
- Ne pas faire déborder le bouton de réservation et les sélecteurs de langue.
- Header compact, pas une énorme barre fixe qui cache le contenu.
- Navigation mobile facilement refermable, focus correct, `aria-expanded`, Escape, fermeture après navigation.
- Zone tactile de chaque action d'au moins 44 x 44 px ; espacements suffisants.
- Switch EN/FR intuitif et conservant la page équivalente si elle existe.
- CTA `Book a free call` facilement accessible sans omniprésence d'un bandeau fixe. Si CTA sticky testé, le rendre discret et empêcher tout recouvrement des champs et du calendrier.

### 3.2 Hero mobile. Point critique

- Afficher immédiatement une proposition de valeur explicite et compréhensible. Ne pas dépendre d'une animation pour révéler le titre.
- Titre idéalement lisible en 3 à 5 lignes, jamais coupé horizontalement ; typographie responsive via `clamp()` ou classes Tailwind adaptées.
- Un CTA principal : rendez-vous de découverte gratuit. Un CTA secondaire discret vers les offres.
- Les qualifications et les langues disponibles visibles sans surcharge.
- Ne pas utiliser `100vh` sans tenir compte des barres d'interface mobile ; préférer des unités modernes (`svh`/`dvh`) lorsque pertinentes.
- Conserver l'identité visuelle existante, mais supprimer les grands vides et cartes décoratives inutiles sur mobile.
- Éviter toute image/lottie/animation lourde avant le texte principal.

### 3.3 Contenu mobile

- Une colonne, rythme vertical régulier, sous-titres explicites, paragraphes courts.
- Largeur de ligne, contrastes et tailles de police confortables (texte courant plutôt >= 16 px).
- Cards Services simples avec : nom, durée, pour qui, résultat attendu, prix si validé, bouton.
- Afficher d'abord les deux choix utiles : rendez-vous gratuit et séance individuelle. Programme 6 mois visible sans surcharger.
- Réduire les répétitions entre manifeste, méthode, présentation et CTA.
- Aucun carrousel obligatoire pour accéder à une information essentielle.
- FAQ en accordéons accessibles uniquement si cela réduit réellement l'encombrement.
- Des liens de retour simples depuis les articles.

### 3.4 Formulaires, outils menstruels et Calendly sur mobile

- Champs avec `label` réel, types adaptés (`type=email`, `inputmode`, date picker utilisable), messages d'erreur explicites.
- Clavier virtuel ne doit pas recouvrir le bouton submit.
- Les calculateurs ne débordent pas et restent utilisables sur 320 px.
- Les dates et résultats sont compréhensibles sans interprétation ambiguë ; afficher avertissements et limites des prédictions.
- Les résultats sont accessibles aux lecteurs d'écran si mis à jour dynamiquement (`aria-live` si pertinent).
- **Calendly :** vérifier visuellement modal, scroll interne, fermeture, calendrier sur petit mobile et ouverture directe en fallback. Préserver l'URL réellement utilisée. Ne pas remplacer un flux validé par un autre sans justification.
- Ne jamais suggérer que le calculateur peut confirmer l'ovulation, poser un diagnostic ou servir de contraception fiable.

### 3.5 Performance mobile

- Mesurer Lighthouse mobile / PageSpeed et, si possible, données de terrain avant/après.
- Objectifs : LCP <= 2,5 s, INP <= 200 ms, CLS <= 0,1 au 75e percentile des données réelles ; ne pas présenter des mesures synthétiques comme des données de terrain.
- Réduire JavaScript initial et poids des images ; code-splitting des routes/outils si bénéfique.
- Charger Calendly à la demande ; vérifier que cela n'introduit pas de régression.
- Images responsives avec tailles définies, lazy loading hors écran ; ne pas lazy-loader l'image LCP.
- Réduire Framer Motion et respecter `prefers-reduced-motion`.
- Corriger layout shifts, débordements horizontaux, images floues et focus invisibles.
- Privilégier CSS/transitions légères au lieu d'une nouvelle librairie.

**Livrables mobile :** captures avant/après pour chaque viewport clé, liste d'anomalies réglées, score Lighthouse reproductible et vérification manuelle du parcours `Accueil -> Services -> Calendly`.

## 4. Simplifier la page d'accueil SANS la dénaturer

### Positionnement

The Cycle Space est une activité d'éducation du cycle et d'accompagnement individuel. Ne pas essayer de la transformer en concurrent direct des applications Flo ou Clue.

**Proposition éditoriale EN, à soumettre à validation d'Elsa :**

- H1 : `Understand your cycle. Feel more in control of your health.`
- Sous-titre : `From painful periods and PMS to irregular cycles and hormonal changes, get clear, evidence-informed guidance and personalised support.`
- CTA principal : `Book a free introduction`
- CTA secondaire : `Explore the services`
- Preuve de confiance : `Online · English & French · With Elsa, M.Ost.` (confirmer la formulation du titre professionnel).

Ne pas publier de claims médicaux non validés. Proposer aussi une traduction française naturelle à Elsa, sans traduction littérale forcée.

### Nouvelle structure recommandée. Maximum ~7 sections

1. Hero : problème, accompagnement, appel gratuit.
2. `How can I help?` : douleurs menstruelles, SPM, irrégularités, compréhension du cycle et changement contraceptif, sans promettre de traitement des maladies.
3. Trois résultats réalistes : mieux comprendre, mieux suivre, construire des prochaines étapes personnalisées.
4. Elsa : photo réelle, parcours, approche, qualifications vérifiées.
5. Offres : Introduction gratuite, Check-In 90 min, programme 6 mois. Group programme `coming soon` moins visible.
6. Outil gratuit + articles pédagogiques.
7. FAQ courte + CTA final.

Éviter l'accumulation de slogans. Garder des expressions propres à la marque, mais pas au détriment de la clarté.

## 5. Pages Services et conversion

- Préserver les 3 offres existantes, leurs intentions et leurs CTA Calendly.
- Mettre l'Intro gratuite en avant sans cacher les prestations payantes.
- Présenter chaque offre de façon comparable : durée, public, déroulé, livrable, prix si confirmé, CTA.
- **Ne pas inventer les prix.** Si absents, prévoir un champ CMS `priceLabel` optionnel.
- Ne pas renvoyer arbitrairement tous les boutons vers le même événement si les types Calendly spécifiques existent ; vérifier et conserver les fallbacks valides.
- Ajouter une FAQ pratique : langues, fuseaux horaires, en ligne, différence des offres, politique de report (à confirmer), limites de l'accompagnement.
- Mesurer les clics CTA (événement anonyme), sans collecte des symptômes ni données sensibles.
- Aucun pop-up agressif ni compte à rebours.

## 6. Autonomie d'Elsa : priorité structurante

### Règle de base

**Sveltia CMS est déjà installé. Le conserver et le rendre réellement simple.** Ne pas introduire Sanity, Contentful, WordPress, Strapi ou une base de données de contenu sans besoin démontré. Préserver les commits CMS via GitHub.

### 6.1 Audit CMS indispensable

- Tester `/admin/` sur le domaine de production, puis le parcours login OAuth prévu ; distinguer bug d'authentification, droits et configuration.
- Vérifier qu'Elsa peut utiliser l'administration sur ordinateur et, si raisonnable, sur mobile.
- Vérifier toutes les collections, les modèles, l'affichage des médias et le rendu du site après publication.
- Identifier les champs incohérents avec les JSON existants. Exemple à vérifier : `nav` objets vs tableau de strings ; adapter la configuration ou faire une migration compatible, accompagnée de tests.
- Vérifier les champs facultatifs, les valeurs par défaut, les erreurs de validation, les aperçus et le tri des articles.
- Ne pas imposer à Elsa de copier un token GitHub à chaque publication si une authentification simple et sûre peut être configurée via l'OAuth déjà prévu.
- Le CMS doit toujours autoriser la publication même si un aperçu enrichi n'est pas possible.

### 6.2 Interface éditoriale souhaitée

Regrouper la navigation de manière simple :

| Menu Elsa | Ce qu'elle doit pouvoir faire sans coder |
|---|---|
| **Accueil** | Modifier titre, sous-titre, boutons et courtes sections |
| **Services** | Modifier textes, ordre, visibilité des offres, prix affichés si validés |
| **À propos d'Elsa** | Modifier présentation, photo, diplômes et informations professionnelles |
| **Articles & ressources** | Créer, modifier, prévisualiser, publier/dépublier et traduire un article |
| **Médias** | Ajouter une image et voir comment elle est utilisée |
| **Réservations & contact** | Modifier liens Calendly, email et réseaux sociaux sans casser les boutons |
| **SEO simple** | Titre et description de la page, image de partage, slug géré prudemment |

Ces libellés peuvent correspondre à des collections Sveltia existantes restructurées. Pas besoin de fabriquer un back-office React personnalisé.

### 6.3 Expérience non-tech de publication

- Labels en français compréhensibles, aide contextualisée, exemples de bon texte.
- Cacher la complexité technique : `slug`, `frontmatter`, noms de composants, balises HTML, routes, ID et JSON ne doivent pas être des tâches quotidiennes.
- Champs structurés, listes avec limites raisonnables, menus déroulants pour les actions et formats.
- Prévisualisation avant publication si faisable ; sinon prévisualisation du Markdown et test visuel sur staging.
- Brouillon/publication et prévention des erreurs de validation.
- Bouton de publication et confirmation simples ; expliquer qu'une modification devient visible après le déploiement.
- Le champ SEO doit avoir un texte d'aide et une valeur par défaut intelligible.
- Ne pas autoriser la saisie d'un CTA arbitraire capable de casser une URL.
- Pour les images, restrictions raisonnables de poids, texte alternatif, ratio recommandé ; compresser automatiquement si facile, sinon avertir.
- Préserver la compatibilité des anciens contenus et de leurs références.

### 6.4 Guide pour Elsa, obligatoire

Créer ou réviser `GUIDE_ELSA.md`, langage non technique, avec captures d'écran réelles de l'administration (si possible), et exactement ces cinq scénarios :

1. Changer une phrase de l'accueil.
2. Modifier le descriptif d'une offre.
3. Mettre à jour le lien Calendly.
4. Ajouter un article avec photo, en enregistrant d'abord en brouillon.
5. Corriger une faute après publication.

Ajouter les informations : où se connecter, comment prévisualiser, comment publier, comment retrouver un article, que faire si un changement n'apparaît pas, qui contacter en cas d'erreur, comment restaurer une version précédente **sans demander à Elsa de manipuler Git**.

**Test utilisateur final :** une personne non technique doit réussir les cinq scénarios sans terminal ni édition de fichiers.

## 7. SEO technique. Corriger avec le minimum de disruption

### 7.1 Audit des URL et du domaine

Avant tout changement : vérifier réellement la version publique accessible sur `github.io`, `thecyclespace.com` et `www.thecyclespace.com`, redirections, statuts HTTP, certificats HTTPS, routes profondes, canonical et sitemap.

Ne pas présumer que le domaine personnalisé est opérationnel au seul motif qu'il apparaît dans les fichiers. **Ne pas modifier DNS ni faire une migration de domaine sans validation explicite.**

- Choisir une seule URL canonique après vérification.
- Corriger `base` Vite selon le domaine effectif et conserver le fonctionnement en preview/staging.
- Centraliser la génération d'URL et éviter les chemins absolus incorrects dans les images/Markdown.
- Revoir `robots.txt` et `sitemap.xml`.
- Ne pas bloquer automatiquement `/uploads/` si les articles ont besoin d'images indexables ; conserver `/admin/` exclu.
- Ne pas donner artificiellement la date du build comme `lastmod` d'un article non modifié.

### 7.2 HTML et crawl

- Mesurer les statuts HTTP réels des routes profondes avec un client qui ne lance pas JS.
- Les pages importantes doivent idéalement avoir **HTML significatif et statut 200 au chargement direct**, avec titres, descriptions et canonical visibles dans le HTML initial.
- En priorité, implémenter un **pré-rendu statique compatible React/Vite** ou une génération de fichiers HTML par route, en restant sur GitHub Pages si possible. La solution doit être maintenable, gérer les nouveaux articles automatiquement et ne pas casser Sveltia CMS.
- Si la stack existante ne permet pas une solution robuste à coût raisonnable, comparer une architecture statique type Astro avec une migration incrémentale, sans la lancer automatiquement.
- Préserver les routes historiques via redirections adaptées ou une stratégie claire si des URLs changent.
- Pages inexistantes : ne pas servir des pages de contenu indexables en `200` avec un message de faux succès.

### 7.3 EN/FR

- Préférer des URLs distinctes du type `/en/...` et `/fr/...` **uniquement après plan de migration et tests**.
- Préserver les anciens liens et les traductions existantes.
- `hreflang` réciproque, `html[lang]`, canonical par langue, sitemap bilingue cohérents.
- Une page anglaise ne doit pas afficher sa canonical vers la version française ni inversement.
- Le changement de langue doit garder l'article équivalent via le champ `translation`, sinon mener vers une page pertinente, sans 404.
- Travailler les termes SEO naturellement, sans traductions littérales et sans contenu dupliqué inutile.

### 7.4 Métadonnées et données structurées

- Titre SEO unique et naturel par page, meta description utile, OG/Twitter card vérifiés.
- `Article` pour les articles, `Person` pour Elsa, `Organization` et `BreadcrumbList` lorsque pertinents. Ajouter `FAQPage` seulement si valide et utile ; ne pas promettre d'affichage enrichi Google.
- Dates de création/mise à jour réelles, nom complet et qualifications vérifiées, attribution des relectures lorsqu'elles ont réellement eu lieu.
- Données structurées dans le HTML initial si possible.
- Open Graph images existantes et nouvelles vérifiées avec chemins absolus corrects.
- Installer ou vérifier Google Search Console / Bing Webmaster Tools selon les accès autorisés, sans inventer de chiffres de trafic.

## 8. SEO éditorial et visibilité dans les assistants IA

Prioriser les besoins réels plutôt qu'un volume artificiel de pages :

1. Règles douloureuses : causes possibles, limites de l'auto-observation, quand consulter.
2. Syndrome prémenstruel : symptômes, suivi, distinction d'avec TDPM.
3. Cycles irréguliers : quand demander un avis médical.
4. Après l'arrêt d'une contraception hormonale : variations possibles et suivi.
5. Signes d'ovulation : précision et limites des estimations.
6. Température basale et glaire cervicale : expliquer sans surpromesse.
7. SOPK et endométriose : éducation documentée, **sans affirmer qu'Elsa les diagnostique ou traite** si cela dépasse ses compétences.
8. Périménopause : accompagnement éducatif et signes justifiant une consultation.

### Patron de contenu CMS

- Un H1 précis, résumé de réponse en 50 à 80 mots, sections H2/H3 logiques.
- Conseils simples et prudents, contexte et incertitudes, encadré « Quand consulter ? » lorsque pertinent.
- Références médicales primaires ou institutionnelles correctement attribuées : par exemple NHS, NICE, ACOG, WHO, revues à comité de lecture. Vérifier chaque recommandation et date.
- Signature d'Elsa et date de mise à jour ; validation médicale externe uniquement si réellement réalisée.
- Liens internes vers un outil, un autre article et éventuellement l'offre d'accompagnement.
- Une seule CTA utile, sans interrompre continuellement la lecture.
- Ne pas publier du contenu de santé généré automatiquement sans revue humaine.

**SEO pour recherche IA :** texte crawlable, réponses claires, identification de l'auteur, sources, données structurées fidèles et informations vérifiables. Éviter tout gadget présenté comme garantie de visibilité IA.

## 9. Confiance, santé et protection des données

- Les offres relèvent-elles de l'éducation et de l'accompagnement ? Le préciser sans suggérer un diagnostic ou une prise en charge médicale non prouvée.
- Revoir les formulations absolues telles que « symptoms are signals », « transformation », « regulate hormones » ; les rendre proportionnées aux connaissances et au champ d'activité d'Elsa.
- Vérifier diplômes, titres professionnels, expérience, juridiction et qualification locale avant de les mettre en avant. Ne pas fabriquer de titre ni d'affiliation.
- Ne pas publier de faux témoignages. Témoignages uniquement réels et autorisés, sans exposer les données médicales des clientes.
- Afficher avertissements appropriés sur fertilité, prédiction d'ovulation, cycles irréguliers et symptômes sévères.
- Revoir politique de confidentialité, mentions nécessaires, contact, conservation des données et consentement, selon les juridictions réellement visées (notamment RGPD/LGPD si applicables).
- Ne jamais collecter symptômes, dates de règles ou données sensibles sans nécessité, consentement et solution adaptée.
- Les outils locaux doivent expliquer clairement ce qui est enregistré et ce qui ne quitte pas le navigateur, après vérification du code.
- Le formulaire guide : soit téléchargement direct sans fausse promesse d'inscription, soit vraie inscription consentie via un prestataire choisi et configuré avec validation. **Ne jamais afficher « vous êtes inscrite » si aucun email n'a été transmis.**

## 10. Accessibilité et qualité

- Cible WCAG 2.2 AA pour les parcours principaux.
- Contraste des textes et boutons, focus visible, clavier, ordre de tabulation et lecteur d'écran.
- Labels de champs, messages d'erreur liés aux inputs, textes alternatifs sur images porteuses de sens.
- Ne pas utiliser la couleur seule pour un état ; attention aux graphiques des cycles.
- Support de `prefers-reduced-motion`.
- Vérifier toutes les routes, traductions, états vides et erreurs réseau.
- Sanitiser/contrôler le rendu des contenus Markdown/HTML en particulier là où `dangerouslySetInnerHTML` est utilisé.

## 11. Architecture, tests et outillage minimal

**Ne pas sur-ingénieriser.** Ajouter des tests ciblés et scripts reproductibles, pas une usine à gaz.

- Tests de rendu des routes principales et des traductions.
- Tests des URL Calendly et des liens de secours.
- Tests de compatibilité des schémas CMS avec les fichiers de contenu actuels.
- Tests des calculateurs existants sur cas limites (cycles courts/longs, dates, années bissextiles, données invalides). Conserver la logique médicale existante sauf correction validée.
- Test de génération sitemap/canonical/hreflang et réponse HTTP des routes produites.
- Test de non-débordement mobile et clic CTA, via Playwright si disponible.
- Vérifier `npm ci`, `npm run build`, `npm run preview` et le workflow de publication.
- Mesures avant/après pour JS bundle, LCP synthétique, captures mobiles et erreurs console.
- Optionnel : introduire un script de validation des données éditoriales (schéma Zod ou validation simple), uniquement si cela empêche des erreurs réelles de publication.

## 12. Exécution en quatre phases avec portes de contrôle

### PHASE 0. Baseline et sauvegarde

- Auditer dépôt, routes, état du CMS et Calendly.
- Faire un inventaire des URLs, contenus, médias et offres.
- Capturer les écrans mobile et desktop, Lighthouse initial, erreurs console.
- Établir la liste de risques et les changements autorisés sans arbitrage métier.
- Créer `AUDIT_BASELINE.md` et branche dédiée.
- **Ne toucher à aucun texte clinique ou domaine sans validation.**

**Critère de fin :** la base fonctionnelle est documentée et reproductible.

### PHASE 1. Mobile, réservation et erreurs prioritaires

- Corriger responsive 320–430 px, navigation, hero, cartes Services, formulaires, outils.
- Conserver et tester tous les liens Calendly.
- Corriger le formulaire guide pour qu'il soit honnête et fonctionnel, sans choisir un service externe payant sans validation.
- Traiter les performances faciles : images, chargement différé, animations.
- Livrer des captures comparatives, tests et notes de changement.

**Critère de fin :** parcours complet depuis smartphone sans blocage ni débordement, aucune régression Calendly ou outils.

### PHASE 2. Autonomie d'Elsa et conversion

- Réparer et simplifier Sveltia CMS, en priorité les incompatibilités de schéma éventuelles.
- Rendre éditables les champs pertinents sans code.
- Simplifier accueil et Services avec modifications de contenu proposées, en attente de validation des claims/prix.
- Créer `GUIDE_ELSA.md` et tester les cinq scénarios non-techniques.

**Critère de fin :** Elsa peut changer une offre ou publier un article sans développeur.

### PHASE 3. SEO et contenu

- Unifier URLs et méta sur le domaine validé ; corriger robots, sitemap, HTML statique / pré-rendu.
- Traiter la stratégie EN/FR avec redirections sûres et hreflang.
- Renforcer modèle d'article, auteur, sources, FAQ et liens internes.
- Mettre en place le suivi des clics CTA uniquement si consentement/paramétrage appropriés et sans données sensibles.
- Actualiser `README.md`, `CMS_GUIDE.md`, `GUIDE_ELSA.md`.

**Critère de fin :** indexation des pages profondes testée, métadonnées correctes par route et par langue, contenus existants préservés.

### PHASE 4. Vérification finale

- Tests fonctionnels mobile + desktop, CMS + Calendly + outils + PDF, FR + EN.
- Test sans JavaScript pour chaque page SEO critique.
- Performance et accessibilité avant/après.
- Aucun 404 non attendu, aucun lien cassé, aucun champ CMS perdu.
- Préparer pull request(s) avec captures et instructions de déploiement/retour arrière.
- Ne pas fusionner sur `main` sans validation finale.

## 13. Tableau des critères d'acceptation

| Domaine | Critère minimal |
|---|---|
| Mobile | Aucun scroll horizontal sur 320/360/390/430 px ; boutons faciles à toucher |
| Navigation | Menu mobile, langues et accès Services fonctionnent |
| Calendly | Réservation identique ou meilleure, URL effective conservée, fallback actif |
| Outils | Tous fonctionnent sur mobile et desktop avec avertissements visibles |
| Elsa CMS | Texte accueil, offres, Calendly, images et articles modifiables sans code |
| CMS compatibilité | Aucun champ JSON cassé ni perte de contenu après sauvegarde |
| Blog | Brouillons, publication et traductions vérifiés |
| SEO | HTML indexable, canonicals, sitemap, robots et langues cohérents |
| Vitesse | Core Web Vitals et bundle documentés avant/après, progrès mesurés |
| A11y | Parcours clavier et lecteur d'écran testés sur les écrans critiques |
| Sécurité | Aucun secret committé, aucune donnée de cycle transmise en analytics |
| Maintenance | Pas de nouvelle dépendance lourde sans justification et accord |

## 14. Format du compte rendu final demandé à l'agent

À chaque phase, fournir :

1. **Ce qui a changé**, avec les fichiers concernés et liens vers commits/PR.
2. **Ce qui n'a PAS changé**, notamment Calendly, calculateurs, identité visuelle.
3. **Captures avant/après** pour 390 px et 1440 px au minimum.
4. **Tests exécutés**, résultats, bugs et régressions éventuelles.
5. **Performance mobile** avant/après, en distinguant lab et terrain.
6. **Ce qu'Elsa peut modifier désormais** depuis le CMS.
7. **Décisions restant à valider** : prix, credentials, claims, domaine, emailing.
8. **Plan de rollback** court.

### Instruction finale à Claude Code / Codex

**Commence par PHASE 0 puis exécute PHASE 1 avec les améliorations sûres.** Continue les phases suivantes dans la même branche seulement si les tests et les garde-fous passent. N'interromps pas le travail pour des choix de détail ; documente-les. Lorsque le sujet touche au domaine, à la santé, aux prix, à un service externe ou à une migration majeure, prépare la solution et signale clairement la validation requise au lieu de modifier irréversiblement.

**Rappel de priorité : mobile 10/10, Elsa autonome 10/10, Calendly préservé, SEO robuste, zéro destruction de l'existant.**

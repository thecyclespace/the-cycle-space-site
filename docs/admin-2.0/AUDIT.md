# Administration 2.0 — audit et décisions

Branche `feat/admin-2.0`, 10 octobre 2026. Cahier des charges : `THE_CYCLE_SPACE_ADMIN_2_0_SPEC.md`.

**En une phrase :** Sveltia suffit pour le MVP, à condition de ranger le contenu par page. C'est fait sur cette branche, le site public ne change pas (19 pages sur 19 identiques au site en ligne), mais la connexion d'Elsa et une vraie publication n'ont pas pu être testées : il faut une session GitHub réelle.

## 1. État initial constaté

| Point | Constat | Preuve |
|---|---|---|
| Pile | React 18, Vite 5, Tailwind 3, React Router 7. **Framer Motion n'est plus utilisé** (le cahier des charges le cite encore). | `package.json` |
| Installation | `npm ci` a échoué (`EPERM` sur `esbuild.exe`) parce qu'un serveur `npm run dev` tournait sur le poste. `npm install` depuis le même verrou a réussi. À refaire serveur arrêté ; en intégration continue, `npm ci` fonctionne (3 déploiements réussis le jour même). | sortie npm |
| Tests et build de départ | 57 tests sur 57, build OK (19 pages pré-rendues, 5 redirections). | `npm test`, `npm run build` |
| Publication | Un `push` sur `main` lance le build puis GitHub Pages, en 35 à 60 secondes. Aucun test n'était lancé avant la mise en ligne. | `.github/workflows/deploy.yml`, `gh run list` |
| Usage réel du CMS | **Aucune modification n'a jamais été enregistrée depuis le CMS** : les 30 derniers commits sont des fusions ou des modifications manuelles. La chaîne « enregistrer puis mettre en ligne » n'a donc jamais été éprouvée. | `git log` |
| Formulaires | Un formulaire de 58 champs par langue, haut de 5 245 px replié, français et anglais dans deux rubriques séparées. Libellés techniques (« Hero », « Kicker », « CTA », « Slug »). | `screens/avant-03-formulaire-fr.png` |
| Aperçu | Désactivé pour les pages. Actif pour les articles. | `config.yml` |
| Photos | 3 des 5 photos du site s'affichaient sans vignette dans le CMS (fichiers hors du dossier d'envoi). 2 champs de photo ne servaient plus à aucune page. | `screens/apres-05-photos.png` (avant correction : icône de fichier) |
| Script du CMS | Chargé sans numéro de version depuis unpkg : il pouvait changer tout seul, sur une page où Elsa est connectée avec un droit d'écriture. | `public/admin/index.html` |
| Référencement | `robots.txt` annonçait le plan du site sur `thecyclespace.com`, domaine pas encore branché. | `public/robots.txt` |

**Note d'expérience de départ : 3 sur 10.** Atteindre le titre de l'accueil demandait 3 clics puis de repérer un champ parmi 58 ; modifier une phrase dans les deux langues demandait de refaire le chemin dans une autre rubrique ; rien n'indiquait si une modification était en ligne.

## 2. Connexion (OAuth)

Ce qui a été vérifié sans compte, par des requêtes sur le service `sveltia-cms-auth.thecyclespaceadmin.workers.dev` :

| Vérification | Résultat |
|---|---|
| Le service répond | Oui. |
| Origine `thecyclespace.github.io` | **Acceptée** : redirection vers GitHub avec un jeton d'état et un cookie anti-CSRF (`HttpOnly`, `Secure`, `SameSite=Lax`, 10 minutes). |
| Origine inconnue (`evil.example.com`), `localhost` | Refusées (« Your domain is not allowed »). La liste d'origines autorisées est donc bien réglée. |
| Origine `thecyclespace.com` et `www.thecyclespace.com` | **Refusées.** La connexion cessera de fonctionner le jour du passage au domaine tant que la liste n'est pas complétée. |
| Droits demandés à GitHub | `repo,user` : écriture sur **tous** les dépôts auxquels le compte a accès, pas seulement celui du site. C'est le fonctionnement normal de Sveltia. |
| Secret dans le dépôt ou le navigateur | Aucun. Le secret OAuth reste dans Cloudflare. Vérifié par un test. |

**Non vérifié, à faire avec une vraie session :** que le bouton « Se connecter avec GitHub » aboutit pour le compte d'Elsa, qu'un enregistrement crée bien un commit, et que le site se met à jour. Aucune de ces trois étapes n'a de trace dans l'historique.

Comptes ayant le droit d'écrire : `thecyclespace` (administrateur) et `Flambe02` (écriture). La branche `main` n'a aucune protection.

### Actions manuelles (personne ne peut les faire à ta place depuis le dépôt)

1. **Tester la connexion et une publication réelles** (procédure au chapitre 8). C'est le point bloquant.
2. **Cloudflare** → Worker `sveltia-cms-auth` → variable `ALLOWED_DOMAINS` : ajouter `thecyclespace.com` avant de basculer le domaine. Dans l'application OAuth GitHub, l'adresse de retour reste celle du Worker.
3. **GitHub → Settings → Pages** : cocher « Enforce HTTPS ». Aujourd'hui `http://thecyclespace.github.io/the-cycle-space-site/` répond sans rediriger vers `https`.
4. **Compte GitHub d'Elsa** : activer la double authentification, et n'utiliser ce compte que pour le site (le droit accordé couvre tous ses dépôts).
5. Facultatif : protéger `main` contre la suppression et le `force-push` (Settings → Rules). Ne pas exiger de pull request, sinon le CMS ne pourrait plus enregistrer.

## 3. Trois options comparées

| Option | Ce que cela apporte | Coût et risque | Décision |
|---|---|---|---|
| **A. Sveltia mieux configuré** | Rubriques par page, français et anglais côte à côte, photos allégées, brouillon local restauré, aperçu des articles. | Une migration du contenu (mêmes textes, fichiers découpés), pas de nouveau service. | **Retenue.** |
| B. Enveloppe React autour de Sveltia | Page d'accueil « Bonjour Elsa », raccourcis. | Deuxième interface à maintenir, liens profonds fragiles, pour un gain faible : Sveltia ouvre déjà sur « Mes pages ». | Écartée. Seul l'indicateur de mise en ligne, qui manquait vraiment, a été ajouté (un fichier de 150 lignes, sans dépendance). |
| C. Éditeur React sur mesure | Aperçu fidèle de la page, écran par intention. | Authentification, écriture GitHub, conflits, médias et brouillons à réécrire et à sécuriser. Plusieurs semaines, surface d'attaque nouvelle. | Écartée pour cette passe. Rien de constaté ne l'impose. |

Limites de Sveltia qui restent, sans contournement gratuit et simple :

- **Pas d'aperçu fidèle des pages** (accueil, accompagnements…). Sveltia n'accepte pas encore de gabarit d'aperçu personnalisé. Elsa voit ses champs, pas la page. Les articles, eux, ont un aperçu du texte.
- **Pas de publication groupée** : chaque page s'enregistre séparément (une page = français + anglais ensemble).
- **Le droit d'écriture n'est limité que par l'interface.** Le jeton GitHub d'Elsa peut techniquement tout modifier ; le CMS ne lui propose que les dossiers de contenu.
- Le mot « Collections » en haut du menu et le bouton « Enregistrer » viennent de Sveltia et ne se renomment pas.

## 4. Ce qui a été fait

### Contenu rangé par page

Avant : `src/content/i18n/en.json` et `fr.json`, 58 clés chacun. Après : `src/content/pages/<page>.<langue>.json` pour cinq pages (`home`, `services`, `about`, `resources`, `shared`).

- Les clés et les valeurs sont **identiques** ; elles ont seulement changé de fichier. `src/content/copy.js` les regroupe en un objet de la même forme : aucun composant n'a été réécrit.
- `scripts/migrate-content-admin2.mjs` fait le déplacement, peut être relancé sans effet, et refuse de continuer si une clé n'a pas de page.
- Réglages : les PDF du guide, leurs couvertures et l'adresse des inscriptions passent dans `settings/guide.json` ; la photo d'Elsa rejoint `settings/images.json` (copiée dans `public/uploads/` pour être visible et remplaçable dans le CMS).
- Supprimé, car affiché par aucune page : les photos `onlineImage` et `blogImage`, et leurs deux descriptions.
- Photos d'ambiance : les versions allégées pour téléphone passent dans `public/images/site/variantes/`. Le dossier que le CMS affiche ne contient plus qu'une vignette par photo (10 au lieu de 60 fichiers). Les pages servent toujours les mêmes formats AVIF et WebP.

### Administration

| Rubrique | Contenu |
|---|---|
| **Mes pages** | Page d'accueil, Mes accompagnements, À propos, Ressources et guide gratuit, Menu, boutons et pied de page. Chaque page s'ouvre avec le français à gauche et l'anglais à droite. |
| **Articles** | Liste avec vignette, filtres (brouillons, langue). Un nouvel article commence en brouillon. L'article traduit se choisit dans une liste, plus besoin de taper un nom technique. |
| **Photos et documents** | Photos du site (avec vignettes), guide gratuit (PDF, couvertures, adresse des inscriptions). |
| **Coordonnées** | Liens Calendly, email, Instagram. |
| **Options avancées** | Titres et descriptions pour Google. |

- Tous les libellés sont réécrits en français courant ; un test interdit le retour des mots techniques.
- Longueurs maximales vérifiées à la saisie pour les textes qui cassent la mise en page (grand titre, cartes).
- Photos : 3 Mo maximum, converties en WebP et ramenées à 2 000 px avant l'envoi. Banques d'images externes retirées.
- Script du CMS fixé à la version 0.233.1, avec empreinte vérifiée par le navigateur.

### « Est-ce en ligne ? »

`public/admin/publication.js` affiche en bas à gauche : **Le site est à jour**, **Mise en ligne en cours…** ou **Mise en ligne échouée**. Il compare la version réellement publiée (`version.json`, écrit par le build) au dernier changement enregistré, et consulte l'état du déploiement. Il ne lit que des informations publiques : aucun jeton. Il n'annonce « à jour » que lorsque le site publié porte bien le dernier changement.

Les tests sont maintenant lancés avant chaque mise en ligne. Si un enregistrement casse une règle de contenu, le déploiement s'arrête, le site garde sa version précédente et l'indicateur passe à « échouée ».

### Bac à sable

`node scripts/admin-sandbox.mjs` ouvre l'administration sur `http://localhost:4321/admin/` avec le vrai contenu, sans GitHub ni jeton. Toutes les vérifications du chapitre 6 ont été faites ainsi.

## 5. Fichiers créés ou modifiés

**Créés**
- `src/content/pages/*.json` (10 fichiers), `src/content/settings/guide.json`, `src/content/copy.js`
- `public/admin/publication.js`, `public/uploads/elsa.jpg`, `public/images/site/*.webp` (10 vignettes)
- `scripts/migrate-content-admin2.mjs`, `scripts/admin-sandbox.mjs`, `scripts/admin-sandbox-open.js`, `scripts/admin-sandbox-export.js`, `scripts/compare-with-live.mjs`
- `tests/admin-config.test.mjs`, `tests/_content.mjs`
- `docs/admin-2.0/AUDIT.md`, `docs/admin-2.0/GUIDE_ELSA.md`, `docs/admin-2.0/screens/`

**Modifiés**
- `public/admin/config.yml` (réécrit), `public/admin/index.html`
- `src/lib/i18n.jsx`, `src/entry-server.jsx`, `src/lib/schemas.js`, `src/components/GuideForm.jsx`, `src/components/Picture.jsx`, `src/pages/Home.jsx`, `src/pages/About.jsx`, `src/pages/BlogList.jsx` (imports et chemins seulement)
- `src/content/settings/site.json`, `images.json`, `src/content/seo/seo.json` (ordre des clés)
- `scripts/prerender.mjs` (`version.json`, `robots.txt`), `scripts/optimize-images.py`, `.github/workflows/deploy.yml` (tests avant mise en ligne)
- `tests/content.test.mjs`, `tests/build.test.mjs`, `tests/images-ux.test.mjs`, `tests/fr-style.test.mjs`
- `package.json` (`yaml`, pour les tests uniquement), `.gitignore`, `GUIDE_ELSA.md`, `CMS_GUIDE.md`, `README.md`

**Déplacés ou supprimés**
- `src/content/i18n/en.json`, `fr.json` (remplacés par les fichiers de pages)
- `public/images/site/*-{480,800,1200}.{avif,webp}` → `public/images/site/variantes/`

## 6. Vérifications faites

| Vérification | Résultat |
|---|---|
| Tests | 65 sur 65 (57 au départ, 8 nouveaux). |
| Build de production | OK, 19 pages et 5 redirections. |
| Site public inchangé | `scripts/compare-with-live.mjs` : 19 pages sur 19 ont le même texte visible, le même titre, la même description, le même lien canonique et les mêmes `hreflang` que le site en ligne. Seuls les chemins de 3 images changent. Cette comparaison a d'ailleurs rattrapé une erreur en cours de route (le nom du site avait disparu du pied de page). |
| Textes identiques après migration | Comparaison clé par clé avant et après, dans les deux langues : identiques. |
| Poids du script public | 323 Ko avant, 323 Ko après. L'administration n'est pas chargée par le site. |
| Modifier le français sans toucher l'anglais | Dans le bac à sable : une ligne changée dans `home.fr.json`, `home.en.json` intact, mise en forme du fichier inchangée. |
| Article avec outil | Titre modifié puis enregistré : le texte et le marqueur `<!-- calculator -->` sont intacts ; seul l'en-tête est réordonné. |
| Lien Calendly incorrect | Refusé à l'enregistrement, avec le message « Le lien doit commencer par https://calendly.com/ ». |
| Photo trop lourde | Un JPEG de 5,2 Mo et 3 200 px devient un WebP de 2 000 px et 1,3 Mo. |
| Brouillon non enregistré | Après rechargement de la page, Sveltia propose « Restaurer le brouillon ». |
| Téléphone (390 px) | L'administration s'affiche, avec un sélecteur de langue à la place des deux colonnes. Testé dans un navigateur de bureau redimensionné, pas sur un vrai téléphone. |
| Dossiers accessibles en écriture | Test : uniquement `src/content/` et les deux dossiers de photos. Aucun chemin vers le code ou les workflows dans la configuration. |
| Secrets | Test : aucun jeton ni secret dans `public/admin/`. |

## 7. Non vérifié et risques restants

- **Connexion d'Elsa, enregistrement réel, déclenchement du déploiement** : non testés (chapitre 2).
- **Indicateur de mise en ligne** : la logique a été relue et ses appels publics vérifiés (réponses de GitHub, accès autorisé depuis un navigateur, 60 requêtes par heure). Il n'a été vu en fonctionnement que dans le bac à sable, où il affiche « Essai en local ». Ses trois états réels ne pourront être observés qu'après fusion.
- **Conflit d'édition** (deux personnes, ou un développeur qui pousse pendant qu'Elsa écrit) : non testé. Sveltia écrit par l'API Git de GitHub ; son comportement exact en cas de conflit reste à observer en vrai.
- **Vrais téléphones** (Safari iPhone, Chrome Android) : non testés. L'allègement des photos est plus lent sur Safari.
- **Droit d'écriture large** du jeton GitHub (chapitre 3).
- **Chemins d'images** : `…/images/site/<nom>-1200.webp` devient `…/images/site/variantes/<nom>-1200.webp`. Un lien externe vers l'ancien chemin serait cassé ; aucun n'est connu. `elsa.jpg` reste aussi à son ancien emplacement.
- **Photos « banque »** : le sélecteur montre les 10 photos d'ambiance d'origine, dont deux images générées de femmes qui ne sont plus utilisées.
- **Mise à jour de Sveltia** : elle est maintenant volontaire. Pour changer de version : remplacer le numéro et l'empreinte dans `public/admin/index.html` (`openssl dgst -sha384 -binary sveltia-cms.js | openssl base64 -A`), puis rejouer le bac à sable.

## 8. À tester sur une vraie session, dans cet ordre

1. Fusionner la branche (rien ne change pour les visiteurs).
2. Ouvrir `/admin/`, cliquer « Se connecter avec GitHub » avec le compte d'Elsa. Attendu : retour dans l'administration, rubrique « Mes pages ».
3. Mes pages → Page d'accueil → modifier la légende sous la photo en français → Enregistrer. Attendu : message de succès, puis l'indicateur passe à « Mise en ligne en cours… » en moins d'une minute, puis « Le site est à jour » en 2 à 5 minutes. Vérifier sur le site, puis remettre l'ancien texte.
4. Sur GitHub, vérifier que le commit ne touche que `src/content/pages/home.fr.json`.
5. Photos et documents → remplacer une photo par une photo de téléphone. Attendu : fichier `.webp` dans `public/images/site/` ou `public/uploads/`.
6. Articles → Nouveau → enregistrer en brouillon. Attendu : l'article n'apparaît pas sur le site.
7. Refaire l'étape 3 sur un iPhone.
8. Ouvrir deux onglets sur la même page, enregistrer dans l'un puis dans l'autre : noter ce que Sveltia affiche.

## 9. Phase suivante

Par ordre d'utilité pour Elsa :

1. **Aperçu fidèle des pages.** Le plus simple et sans risque : une page d'aperçu du site (`/apercu/`) qui lit le brouillon local de Sveltia et rend la vraie page React. À prototyper séparément du flux de publication.
2. **Versions allégées automatiques** des photos qu'Elsa envoie (aujourd'hui une seule taille), générées pendant le build.
3. **Retour en arrière sans GitHub** : une page listant les 10 dernières modifications de contenu avec un bouton « rétablir ». Demande une écriture authentifiée, donc à concevoir avec le même soin que la connexion.
4. **Statistiques du guide** dans l'administration (aujourd'hui les inscriptions arrivent par email).

Un éditeur React complet ne se justifie que si, après quelques semaines d'usage réel, l'absence d'aperçu ou la publication page par page gênent vraiment Elsa.

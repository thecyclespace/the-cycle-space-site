# Guide d'Elsa — modifier ton site toute seule

Pas de code, pas de terminal. Tout se fait dans l'espace d'administration du site.

> **Captures d'écran** : ce guide a été écrit sans accès à ta session d'administration. Pour l'enrichir, fais-toi accompagner une fois par Florent et ajoute 1 capture par scénario dans `docs/guide-elsa/`.

## Avant de commencer

- **Où aller** : `https://thecyclespace.github.io/the-cycle-space-site/admin/` (une fois le domaine branché : `https://thecyclespace.com/admin/`). Utilise **Chrome** ou **Edge**, sur ordinateur.
- **Se connecter** : clique sur **Se connecter avec GitHub** et autorise l'accès. Si ce bouton ne marche pas, vois la section « Connexion » de `CMS_GUIDE.md` ou préviens Florent.
- **Comment ça marche** : tu modifies, tu cliques **Save** (Enregistrer / Publier). Le site se met à jour **1 à 3 minutes plus tard**. Rien n'est jamais perdu : chaque changement garde une version précédente.
- **Menu de gauche** :

| Je veux modifier… | Je clique sur… |
|---|---|
| Les textes du site en français | 🇫🇷 Textes du site — Français |
| Les textes du site en anglais | 🇬🇧 Textes du site — Anglais |
| Un article ou en écrire un | 📝 Articles de blog |
| Mon lien Calendly, mon email, ma photo | ⚙️ Paramètres du site |
| Ce qui s'affiche sur Google / WhatsApp | 🔍 SEO |

Chaque champ a un **petit texte d'aide** sous son nom. Les emojis au début du nom (🎯, 🛠, ❓…) te disent à quelle partie du site il correspond.

> Pense à modifier **les deux langues** (français et anglais) quand tu changes un texte. Le site français vit sous `/fr/` (ex. `…/fr/services/`), l'anglais à la racine.

---

## Scénario 1 — Changer une phrase de l'accueil

1. Menu : **🇫🇷 Textes du site — Français** → **Tous les textes (français)**.
2. Cherche le champ **🎯 Hero — Titre principal** (le grand titre) ou **🎯 Hero — Texte d'introduction**. Les autres textes de l'accueil sont plus bas (✍️ manifeste, 🧬 méthode, 💗 « pour toi »).
3. Modifie la phrase. Garde le titre court (moins de 90 caractères) pour qu'il tienne bien sur téléphone.
4. Clique **Save** en haut à droite.
5. Fais pareil dans **🇬🇧 Textes du site — Anglais** pour la version anglaise.
6. Attends 2 minutes, recharge le site (sur ton téléphone aussi) et vérifie.

## Scénario 2 — Modifier le descriptif d'une offre

1. Menu : **Textes du site — Français** → **Tous les textes**.
2. Descends jusqu'à **🛠 Services — Offres**. Clique sur l'offre (ex. « Le Rhythm Check-In »).
3. Tu peux changer :
   - le **titre** et la petite ligne au-dessus (**tag**, ex. « Séance unique · 90 min »),
   - la **description** (saute une ligne vide pour créer un nouveau paragraphe),
   - **Pour qui** et **Ce que tu emportes** (facultatifs : vides = non affichés),
   - le **prix affiché** (facultatif : vide = aucun prix sur le site),
   - le texte du bouton.
4. Le champ **Action du bouton** choisit ce qui se passe au clic : Calendly (Introduction ou Check-In) ou liste d'attente par email. Ne le change que si tu déplaces l'offre.
5. Pour **changer l'ordre** des offres, fais-les glisser. Pour masquer une offre, supprime-la (il en faut au moins 3).
6. **Save**, puis la même chose en anglais.

## Scénario 3 — Mettre à jour le lien Calendly

1. Dans Calendly, crée un événement par offre (ex. « Introduction », « Rhythm Check-In ») et copie son lien (il commence par `https://calendly.com/`).
2. Menu : **⚙️ Paramètres du site** → **Configuration générale**.
3. Colle le lien dans :
   - **URL Calendly — The Introduction** pour l'appel gratuit,
   - **URL Calendly — Rhythm Check-In** pour la séance de 90 min.
   - **URL Calendly (réservation)** reste le lien général de secours : ne le vide pas.
4. Si le lien n'est pas valide (il doit commencer par `https://calendly.com/`), le CMS te l'indique et refuse d'enregistrer. C'est fait exprès.
5. **Save**, attends 2 minutes, puis **teste en cliquant sur le bouton de réservation** depuis ton téléphone.

> Aujourd'hui, un seul événement existe dans ton Calendly (« 30 Minute Meeting ») : toutes les offres ouvrent donc le même calendrier. Dès que tu crées les événements, colle leurs liens ici.

## Scénario 4 — Ajouter un article avec une photo (d'abord en brouillon)

1. Menu : **📝 Articles de blog** → **New Article** (Nouvel article).
2. Remplis :
   - **Titre**, **Date de publication**, **Extrait** (1 à 3 phrases : c'est ce qui s'affiche sur Google et sur la liste des articles),
   - **Langue de l'article** (Français ou English),
   - **Image de couverture** : clique, **Upload**, choisis ta photo (3 Mo maximum, format paysage conseillé).
3. Écris le texte dans **Contenu de l'article** avec la barre d'outils (titres, listes, gras, liens). Ajoute à l'intérieur une courte phrase « Quand consulter ? » pour tout sujet de santé.
4. **Coche « Brouillon »** puis **Save** : l'article est enregistré mais **invisible** sur le site.
5. Quand tu es prête : ouvre l'article, **décoche « Brouillon »**, **Save**. Il apparaît sur le site après 1 à 3 minutes.
6. Pour la version dans l'autre langue, crée un 2ᵉ article et, dans **Slug de l'article traduit**, indique le nom technique du premier (il apparaît dans l'adresse de l'article). Le bouton FR/EN du site te renverra alors vers la bonne version. Un article en français est publié à l'adresse `…/fr/blog/<nom>`, un article en anglais à `…/blog/<nom>` : c'est le champ **Langue de l'article** qui décide.

## Scénario 5 — Corriger une faute après publication

1. **Textes du site** → même chemin que pour l'écrire, ou **📝 Articles de blog** → clique sur l'article (la liste se trie par date ou par langue).
2. Corrige la faute, **Save**. C'est en ligne 1 à 3 minutes plus tard.
3. Si, par erreur, tu as supprimé ou abîmé un texte : **ne panique pas, rien n'est perdu**. Écris à Florent avec le nom de la page et l'heure : il rétablit la version précédente en quelques minutes depuis l'historique du site (tu n'as pas besoin de toucher à GitHub).

---

## Questions fréquentes

- **Mon changement n'apparaît pas** : attends 3 minutes, puis recharge avec `Ctrl + Maj + R` (ordinateur) ou ouvre le site en navigation privée (téléphone). Toujours rien après 10 minutes ? Préviens Florent.
- **Où voir ce qui est publié ?** Le site lui-même. Il n'y a pas de bouton « aperçu » fiable : enregistre, attends, recharge.
- **Retrouver un article** : 📝 Articles de blog → barre de recherche en haut, ou filtre par langue.
- **Ajouter une image** : à n'importe quel endroit où un champ « image » apparaît, clique **Upload**. Mets un texte descriptif si le champ le demande (utile pour l'accessibilité et Google).
- **Les inscriptions au guide gratuit** arrivent par email à l'adresse indiquée dans **⚙️ Paramètres du site → Email qui reçoit les inscriptions au guide**. La toute première fois, un email de confirmation de **FormSubmit** arrive : clique sur le lien pour activer la réception.
- **Qui contacter ?** Florent.

## Ce qu'il vaut mieux ne pas toucher

- Les champs avec un cadenas ou une liste déroulante imposée (routes, action des boutons).
- Les liens (`https://…`) : copie-les entiers, sans espace.
- Les promesses de santé : reste sur de l'éducation et de l'accompagnement, sans promettre de guérison ni de diagnostic. En cas de doute, demande d'abord à Florent.

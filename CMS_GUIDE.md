# Guide d'édition du site — The Cycle Space (`/admin`)

Ce guide explique, **sans jargon technique**, comment modifier les textes, images, articles
de blog et réglages SEO du site via l'interface d'administration **Sveltia CMS**.

> **Guide simplifié pour Elsa : voir `GUIDE_ELSA.md`.**
>
> En résumé : tu te connectes sur `/admin`, tu modifies, tu cliques **Publish**.
> Ton changement crée automatiquement une sauvegarde sur GitHub, et le site se met à jour
> tout seul (via GitHub Pages) une à deux minutes plus tard.

---

## 1. Comment accéder au CMS

Ouvre ton navigateur (**Chrome** ou **Edge** recommandé) et va à l'adresse :

```
https://TON-SITE/admin
```

(En local pendant le développement : `http://localhost:5173/admin/`.)

---

## 2. Comment se connecter

### Version actuelle — « Sign In with Token » (jeton GitHub)

Sveltia se connecte directement à GitHub. La première fois :

1. Crée un **Personal Access Token (PAT)** GitHub (à faire **une seule fois**) :
   - Connecte-toi sur [github.com](https://github.com) avec le compte qui a accès au dépôt
     `thecyclespace/the-cycle-space-site`.
   - Va sur **Settings → Developer settings → Personal access tokens → Fine-grained tokens →
     Generate new token**.
   - **Repository access** : *Only select repositories* → choisis `the-cycle-space-site`.
   - **Permissions → Repository permissions → Contents** : passe à **Read and write**.
   - Génère le token et **copie-le** (il ne s'affiche qu'une fois).
2. Sur la page `/admin`, clique **« Sign In with Token »**, colle le token, valide.

Le token est mémorisé dans ton navigateur ; tu n'auras pas à le recoller à chaque fois sur
le même appareil.

> 🔒 Garde ce token secret (c'est comme un mot de passe). Si tu le perds ou penses qu'il a fuité,
> supprime-le sur GitHub et génère-en un nouveau.

### Version recommandée plus tard — connexion GitHub en un clic (OAuth)

Pour éviter la manipulation du token (plus simple pour une personne non technique), on peut
déployer gratuitement le **Sveltia CMS Authenticator** sur **Cloudflare Workers**. La connexion
devient un simple bouton **« Login with GitHub »**.

Une fois le worker déployé, il suffit de décommenter la ligne `base_url:` dans
`public/admin/config.yml` et d'y mettre l'adresse du worker. Voir la section **TODO** en bas.

---

## 3. Comment modifier le texte de la page d'accueil

1. Dans le menu de gauche, choisis **« 🌐 Page d'accueil — English »** ou
   **« 🌐 Page d'accueil — Français »** (les deux langues sont séparées).
2. Clique sur l'entrée **« Page d'accueil — EN / FR »**.
3. Les champs sont regroupés par section avec un emoji pour s'y retrouver :
   `🧭 Navigation`, `🎯 Hero` (le grand titre du haut), `✍️ Manifesto`, `🛠 Services`,
   `💗 Pour toi`, `📚 Ressources`, `🎬 CTA final`, `⚓ Pied de page`, etc.
4. Modifie le texte voulu.
5. Clique **Publish** (voir §6).

> ⚠️ EN et FR sont **deux fichiers distincts**. Si tu changes un texte en anglais, pense à
> faire le même changement dans la version française (et inversement).

---

## 4. Comment ajouter / changer une image

1. Sur un champ image (ex. *Image de couverture* d'un article, ou *Image principale* dans
   les Paramètres), clique sur la zone d'upload.
2. Glisse ton fichier ou choisis-en un déjà présent dans la bibliothèque.
3. Les nouvelles images sont rangées automatiquement dans le dossier `public/uploads/`.
4. **Limite : 3 Mo par image.** Au-delà, l'upload est refusé (voir « Erreurs courantes »).

> Les images déjà livrées avec le site (`elsa.jpg`, le PDF du guide) sont à la **racine**
> de `public/`, pas dans `uploads/`. Pour les référencer, saisis simplement leur nom de
> fichier (ex. `elsa.jpg`) dans le champ prévu.

---

## 5. Comment créer un article de blog

1. Menu de gauche → **« 📝 Articles de blog »** → bouton **« New Article »** (Nouvel article).
2. Remplis :
   - **Titre**
   - **Date de publication**
   - **Extrait** (1 à 3 phrases, affiché dans la liste des articles)
   - **Image de couverture** (optionnel, format paysage ~1200×630)
   - **Langue** (Français ou English — l'article n'apparaît que dans la liste de cette langue)
   - **Contenu de l'article** : éditeur riche (titres, listes, gras, liens, images…).
3. **Brouillon** : coche cette case tant que l'article n'est pas prêt → il ne sera **pas**
   visible sur le site. Décoche-la pour le publier.
4. *(Optionnel)* **Outil interactif** : si tu choisis un outil dans la liste, place le marqueur
   `<!-- calculator -->` sur une ligne seule dans le contenu, à l'endroit où l'outil doit apparaître.
5. Clique **Publish**.

---

## 6. Comment publier tes changements

1. En haut à droite de l'éditeur, clique **Publish**.
2. C'est tout. Sveltia enregistre ton changement sous forme de **commit sur GitHub**.

---

## 7. Que se passe-t-il quand tu publies ?

```
Tu cliques "Publish"
   → Sveltia crée un commit sur GitHub (branche main)
      → GitHub Actions reconstruit et publie le site sur GitHub Pages automatiquement
         → 1 à 2 minutes plus tard, le site public est à jour ✅
```

Tu n'as **rien à faire d'autre**. Pas de FTP, pas de copier-coller de fichiers, pas de
manipulation technique. GitHub conserve aussi l'historique : on peut revenir en arrière si besoin.

---

## 8. Erreurs courantes à éviter

- **🖼 Ne mets pas d'images trop lourdes.** Limite 3 Mo. Idéalement, compresse tes photos
  avant l'upload (ex. [squoosh.app](https://squoosh.app), gratuit). Une image légère =
  site plus rapide.
- **👥 Ne modifie pas la même page à deux en même temps** depuis deux navigateurs/appareils
  différents : le dernier qui publie écrase l'autre. Si vous êtes plusieurs, prévenez-vous.
- **⏳ Attends la fin du déploiement.** Après *Publish*, laisse 1 à 2 minutes à GitHub Pages avant
  de vérifier le site public. Si tu rafraîchis trop vite, tu vois encore l'ancienne version.
- **🌐 N'oublie pas l'autre langue.** Un texte changé en EN doit souvent l'être aussi en FR.
- **🔗 Ne touche pas aux « routes » de navigation.** Les libellés du menu sont modifiables,
  mais l'adresse (`/`, `/services`, `/blog`, `/about`) est verrouillée pour ne pas casser les liens.

---

## TODO — améliorations futures (pour le développeur)

- [ ] **Remplacer le login par token par une connexion OAuth GitHub** pour les éditeurs non
      techniques : déployer le **Sveltia CMS Authenticator** sur Cloudflare Workers (gratuit),
      créer une **GitHub OAuth App**, puis renseigner `base_url:` dans
      `public/admin/config.yml`. → bouton « Login with GitHub » en un clic.
- [ ] **Compression d'images automatique** si les éditeurs uploadent souvent des fichiers
      lourds (Sveltia peut redimensionner via `media_libraries → transformations`).
- [ ] **Modèles de prévisualisation (preview)** personnalisés plus tard si utile (Sveltia
      affiche déjà un aperçu intégré du Markdown).
- [ ] **Formulaire « guide PDF »** : le téléchargement du PDF marche, mais la collecte des emails
      a été retirée avec Netlify. La rebrancher via un service externe gratuit (Formspree, Getform…),
      car GitHub Pages est 100 % statique — voir `CMS_MIGRATION_AUDIT.md`.

# Revue éditoriale de la version française

Branche `content/fr-editorial-review`. Périmètre : **tous les textes visibles en français** (JSON, articles, outils, métadonnées SEO, libellés d'accessibilité). Design, composants, routes, slugs, clés JSON, actions Calendly, formules des outils : **inchangés**.

## 1. Audit (avant corrections)

| Constat | Exemples relevés |
|---|---|
| Calques de l'anglais | « ce qui est mis en lumière peut se libérer » · « tu passes de la délégation de ta santé à l'expertise » · « une série t'apporte une transformation » · « le changement arrive quand l'identité évolue » · « des rythmes auxquels ton corps peut répondre » |
| Anglicismes / registre trop familier | « tracker », « tracking », « wellness », « patterns » (×12), « sautes d'humeur », « galère », « si ça colle », « pas juste », « bizarre », « plein d'endroits » |
| Formulations dramatiques ou ambiguës | « par pur désespoir », « des règles qui avaient du sens », « sincèrement, infiniment fascinant » |
| Promesses implicites | « une transformation », « les symptômes sont des signaux, pas du bruit », « ton cycle est le reflet direct de ta santé » |
| Texte anglais dans la version FR | libellés d'accessibilité du menu (« Open menu », « Close booking modal »), texte alternatif de la photo d'Elsa, « EN + FR » sur le guide, noms d'offres à demi traduits |
| Incohérences de vocabulaire | « Fenêtre fertile » / « fenêtre de fertilité », « Pas sûre », « Suggestions douces », « Introduction » / « Check-In » sans explication |
| Information manquante | le guide PDF est **uniquement en anglais** (21 pages, vérifié) mais la page française ne le disait pas |

## 2. Ce qui a été corrigé

**Accueil** : titre, sous-titre, boutons, ligne de confiance, cartes « Qu'est-ce qui t'amène ? » (SPM développé, « Fertilité et signes d'ovulation »), présentation d'Elsa, offres, calculateur (avec mention « résultats indicatifs, pas une contraception »), appel final : textes de la mission appliqués tels quels.

**Accompagnements (ex-Services)** : page réécrite. Navigation : « Accompagnements » (au lieu de « Services »). « The Introduction » devient **Premier échange gratuit** (15 à 20 minutes · En ligne · Sans engagement) ; « The Rhythm Check-In » devient **Rhythm Check-In** (séance individuelle · 90 minutes) ; **Your Inner Rhythm** et **The Inner Space** sont conservés (noms de marque). Boutons : « Réserver un appel gratuit », « Réserver une séance », « Commencer par un appel gratuit », « Être informée du lancement ».

**Méthode Inner Rhythm** : noms anglais conservés (Decode, Regulate, Reconnect, Embody) avec titres français (Comprendre, Poser les bases, Se reconnecter, Trouver son équilibre) ; descriptions, résultats, listes et citations réécrits sans promesse de guérison ni de transformation certaine.

**À propos** : `aboutText` réécrit (mêmes faits, rien d'inventé), structure : qui est Elsa, qualifications, pourquoi, parcours, comment elle accompagne. Titre du récit : « Le parcours d'Elsa ». Manifeste : « Une autre façon de comprendre ton corps ».

**Réservation** : fenêtre (« Choisis le créneau qui te convient… »), « Ouvrir le calendrier », « Chargement du calendrier… », message d'erreur. **Calendly : aucune URL, aucune configuration modifiée.**

**FAQ** (4 questions) · **Guide gratuit et formulaire** (titre, consentement, confirmations, erreurs ; textes alignés sur le fonctionnement réel : email transmis à Elsa, téléchargement indépendant de l'envoi ; mention « Disponible en anglais ») · **Pied de page / mention de santé**.

**Articles** (5, slugs et clés inchangés) : titres, extraits et corps réécrits. Terminologie : « suivi du cycle », « période fertile », « syndrome prémenstruel (SPM) », « SOPK », « température basale », « glaire cervicale ».

**Outils** (textes français uniquement, aucune formule) : « Suggestions douces » devient « Pistes à explorer », « Fenêtre fertile » devient « Période fertile », « Pas sûre » devient « Je ne sais pas », « Début des règles #1 » devient « n°1 », avertissements précisés.

**SEO français** : titres et métadescriptions de l'accueil, des accompagnements, des ressources, de À propos et de la page 404 ; slugs et URL inchangés.

**Accessibilité** : libellés français pour le menu, la navigation, le changement de langue et la fenêtre de réservation ; texte alternatif de la photo d'Elsa éditable (nouveau champ CMS) et en français.

## 3. À valider par Elsa (par ordre d'importance)

1. **Guide PDF en anglais** : la page française indique maintenant « Disponible en anglais ». Souhaite-t-elle une version française ? (21 pages à traduire ; le PDF n'a pas été modifié.)
2. **Récit personnel** : « faute d'autre solution » remplace « par pur désespoir » ; « des cycles plus faciles à comprendre » remplace « des règles qui avaient du sens » ; « un an de difficultés » remplace « un an de galère ». Les faits n'ont pas changé. À relire avec elle.
3. **Plan écrit à la fin du Rhythm Check-In** : le texte indique qu'il est remis (comme dans la version anglaise d'origine). Confirmer que c'est systématique.
4. **Rendez-vous de suivi** après le Check-In : formulé comme une possibilité (la version d'origine suggérait un retour mensuel). À confirmer.
5. **Bouton de « Your Inner Rhythm »** : « Commencer par un appel gratuit » (au lieu de « Découvrir le programme ») car le bouton ouvre le calendrier de l'appel gratuit ; « Découvrir le programme » laisserait croire à une page de présentation. À confirmer, ou à relier à une autre cible.
6. **« Puis-je prendre rendez-vous depuis l'étranger ? »** : réponse prudente (séances en ligne ; question à poser lors de l'appel gratuit). À confirmer selon les règles applicables à sa profession dans chaque pays.
7. **Qualifications** (« M.Ost. — University College of Osteopathy », « Plus de 7 ans de pratique clinique », « Professeure de yoga (200 h RYT) ») : reprises des textes existants, non vérifiées.
8. **Termes** : « Rhythm Check-In » et les quatre noms de phases restent en anglais (marque). Veut-elle des équivalents français partout ?
9. **« 15 à 20 minutes »** (durée réelle de l'appel) plutôt que « 20 minutes ».
10. **Consentement du guide** : sens inchangé (email transmis à Elsa uniquement, désabonnement en répondant). La formulation légale RGPD reste à valider.

## 4. Incohérences FR / EN restantes (version anglaise non modifiée)

- Le hero anglais dit « Feel better in your body », le français « Retrouve confiance en ton corps » (nuance voulue par la mission).
- La FAQ anglaise affirme « open to women worldwide » ; la version française est plus prudente. À aligner après validation.
- Les noms d'offres anglais restent « The Introduction » / « The Rhythm Check-In » ; le français les présente comme « Premier échange gratuit » / « Rhythm Check-In ».
- Les libellés « Services » (EN) et « Accompagnements » (FR) diffèrent : voulu.
- Le champ `jobTitle` des données structurées de la page À propos est en anglais pour les deux langues.

## 5. Tests et vérifications

- `npm test` : 46/46, dont des garde-fous de style (`tests/fr-style.test.mjs`) : aucune expression bannie (calques, anglicismes, registre familier) dans `fr.json`, les articles et les outils ; tutoiement uniquement ; boutons et hero de la mission en place ; actions Calendly inchangées ; libellés d'accessibilité français.
- Parité des clés EN/FR et champs CMS : tests au vert (nouveaux champs : `finalCta`, `homeTool.note`, `imageAlts.elsa`, déclarés dans Sveltia).
- Build de production : OK (19 pages pré-rendues).
- Navigateur (28 chargements, 390 et 1440 px) : aucune erreur console ni d'hydratation ; aucun texte anglais détecté dans les pages françaises (hors noms de marque et sources) ; 0 débordement horizontal de 320 à 1440 px sur 11 pages (un débordement de 25 px sur le titre de la page Accompagnements à 320 px a été corrigé).
- Parcours Calendly : mêmes points d'entrée et mêmes actions (test automatique des actions ; fenêtre vérifiée lors de la phase précédente).
- Captures : `docs/audit/fr-review/` (390 et 1440 px : accueil, accompagnements, à propos, ressources, article).
- **Non testé** : `/admin` en conditions réelles (connexion) ; vrai iPhone/Android ; lecteur d'écran.

## 6. Retour arrière

`git revert` des commits de la branche : les anciens textes sont dans l'historique. Les clés JSON étant inchangées (trois champs ajoutés), le CMS reste compatible dans les deux sens.

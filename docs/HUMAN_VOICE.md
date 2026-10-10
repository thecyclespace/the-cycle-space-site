# Un site qui parle avec la voix d'Elsa

Branche `content/human-voice`. Suite aux retours de premières lectrices :

1. « On ne comprend pas si c'est un médecin, un praticien ou une IA. Ça ne me donne pas confiance. »
2. « Ne pas oublier la ménopause dans les cases. »
3. « Très bien fait mais ça sent l'IA, pour une promesse de service humain. OK pour quelqu'un prêt à acheter, pas pour une femme qui ne sait pas où elle en est. »

## Ce qui a changé

| Retour | Réponse |
|---|---|
| Qui est derrière ? | Le haut de l'accueil montre **la vraie photo d'Elsa** (avec légende) à la place de l'image générée, et dit « Je suis Elsa, ostéopathe ». La page À propos et la première question de la FAQ précisent qu'elle n'est pas médecin. |
| C'est quoi, cette méthode ? | La méthode arrive **juste après le haut de page**, sous le titre « Comment je t'accompagne » : quatre étapes aux noms français, chacune expliquée en une phrase. Les noms anglais (Decode, Regulate…) restent en petit. |
| La ménopause | La carte « Changements hormonaux » devient **« Périménopause et ménopause »**. Le sujet apparaît aussi dans le haut de page et la description Google. |
| Ça sent l'IA | Tout le site passe à la **première personne** (« je »), avec des phrases concrètes à la place des formules générales. Le récit d'Elsa remonte sur l'accueil (« Pourquoi je fais ce métier ») et en deuxième position sur la page À propos. |
| Celle qui ne sait pas où elle en est | Sous les cartes : « Tu ne te reconnais dans aucune case, ou dans plusieurs à la fois ? » avec un lien vers l'appel gratuit. |

L'anglais suit la même structure et la même voix. Calendly, les routes, les outils et les offres sont inchangés.

## Nouveaux champs dans le CMS (français et anglais)

`heroKicker`, `heroCaption`, `method.homeTitle`, `method.phases[].homeTitle`, `method.phases[].short`, `concerns.unsure`, `about.intro`. Le champ « grande photo du haut » est retiré : le haut de page utilise la photo d'Elsa (Réglages du site → Image principale).

## À valider par Elsa

Ces textes parlent en son nom : elle doit les relire et les corriger avec ses mots.

1. **« Je ne suis pas médecin »** (À propos, FAQ) et « je ne pose pas de diagnostic et je ne prescris pas de traitement ».
2. **Son récit à la première personne** (accueil et À propos) : mêmes faits qu'avant, conjugués en « je ».
3. **Les quatre phrases de la méthode** sur l'accueil.
4. **« Une première séance dure 90 minutes »** et la liste de ce qu'elle regarde (cycle, digestion, sommeil, stress, histoire).
5. La citation : « Quand on comprend ce qui se passe dans son corps, on a déjà moins peur. »
6. **« Ici, tout se passe en ligne »** (À propos) : la photo montre une séance d'ostéopathie alors que les offres sont en ligne. À confirmer, ou à préciser si elle reçoit aussi en cabinet.
7. **« Après la séance, je t'envoie un plan écrit »** (Rhythm Check-In) : le moment de l'envoi est à confirmer.
8. **Les citations des quatre phases** (page Accompagnements) : les phrases qui ressemblaient à des témoignages sont remplacées par ce qu'Elsa vise à chaque étape (« Mon but, c'est que tu n'aies plus besoin de moi »).
9. **Diplôme** : « Master d'ostéopathie (M.Ost.), University College of Osteopathy, Londres » et « Professeure de yoga (formation de 200 heures) ».
10. **Langues** : la liste indique quatre langues, les séances sont annoncées en français ou en anglais.
11. **« Praticienne en santé féminine »** n'apparaît plus que dans la liste des qualifications : ce titre n'est pas parlant en français. Quelle formation y a-t-il derrière ?

## Relecture indépendante

Une seconde relecture des textes français a cherché ce qui sonnait encore « machine » ou « agence ». Corrigé : le « nous » institutionnel (remplacé par « on »), les formules de brochure (« adapté à tes besoins », « recommandations personnalisées », « bénéficier »), la mention médicale répétée trois fois à l'identique, « stérilet » classé à tort dans la contraception hormonale, une réponse de FAQ qui tournait en rond, et la contradiction entre « pas en un quart d'heure » et l'appel de 15 minutes.

Non modifié, à décider : les noms anglais des offres (Rhythm Check-In, Your Inner Rhythm, The Inner Space) et des phases, que la relecture juge peu lisibles pour une lectrice française.

## Ce qui reste à faire pour que le site soit vraiment humain

- **De vraies photos d'Elsa.** La seule disponible fait 400 × 400 px. Il en faudrait trois à cinq, d'au moins 1600 px : un portrait, Elsa en visio, Elsa en séance.
- **Les autres images sont générées par IA** (carnet, tisane, intérieur, paysage du bandeau). Elles ne montrent plus de personne, mais de vraies photos seraient préférables.
- **De vrais témoignages**, avec prénom et accord écrit. Les citations des quatre phases, sur la page Accompagnements, ne sont pas des témoignages.
- **Une courte vidéo ou un message audio d'Elsa** serait la meilleure preuve qu'une personne est derrière le site.

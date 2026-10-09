# Brancher thecyclespace.com sur le site (Namecheap → GitHub Pages)

Objectif : que `https://thecyclespace.com` affiche le site hébergé sur GitHub Pages.
Durée : ~10 minutes de manipulation, puis 15 min à quelques heures de propagation DNS.

> Le fichier `public/CNAME` du dépôt contient déjà `thecyclespace.com` : rien à faire côté code.

---

## Étape 1 — Se connecter à Namecheap

1. Va sur https://www.namecheap.com et clique **Sign In**.
2. Connecte-toi avec le compte propriétaire du domaine (Elsa).

## Étape 2 — Ouvrir la gestion DNS

1. Menu de gauche : **Domain List**.
2. Ligne `thecyclespace.com` → bouton **Manage**.
3. Onglet **Domain** : vérifie que **Nameservers** = **Namecheap BasicDNS** (ou *Namecheap Web Hosting DNS*).
   - Si c'est un autre choix (Custom DNS…), repasse sur **Namecheap BasicDNS** et clique sur la coche verte pour valider.
4. Va dans l'onglet **Advanced DNS**.

## Étape 3 — Nettoyer les anciens enregistrements

Dans **HOST RECORDS**, supprime (icône poubelle) tout ce qui pointe ailleurs :

- les enregistrements **A** ou **CNAME** existants pour `@` et `www`
- le **URL Redirect Record** / « parking page » éventuel

Garde tels quels les enregistrements **MX** et **TXT** (ce sont ceux de l'email, ne pas toucher).

## Étape 4 — Ajouter les 5 enregistrements

Clique **ADD NEW RECORD** pour chacun :

| Type          | Host  | Value                      | TTL       |
|---------------|-------|----------------------------|-----------|
| A Record      | `@`   | `185.199.108.153`          | Automatic |
| A Record      | `@`   | `185.199.109.153`          | Automatic |
| A Record      | `@`   | `185.199.110.153`          | Automatic |
| A Record      | `@`   | `185.199.111.153`          | Automatic |
| CNAME Record  | `www` | `thecyclespace.github.io.` | Automatic |

Clique sur la **coche verte** (Save) à droite de chaque ligne.

> Le point final dans `thecyclespace.github.io.` est normal ; si Namecheap le refuse, enlève-le.

## Étape 5 — Configurer GitHub Pages (propriétaire du dépôt)

1. Dépôt `thecyclespace/the-cycle-space-site` → **Settings** → **Pages**.
2. **Source** : *GitHub Actions* (déjà en place).
3. **Custom domain** : saisis `thecyclespace.com` → **Save**.
4. Attends que le message « DNS check successful » apparaisse (quelques minutes à quelques heures).
5. Coche **Enforce HTTPS** dès qu'elle devient cliquable (le certificat est créé automatiquement).

## Étape 6 — Vérifier

- Attends 15 à 60 minutes (jusqu'à 24 h dans de rares cas).
- Ouvre https://thecyclespace.com : le site doit s'afficher avec le cadenas HTTPS.
- Ouvre https://www.thecyclespace.com : doit rediriger vers `thecyclespace.com`.
- Contrôle de la propagation : https://dnschecker.org (entre `thecyclespace.com`, type **A** → 4 adresses `185.199.x.153`).

## En cas de problème

| Symptôme | Cause probable | Solution |
|---|---|---|
| « DNS check unsuccessful » sur GitHub | DNS pas encore propagé ou ancien A record resté | Revérifier l'étape 3, patienter |
| Page « Parked » Namecheap | URL Redirect / parking record non supprimé | Le supprimer (étape 3) |
| Erreur de certificat HTTPS | Certificat pas encore généré | Attendre, puis cocher *Enforce HTTPS* |
| Le site fonctionne mais l'email ne marche plus | MX/TXT supprimés par erreur | Les recréer depuis la config de la messagerie |

## Sécurité

- Active la **double authentification (2FA)** sur le compte Namecheap : Profile → Security.
- Ne partage plus les mots de passe par WhatsApp ; utilise plutôt un gestionnaire de mots de passe, ou l'ajout d'un accès délégué (Profile → Sharing & Access).

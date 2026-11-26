# Calendrier de l'après

Site statique (HTML/CSS/JS pur) : **37 portes à ouvrir du 26 décembre au 31 janvier**, une nouvelle porte accessible chaque jour à minuit, avec un lien externe par jour. Aucune installation ni build nécessaire.

## Fonctionnement

- Une porte est **disponible seulement à partir de sa date** (heure locale du visiteur). Les autres affichent un cadenas.
- Les portes déjà ouvertes sont mémorisées dans le navigateur (`localStorage`) et restent ouvertes toute l'édition.
- Une nouvelle édition recommence automatiquement le 26 décembre suivant.
- Hors période (du 1er février au 25 décembre), le site affiche l'édition à venir, avec toutes les portes fermées et un compte à rebours jusqu'au 26 décembre.
- Bouton « Mode aperçu » en bas de page (`?preview=1`) : débloque toutes les portes pour vérifier le rendu. Il n'enregistre aucune ouverture.

## Personnaliser les liens

Tout se passe dans [`app.js`](app.js), au tout début du fichier :

```js
const LINKS = [
  "https://exemple.fr/jour-01", // 26 décembre
  // ... 37 URLs au total, jusqu'au 31 janvier
];
```

Remplacez les 37 URLs d'exemple par vos liens. L'ordre est :

| Index | Dates |
| --- | --- |
| 0 → 5 | 26 → 31 décembre |
| 6 → 36 | 1 → 31 janvier |

Par défaut, le nom affiché dans la fenêtre est le domaine du lien. Pour afficher un nom personnalisé, renseignez le tableau `NAMES` juste en dessous (un nom par jour, dans le même ordre) :

```js
const NAMES = [
  "Ma super plateforme", // 26 décembre
  // ...
];
```

Pour modifier les textes d'introduction, éditez [`index.html`](index.html). Les couleurs et la mise en page sont dans [`styles.css`](styles.css) (variables en haut du fichier).

## Publier sur GitHub Pages

1. Créez un dépôtGitHub et uploadez les trois fichiers (`index.html`, `styles.css`, `app.js`) à la racine.
2. Dans le dépôt, allez dans **Settings → Pages**.
3. Sous **Build and deployment**, choisissez **Deploy from a branch**.
4. Sélectionnez la branche `main` (ou `master`) et le dossier `/ (root)`, puis **Save**.
5. Votre site sera disponible sur `https://<votre-pseudo>.github.io/<nom-du-depot>/`.

Aucune configuration supplémentaire n'est nécessaire : les chemins des fichiers sont relatifs.

## Vérifier avant la date d'ouverture

Ouvrez `index.html?preview=1` en local, ou `https://<votre-pseudo>.github.io/<nom-du-depot>/?preview=1` une fois publié : toutes les portes seront cliquables pour tester les liens et le rendu.

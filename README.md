# Calendrier de l'après — Coach Annabh

Site statique (HTML/CSS/JS pur), inspiré de l'univers de [coachannabh.com](https://coachannabh.com/) : fond noir `#1e1e1e`, rouge `#b40225`, typographie Arimo, blocs numérotés et mise en page épurée.

**37 portes à ouvrir du 26 décembre au 31 janvier.** Chaque porte cache un lien vers un entraînement ou une recette.

## Fonctionnement

- Une porte est disponible seulement à partir de sa date (heure locale du visiteur) ; les autres affichent un cadenas.
- Quand la porte est ouverte, elle révèle le type de surprise (entraînement / recette) et son titre ; le lien s'ouvre dans la fenêtre.
- Les portes ouvertes sont mémorisées dans le navigateur pour l'édition en cours.
- Nouvelle édition automatique chaque 26 décembre.
- Hors période, le site affiche l'édition à venir avec le compte à rebours jusqu'au 26 décembre.
- `?preview=1` débloque toutes les portes pour tester sans attendre la date.

## Remplir les 37 liens

Tout se passe dans [`app.js`](app.js), au début du fichier, dans le tableau `DAYS` :

```js
const DAYS = [
  { type: "entrainement", title: "Full body 20 min", url: "https://..." }, // 26 décembre
  { type: "recette",      title: "Bowl protéiné",     url: "https://..." }, // 27 décembre
  // ... jusqu'au 31 janvier (37 lignes)
];
```

- `type` : `"entrainement"` ou `"recette"` (change l'icône, le libellé et le bouton).
- `title` : le texte révélé quand la porte est ouverte.
- `url` : le lien externe. Laissez `""` si vous ne l'avez pas encore : le bouton affichera « Lien à ajouter ».

Ordre des jours : index 0→5 = 26→31 décembre, index 6→36 = 1→31 janvier.

Le logo (`logo.png`) apparaît en blanc dans le hero et en rouge dans l'en-tête (via un masque CSS).

Les textes d'introduction sont dans [`index.html`](index.html), les couleurs et la mise en page dans [`styles.css`](styles.css).

## GitHub Pages

Le dépôt est `QcJwim/calendrier-apres`, publié via `main` / racine :
https://qcjwim.github.io/calendrier-apres/

Après modification d'un fichier, uploadez-le dans le dépôt (Add file → Upload files) et attendez la reconstruction de GitHub Pages (quelques secondes).

Aperçu complet : https://qcjwim.github.io/calendrier-apres/?preview=1

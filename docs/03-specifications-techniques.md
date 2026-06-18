# Spécifications techniques — Globe Interactif 3D

Date : 18 juin 2026

## 1. Stack technique

Le projet doit utiliser :

- React ;
- Vite ;
- JavaScript ;
- Three.js ;
- react-globe.gl ;
- CSS classique ;
- données locales JSON / GeoJSON ;
- GitHub Pages pour le déploiement.

## 2. Choix techniques

## React

React est utilisé pour construire l’interface avec des composants réutilisables.

## Vite

Vite est utilisé pour créer un projet React moderne, rapide à lancer en développement et facile à compiler.

## Three.js

Three.js permet d’afficher de la 3D dans le navigateur grâce à WebGL.

## react-globe.gl

react-globe.gl simplifie la création d’un globe 3D interactif basé sur Three.js.

## Données locales

Les données doivent être locales dans le projet pour éviter de dépendre d’une API externe en V1.

## 3. Installation attendue

Commandes souhaitées :

```bash
npm install
npm run dev
npm run build
```

## 4. Dépendances recommandées

Dépendances principales :

```bash
npm install react-globe.gl three
```

Dépendances optionnelles :

```bash
npm install lucide-react
```

Pour GitHub Pages, si on utilise une action GitHub, il n’est pas obligatoire d’ajouter une dépendance de déploiement.

## 5. Organisation du code

Le code doit être séparé en composants.

Ne pas tout coder dans `App.jsx`.

Chaque composant doit avoir un rôle clair.

## 6. Arborescence technique

```txt
src/
  App.jsx
  main.jsx
  components/
    Header.jsx
    GlobeViewer.jsx
    CountryPanel.jsx
    SearchBar.jsx
    LoadingScreen.jsx
    ErrorMessage.jsx
  data/
    countries-info.js
    water-labels.js
    countries.geojson
  hooks/
    useCountries.js
  utils/
    normalizeText.js
    countryHelpers.js
  styles/
    global.css
    layout.css
    globe.css
    panel.css
```

## 7. Gestion des données

### countries.geojson

Contient les géométries des pays.

Format attendu :

```json
{
  "type": "FeatureCollection",
  "features": []
}
```

Chaque feature doit contenir un nom de pays dans `properties`.

Les clés possibles à gérer :

- `ADMIN`
- `NAME`
- `name`
- `sovereignt`
- `SOVEREIGNT`

Il faut créer une fonction utilitaire pour récupérer le meilleur nom disponible.

### countries-info.js

Contient les informations affichées dans la fiche pays.

### water-labels.js

Contient les labels des mers et océans.

## 8. Fonctions utilitaires

### normalizeText.js

Objectif :
normaliser les textes pour faciliter la recherche.

Fonctions attendues :

```js
export function normalizeText(value) {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
```

### countryHelpers.js

Fonctions possibles :

- `getCountryName(feature)`
- `findCountryInfo(countryName)`
- `getCountryCoordinates(countryName)`
- `matchCountryBySearch(searchValue)`

## 9. Composant GlobeViewer

Rôle :
afficher le globe et gérer les interactions 3D.

Props recommandées :

```jsx
<GlobeViewer
  countries={countries}
  selectedCountry={selectedCountry}
  hoveredCountry={hoveredCountry}
  onCountryHover={setHoveredCountry}
  onCountrySelect={setSelectedCountry}
/>
```

Responsabilités :

- afficher la texture du globe ;
- afficher les polygones des pays ;
- gérer le hover ;
- gérer le clic ;
- afficher les labels des océans ;
- orienter la caméra si un pays est recherché.

## 10. Composant CountryPanel

Rôle :
afficher les données du pays sélectionné.

Props :

```jsx
<CountryPanel
  country={selectedCountry}
  onClose={handleClosePanel}
/>
```

Règles :

- si `country` vaut `null`, afficher un message d’aide ;
- ne jamais planter si une propriété est absente ;
- prévoir un bouton de fermeture.

## 11. Composant SearchBar

Rôle :
permettre la recherche de pays.

Props :

```jsx
<SearchBar
  countriesInfo={countriesInfo}
  onCountrySearch={handleCountrySearch}
/>
```

Règles :

- recherche insensible à la casse ;
- recherche avec suppression des accents ;
- affichage d’un message si aucun résultat.

## 12. Performance

Règles :

- éviter les re-renders inutiles ;
- utiliser `useMemo` si nécessaire ;
- éviter de charger un GeoJSON trop lourd ;
- préférer un fichier simplifié pour la V1 ;
- afficher un loading screen pendant le chargement.

## 13. Accessibilité

Règles :

- contraste suffisant ;
- textes lisibles ;
- boutons avec `aria-label` si nécessaire ;
- navigation clavier minimum pour la recherche ;
- messages d’erreur compréhensibles.

## 14. Gestion des erreurs

L’application doit gérer :

- fichier GeoJSON absent ;
- pays sans information détaillée ;
- recherche sans résultat ;
- problème de chargement du globe.

L’utilisateur ne doit jamais voir une page blanche.

## 15. Build

La commande suivante doit fonctionner :

```bash
npm run build
```

Le dossier généré est :

```txt
dist/
```

## 16. Déploiement GitHub Pages

Le projet doit pouvoir être déployé sur GitHub Pages avec GitHub Actions.

Le fichier `vite.config.js` devra prévoir une base adaptée au nom du dépôt.

Exemple :

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/globe-interactif-3d/"
});
```

Si le dépôt est publié sur un domaine personnalisé ou à la racine d’un site utilisateur, cette valeur pourra changer.

## 17. Tests manuels attendus

Avant validation :

- ouvrir la page d’accueil ;
- vérifier l’affichage du globe ;
- tourner le globe ;
- zoomer ;
- cliquer sur plusieurs pays ;
- rechercher France, Japon, Brésil ;
- tester sur mobile ;
- lancer `npm run build`.

# Arborescence et routes — Globe Interactif 3D

Date : 18 juin 2026

## 1. Objectif

Définir l’organisation du projet React et les routes de l’application.

La V1 est une application monopage. Il n’y a pas de backend.

## 2. Arborescence cible

```txt
globe-interactif-3d/
  .github/
    workflows/
      deploy.yml
  public/
    textures/
      earth-blue-marble.jpg
      earth-night.jpg
    icons/
      favicon.svg
  src/
    components/
      Header.jsx
      GlobeViewer.jsx
      CountryPanel.jsx
      SearchBar.jsx
      LoadingScreen.jsx
      ErrorMessage.jsx
      OceanLegend.jsx
    data/
      countries.geojson
      countries-info.js
      water-labels.js
    hooks/
      useCountries.js
    utils/
      normalizeText.js
      countryHelpers.js
    styles/
      global.css
      layout.css
      header.css
      globe.css
      panel.css
      search.css
    App.jsx
    main.jsx
  docs/
    01-cahier-des-charges.md
    02-specifications-fonctionnelles.md
    03-specifications-techniques.md
    04-arborescence-et-routes.md
    05-design-ux-ui.md
    06-backlog-user-stories.md
    07-plan-deploiement-github-pages.md
    08-roadmap.md
  AGENTS.md
  README.md
  index.html
  package.json
  vite.config.js
```

## 3. Rôle des dossiers

## public/

Contient les fichiers statiques accessibles directement.

Exemples :

- textures de la Terre ;
- favicon ;
- images génériques.

## src/components/

Contient les composants React réutilisables.

## src/data/

Contient les données locales.

## src/hooks/

Contient les hooks personnalisés.

## src/utils/

Contient les fonctions utilitaires.

## src/styles/

Contient les fichiers CSS.

## docs/

Contient les documents de conception.

## .github/workflows/

Contient le workflow de déploiement GitHub Pages.

## 4. Routes de l’application

La V1 peut fonctionner sans `react-router-dom`.

Elle peut être une Single Page Application simple accessible à la racine.

## Route principale

| Route | Composant | Description |
|---|---|---|
| `/` | `App.jsx` | Page principale avec globe interactif |

## Routes possibles en V2

Si le projet évolue avec `react-router-dom`, on pourra ajouter :

| Route | Composant | Description |
|---|---|---|
| `/` | `HomePage.jsx` | Accueil avec globe |
| `/country/:slug` | `CountryPage.jsx` | Page détaillée d’un pays |
| `/ocean/:slug` | `OceanPage.jsx` | Page détaillée d’un océan ou d’une mer |
| `/quiz` | `QuizPage.jsx` | Quiz géographique |
| `/about` | `AboutPage.jsx` | Présentation du projet |

## 5. Composants détaillés

## Header.jsx

Affiche :

- nom du projet ;
- phrase d’introduction ;
- barre de recherche ou accès rapide à la recherche.

## GlobeViewer.jsx

Affiche :

- globe 3D ;
- pays ;
- frontières ;
- labels des océans ;
- interaction hover/click.

## CountryPanel.jsx

Affiche :

- fiche pays ;
- informations principales ;
- bouton fermer.

## SearchBar.jsx

Permet :

- recherche de pays ;
- sélection automatique ;
- message aucun résultat.

## LoadingScreen.jsx

Affiche un chargement pendant l’initialisation.

## ErrorMessage.jsx

Affiche une erreur propre si les données ne chargent pas.

## OceanLegend.jsx

Affiche une petite légende des océans visibles sur le globe.

## 6. Flux de données

```txt
App.jsx
  charge les données pays
  stocke selectedCountry
  stocke hoveredCountry
  transmet les données à GlobeViewer
  transmet selectedCountry à CountryPanel
  transmet la recherche à SearchBar
```

## 7. États React principaux

```js
const [countries, setCountries] = useState([]);
const [selectedCountry, setSelectedCountry] = useState(null);
const [hoveredCountry, setHoveredCountry] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
```

## 8. Données locales

## countries-info.js

Informations textuelles affichées dans le panneau.

## countries.geojson

Frontières des pays.

## water-labels.js

Positions approximatives des mers et océans principaux.

## 9. Naming recommandé

Noms de fichiers :

- PascalCase pour les composants React ;
- camelCase pour les fonctions ;
- kebab-case pour les fichiers CSS si souhaité ;
- noms explicites.

Exemples :

```txt
CountryPanel.jsx
GlobeViewer.jsx
normalizeText.js
countryHelpers.js
```

## 10. Règles importantes pour Codex

- Ne pas créer de backend.
- Ne pas ajouter Symfony en V1.
- Ne pas utiliser Google Maps.
- Ne pas mettre toute la logique dans `App.jsx`.
- Ne pas charger les données depuis une API payante.
- Prévoir un build compatible GitHub Pages.

# Globe Interactif 3D

Application React/Vite permettant d'explorer la Terre sous forme de globe 3D interactif, sans Google Maps, sans backend et sans API payante.

## Fonctionnalités V1

- Globe 3D avec texture locale de la Terre.
- Rotation souris/tactile et zoom via `react-globe.gl`.
- Pays et frontières chargés depuis un GeoJSON local.
- Survol et sélection visuelle d'un pays.
- Fiche pays pour toutes les entités du GeoJSON local, avec 8 fiches enrichies en priorité.
- Recherche insensible à la casse et aux accents.
- Recentrage approximatif sur les pays documentés.
- Labels des principaux océans et de la mer Méditerranée.
- Interface sombre, responsive et prête pour GitHub Pages.

## Installation

```bash
npm install
npm run dev
```

Avec la configuration GitHub Pages actuelle, Vite sert l'application sous :

```txt
http://localhost:5173/map/
```

## Build

```bash
npm run build
npm run preview
```

Le build de production est généré dans `dist/`.

## Déploiement GitHub Pages

Le workflow se trouve dans `.github/workflows/deploy.yml`.

La configuration Vite utilise :

```js
base: "/map/"
```

Dans GitHub, activer `Settings > Pages > Build and deployment > GitHub Actions`, puis pousser sur `main`.

## Données locales

- `src/data/countries.geojson` contient les géométries simplifiées des pays.
- `src/data/countries-info.js` contient une base locale de 252 entrées issue de `mledoze/countries` et enrichie avec les populations de `samayo/country-json`.
- Les cas GeoJSON Northern Cyprus et Somaliland sont ajoutés manuellement pour couvrir toutes les entités cliquables.
- France, Italie, Espagne, Allemagne, États-Unis, Japon, Brésil et Australie disposent de descriptions enrichies en priorité.
- `src/data/water-labels.js` contient les labels des mers et océans.
- `public/textures/earth-blue-marble.jpg` et `public/textures/earth-night.jpg` sont des textures statiques locales.

## Limites V1

- Tous les pays du GeoJSON sont cliquables et reconnus par une fiche locale.
- Les populations sont indicatives et stockées localement pour la V1.
- Les mers et océans sont affichés comme labels, sans fiche ni interaction dédiée.
- Les données de population et de superficie sont indicatives et pourront être enrichies en V1.2.

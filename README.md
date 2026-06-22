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
http://localhost:5174/map/
```

## Build

```bash
npm run build
npm run preview
```

Le build de production est généré dans `dist/`.

## Régénérer les villes

Les villes sont générées depuis le fichier gratuit GeoNames `cities1000.zip`.

```bash
# Extraire cities1000.txt dans .tmp/cities1000/ puis lancer :
npm run generate:cities
```

Le script recrée `public/data/cities/` avec un fichier JSON par pays.

## Déploiement GitHub Pages

Le workflow se trouve dans `.github/workflows/deploy.yml` et publie le dossier `dist/` sur la branche `gh-pages`.

La configuration Vite utilise :

```js
base: "/map/"
```

Dans GitHub, activer `Settings > Pages > Build and deployment > Source > Deploy from a branch`, choisir la branche `gh-pages` et le dossier `/ (root)`, puis pousser sur `main`.

## Données locales

- `src/data/countries.geojson` contient les géométries Natural Earth 1:50m des pays pour des frontières plus nettes.
- `src/data/countries-info.js` contient une base locale de 252 entrées issue de `mledoze/countries` et enrichie avec les populations de `samayo/country-json`.
- Les cas GeoJSON Northern Cyprus et Somaliland sont présents dans la source Natural Earth 1:50m pour couvrir ces entités cliquables.
- France, Italie, Espagne, Allemagne, États-Unis, Japon, Brésil et Australie disposent de descriptions enrichies en priorité.
- `public/data/cities/` contient les villes locales par pays, générées depuis GeoNames `cities1000` : lieux peuplés de plus de 1 000 habitants, sous licence Creative Commons Attribution. Attribution : https://www.geonames.org/
- `src/data/cities.js` contient le chargeur utilisé par le globe pour récupérer uniquement les villes du pays zoomé.
- `src/data/water-labels.js` contient les labels des mers et océans.
- `public/textures/earth-blue-marble.jpg` et `public/textures/earth-night.jpg` sont des textures statiques locales.
- `public/textures/moon-color.jpg` et `public/textures/moon-bump.jpg` proviennent du CGI Moon Kit de la NASA SVS : https://svs.gsfc.nasa.gov/4720/
- `public/textures/sun-sdo.jpg` provient d'une image NASA/SDO AIA 304 : https://commons.wikimedia.org/wiki/File:The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg

## Limites V1

- Tous les pays du GeoJSON sont cliquables et reconnus par une fiche locale.
- Les populations sont indicatives et stockées localement pour la V1.
- Les villes proviennent de GeoNames `cities1000` : les très petits villages ou lieux sans population renseignée peuvent être absents.
- Les mers et océans sont affichés comme labels, sans fiche ni interaction dédiée.
- Les données de population et de superficie sont indicatives et pourront être enrichies en V1.2.
- La trajectoire de la Lune suit une approximation orbitale inclinée et elliptique, avec une distance visuellement compressée pour rester lisible autour du globe.
- Le disque du Soleil respecte le rapport réel rayon/distance ; son halo est un repère visuel volontairement renforcé.

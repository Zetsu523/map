# AGENTS.md — Instructions pour Codex

## Projet

Nom du projet : Globe Interactif 3D

Objectif :
Créer une application React permettant d’explorer la planète sous forme de globe 3D interactif.

Le projet doit être inspiré d’une expérience cartographique comme Google Maps / Google Earth, mais sans utiliser Google Maps, sans API payante, et sans backend pour la V1.

## Stack obligatoire

- React
- Vite
- JavaScript
- CSS classique
- Three.js
- react-globe.gl
- Données locales JSON / GeoJSON
- GitHub Pages pour le déploiement

## Règles importantes

- Ne pas créer de backend.
- Ne pas ajouter Symfony en V1.
- Ne pas utiliser TypeScript sauf demande explicite.
- Ne pas utiliser Google Maps.
- Ne pas utiliser d’API payante.
- Ne pas mettre toute la logique dans `App.jsx`.
- Séparer les composants.
- Garder le code clair et compréhensible.
- Créer un projet lançable avec `npm install` puis `npm run dev`.
- Le build doit fonctionner avec `npm run build`.
- Le projet doit être compatible GitHub Pages.

## Objectif V1

La V1 doit permettre :

- d’afficher un globe 3D ;
- de tourner autour du globe ;
- de zoomer ;
- de voir les pays ;
- de voir les frontières ;
- de survoler un pays ;
- de cliquer sur un pays ;
- d’afficher une fiche pays ;
- de rechercher un pays ;
- d’afficher visuellement les océans ;
- d’afficher quelques labels d’océans ;
- d’avoir une interface responsive ;
- de déployer sur GitHub Pages.

## Arborescence à respecter

```txt
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
```

## Composants attendus

### Header.jsx

Afficher le nom du projet et une courte phrase d’introduction.

### GlobeViewer.jsx

Afficher le globe 3D, les pays, les frontières, les labels océans, et gérer les interactions.

### CountryPanel.jsx

Afficher les informations du pays sélectionné.

### SearchBar.jsx

Permettre la recherche d’un pays.

### LoadingScreen.jsx

Afficher un état de chargement.

### ErrorMessage.jsx

Afficher une erreur propre.

### OceanLegend.jsx

Afficher une petite légende pour les mers et océans.

## Données attendues

Créer les fichiers suivants :

- `countries-info.js`
- `water-labels.js`
- `countries.geojson`

Si un GeoJSON complet n’est pas disponible, créer un fichier minimal et indiquer clairement dans le README qu’il faudra remplacer ce fichier par un vrai GeoJSON simplifié des pays.

## Données pays de test

Ajouter au minimum :

- France
- Italie
- Espagne
- Allemagne
- États-Unis
- Japon
- Brésil
- Australie

Chaque pays doit contenir :

- name
- aliases
- continent
- capital
- population
- area
- lat
- lng
- description

## Style attendu

- Thème sombre.
- Interface moderne.
- Globe mis en avant.
- Panneau d’information lisible.
- Responsive desktop/tablette/mobile.
- Boutons accessibles.
- Texte en français.

## Qualité du code

- Utiliser des noms de variables clairs.
- Éviter le code dupliqué.
- Gérer les erreurs.
- Gérer les données manquantes.
- Commenter uniquement les parties complexes.
- Ne pas installer de dépendances inutiles.

## Tests à faire avant de considérer la tâche terminée

Lancer :

```bash
npm install
npm run build
```

Vérifier manuellement :

- le globe s’affiche ;
- la rotation fonctionne ;
- le zoom fonctionne ;
- le clic pays fonctionne ;
- le panneau pays fonctionne ;
- la recherche fonctionne ;
- le responsive est correct ;
- aucune page blanche n’apparaît.

## Déploiement

Prévoir un fichier :

```txt
.github/workflows/deploy.yml
```

Le déploiement doit publier le dossier `dist` sur GitHub Pages.

## Important

Si une fonctionnalité est trop complexe pour la V1, créer une version simple mais propre, puis documenter l’amélioration possible dans le README.

Priorité absolue :
avoir une V1 fonctionnelle et stable plutôt qu’une version très ambitieuse mais cassée.

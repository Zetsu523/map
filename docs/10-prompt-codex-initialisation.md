# Prompt Codex — Initialisation du projet

Copier-coller ce prompt dans Codex pour lancer le projet.

---

Tu es un développeur React expérimenté.

Crée un projet React avec Vite appelé `globe-interactif-3d`.

Le projet doit créer une application web interactive affichant une planète en 3D.

L’utilisateur doit pouvoir :

- voir un globe terrestre ;
- faire tourner le globe ;
- zoomer ;
- voir les pays et frontières ;
- survoler un pays ;
- cliquer sur un pays ;
- afficher une fiche d’information du pays ;
- rechercher un pays ;
- voir les océans visuellement ;
- voir quelques labels d’océans ;
- utiliser l’application sur desktop, tablette et mobile.

Technologies obligatoires :

- React
- Vite
- JavaScript
- CSS classique
- Three.js
- react-globe.gl
- Données locales JSON / GeoJSON

Contraintes :

- pas de backend ;
- pas de Symfony en V1 ;
- pas de TypeScript ;
- pas de Google Maps ;
- pas d’API payante ;
- pas de base de données ;
- code organisé en composants ;
- projet compatible GitHub Pages ;
- interface en français ;
- design sombre, moderne et immersif.

Crée l’arborescence suivante :

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

Créer aussi :

```txt
.github/workflows/deploy.yml
README.md
AGENTS.md
vite.config.js
```

Fonctionnalités à développer :

1. Initialiser le projet Vite React.
2. Installer les dépendances nécessaires.
3. Créer le layout principal.
4. Afficher un globe 3D.
5. Charger les pays depuis `countries.geojson`.
6. Afficher les pays sous forme de polygones.
7. Ajouter un effet de survol sur les pays.
8. Ajouter un clic sur les pays.
9. Afficher la fiche du pays sélectionné.
10. Ajouter une recherche insensible à la casse et aux accents.
11. Ajouter quelques labels d’océans depuis `water-labels.js`.
12. Ajouter un design responsive.
13. Ajouter un workflow GitHub Pages.
14. Ajouter un README complet.

Données pays de test à ajouter dans `countries-info.js` :

- France
- Italie
- Espagne
- Allemagne
- États-Unis
- Japon
- Brésil
- Australie

Chaque pays doit avoir :

- name
- aliases
- continent
- capital
- population
- area
- lat
- lng
- description

Règles de qualité :

- Ne pas tout mettre dans `App.jsx`.
- Ne pas créer de backend.
- Gérer les erreurs de chargement.
- Gérer les pays sans fiche détaillée.
- Le site ne doit jamais afficher une page blanche.
- Le build doit fonctionner avec `npm run build`.

À la fin, donne-moi :

- la liste des fichiers créés ;
- les commandes à lancer ;
- les points restant à améliorer ;
- les éventuelles limites de la V1.

# Cahier des charges — Globe Interactif 3D

Date : 18 juin 2026

## 1. Présentation du projet

Le projet consiste à créer une application web interactive permettant d’explorer la planète sous forme de globe 3D.

L’utilisateur doit pouvoir interagir avec la Terre de manière intuitive : tourner le globe, zoomer, survoler les pays, cliquer sur un pays et afficher des informations.

Le projet doit être développé en JavaScript avec React.

## 2. Contexte

L’objectif est de créer une expérience proche d’un globe numérique interactif.

Le projet s’inspire de l’expérience utilisateur de services cartographiques comme Google Maps ou Google Earth, mais sans utiliser leurs API.

Le projet doit être libre, léger, éducatif et adapté à un déploiement statique sur GitHub Pages.

## 3. Objectifs principaux

- Créer une application React moderne.
- Afficher une planète en 3D.
- Permettre l’interaction avec la Terre.
- Afficher tous les pays grâce à des données géographiques.
- Afficher les mers et océans de manière visuelle.
- Afficher des informations sur les pays.
- Créer une interface agréable, responsive et simple à utiliser.
- Préparer une base propre pour des évolutions futures.

## 4. Public cible

Le site peut être utilisé par :

- des élèves ;
- des étudiants ;
- des curieux ;
- des enseignants ;
- des utilisateurs souhaitant découvrir les pays du monde ;
- des utilisateurs sur ordinateur ou smartphone.

## 5. Périmètre de la V1

### Fonctionnalités incluses

La V1 doit inclure :

- affichage d’un globe 3D ;
- rotation du globe à la souris ;
- rotation du globe au doigt sur mobile ;
- zoom avant/arrière ;
- affichage des pays ;
- affichage des frontières ;
- survol d’un pays avec effet visuel ;
- clic sur un pays ;
- panneau d’information du pays sélectionné ;
- recherche par nom de pays ;
- recentrage approximatif du globe sur un pays recherché ;
- affichage des océans par la texture de la Terre ;
- affichage de labels pour les principaux océans ;
- interface responsive ;
- page d’accueil intégrée à l’application ;
- déploiement possible sur GitHub Pages.

### Fonctionnalités exclues de la V1

La V1 ne doit pas inclure :

- compte utilisateur ;
- authentification ;
- backend Symfony ;
- base de données serveur ;
- API Google Maps ;
- itinéraires ;
- GPS réel ;
- calcul de trajet ;
- météo en direct ;
- données politiques temps réel ;
- traduction automatique ;
- mode multijoueur ;
- application mobile native.

## 6. Contraintes techniques

- Application développée avec React.
- Projet initialisé avec Vite.
- Langage : JavaScript.
- Utilisation possible de Three.js et react-globe.gl.
- Données géographiques locales au format GeoJSON ou JSON.
- Déploiement statique compatible GitHub Pages.
- Code clair, organisé et maintenable.
- Pas d’API payante.
- Pas de dépendance à Google Maps.

## 7. Contraintes design

Le site doit être :

- moderne ;
- immersif ;
- lisible ;
- responsive ;
- accessible ;
- simple à comprendre.

Le design recommandé est un thème sombre avec une planète mise en valeur.

## 8. Livrables attendus

- Application React fonctionnelle.
- Dossier `src` organisé.
- Données de test.
- Composants séparés.
- Fichier README.
- Fichier AGENTS.md.
- Workflow de déploiement GitHub Pages.
- Documentation de conception.

## 9. Critères de réussite

Le projet est considéré comme réussi si :

- `npm install` fonctionne ;
- `npm run dev` lance le projet ;
- `npm run build` compile le projet ;
- le globe s’affiche ;
- le globe peut être tourné ;
- le zoom fonctionne ;
- les pays sont visibles ;
- le clic sur un pays fonctionne ;
- la fiche pays s’affiche ;
- la recherche fonctionne ;
- le site est responsive ;
- le site peut être déployé sur GitHub Pages.

## 10. Risques identifiés

### Performance

Le chargement d’un GeoJSON trop lourd peut ralentir l’application.

Solution :
- utiliser un fichier GeoJSON simplifié ;
- limiter les effets visuels lourds ;
- charger les données proprement.

### Complexité 3D

La 3D peut être plus complexe qu’une interface classique.

Solution :
- commencer avec react-globe.gl ;
- éviter de coder directement toute la scène Three.js à la main en V1.

### Mobile

Les interactions tactiles peuvent être différentes de la souris.

Solution :
- tester rapidement sur smartphone ;
- simplifier l’interface mobile.

### Données géographiques

Les données pays peuvent avoir des noms différents de ceux utilisés dans les fiches.

Solution :
- créer une fonction de normalisation des noms ;
- prévoir des alias pour certains pays.

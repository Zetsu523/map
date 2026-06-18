# Documentation de conception — Globe Interactif 3D

Date : 18 juin 2026

## Objectif de ce dossier

Ce dossier contient les documents de conception nécessaires pour lancer un projet React avec Codex.

Le projet consiste à créer une application web interactive inspirée de l’expérience Google Maps / Google Earth, mais sans utiliser l’API Google Maps.

L’application doit afficher une planète interactive en 3D, permettre la rotation, le zoom, le clic sur les pays, l’affichage de fiches d’information, ainsi qu’une première représentation des mers et océans.

## Liste des documents

- `01-cahier-des-charges.md`
- `02-specifications-fonctionnelles.md`
- `03-specifications-techniques.md`
- `04-arborescence-et-routes.md`
- `05-design-ux-ui.md`
- `06-backlog-user-stories.md`
- `07-plan-deploiement-github-pages.md`
- `08-roadmap.md`
- `09-AGENTS.md`
- `10-prompt-codex-initialisation.md`
- `11-checklist-recette.md`

## Nom provisoire du projet

Nom technique : `globe-interactif-3d`

Nom affiché dans l’interface : `Globe Interactif 3D`

Le nom pourra être modifié plus tard.

## Résumé simple

Créer un site React permettant d’explorer la Terre sous forme de globe 3D :

- voir la planète ;
- voir les continents ;
- voir les pays ;
- voir les océans et mers principales ;
- tourner autour du globe ;
- zoomer ;
- cliquer sur un pays ;
- afficher une fiche pays ;
- rechercher un pays ;
- utiliser le site sur ordinateur, tablette et mobile.

## Principe important

Le but n’est pas de refaire Google Maps complet dès la V1.

La V1 doit être propre, stable et présentable.

Les fonctionnalités complexes comme les itinéraires, le GPS, la météo en direct, les images satellites avancées ou les données temps réel sont prévues plus tard, uniquement si le projet évolue.

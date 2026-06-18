# Backlog et user stories — Globe Interactif 3D

Date : 18 juin 2026

## 1. Méthode

Le backlog est organisé par priorité.

- Must have : obligatoire pour la V1.
- Should have : important mais peut être amélioré après.
- Could have : bonus.
- Won’t have V1 : exclu de la première version.

## 2. Backlog priorisé

## Must have — V1 obligatoire

| ID | Fonctionnalité | Priorité |
|---|---|---|
| US01 | Voir un globe 3D | Must |
| US02 | Tourner le globe | Must |
| US03 | Zoomer sur le globe | Must |
| US04 | Voir les pays et frontières | Must |
| US05 | Survoler un pays | Must |
| US06 | Cliquer sur un pays | Must |
| US07 | Afficher une fiche pays | Must |
| US08 | Rechercher un pays | Must |
| US09 | Interface responsive | Must |
| US10 | Build fonctionnel | Must |
| US11 | Déploiement GitHub Pages | Must |

## Should have — important

| ID | Fonctionnalité | Priorité |
|---|---|---|
| US12 | Recentrer le globe après recherche | Should |
| US13 | Afficher labels océans | Should |
| US14 | Afficher loading screen | Should |
| US15 | Gérer proprement les erreurs | Should |
| US16 | Ajouter plusieurs données pays de test | Should |

## Could have — bonus

| ID | Fonctionnalité | Priorité |
|---|---|---|
| US17 | Ajouter drapeaux | Could |
| US18 | Ajouter capitales sur le globe | Could |
| US19 | Ajouter mode nuit | Could |
| US20 | Ajouter quiz géographique | Could |
| US21 | Ajouter favoris locaux | Could |

## Won’t have V1

| ID | Fonctionnalité | Raison |
|---|---|---|
| W01 | GPS réel | Trop complexe pour la V1 |
| W02 | Itinéraires | Nécessite API ou moteur dédié |
| W03 | Backend Symfony | Pas nécessaire en V1 |
| W04 | Authentification | Hors périmètre V1 |
| W05 | Météo temps réel | API externe |
| W06 | Données satellites avancées | Trop lourd |

## 3. User stories détaillées

## US01 — Voir un globe 3D

En tant qu’utilisateur, je veux voir la Terre en 3D afin d’avoir une expérience immersive.

Critères d’acceptation :

- Le globe s’affiche au chargement.
- Le globe est centré.
- Le globe est visible sur desktop et mobile.

## US02 — Tourner le globe

En tant qu’utilisateur, je veux faire tourner le globe afin d’explorer différentes zones du monde.

Critères d’acceptation :

- Le drag souris fonctionne.
- Le tactile fonctionne sur mobile.
- La rotation est fluide.

## US03 — Zoomer sur le globe

En tant qu’utilisateur, je veux zoomer sur la planète afin de mieux voir les pays.

Critères d’acceptation :

- La molette permet de zoomer.
- Le zoom ne casse pas l’affichage.
- Le globe reste visible.

## US04 — Voir les pays et frontières

En tant qu’utilisateur, je veux voir les pays et leurs frontières afin de comprendre la géographie mondiale.

Critères d’acceptation :

- Les pays sont affichés.
- Les frontières sont visibles.
- Les polygones suivent la forme du globe.

## US05 — Survoler un pays

En tant qu’utilisateur, je veux qu’un pays réagisse au survol afin de comprendre qu’il est interactif.

Critères d’acceptation :

- Le pays survolé change d’apparence.
- Le nom du pays peut être visible.
- L’effet disparaît après le survol.

## US06 — Cliquer sur un pays

En tant qu’utilisateur, je veux cliquer sur un pays afin d’obtenir des informations.

Critères d’acceptation :

- Le clic sélectionne le pays.
- Le pays sélectionné est mis en évidence.
- Le panneau d’information s’ouvre.

## US07 — Afficher une fiche pays

En tant qu’utilisateur, je veux lire une fiche simple afin d’en savoir plus sur le pays.

Critères d’acceptation :

- Le nom du pays s’affiche.
- La capitale s’affiche si elle existe.
- Le continent s’affiche si disponible.
- Une description s’affiche.
- Le panneau peut être fermé.

## US08 — Rechercher un pays

En tant qu’utilisateur, je veux rechercher un pays par son nom afin de le trouver rapidement.

Critères d’acceptation :

- La recherche fonctionne avec majuscules et minuscules.
- La recherche gère les accents autant que possible.
- Un message apparaît si aucun résultat n’est trouvé.

## US09 — Interface responsive

En tant qu’utilisateur mobile, je veux pouvoir utiliser l’application sur smartphone.

Critères d’acceptation :

- Le globe est visible sur mobile.
- Le panneau ne déborde pas.
- Les boutons sont faciles à toucher.

## US10 — Build fonctionnel

En tant que développeur, je veux compiler le projet afin de vérifier qu’il est prêt pour la production.

Critères d’acceptation :

- `npm run build` fonctionne.
- Aucun fichier essentiel n’est manquant.
- Le dossier `dist` est généré.

## US11 — Déploiement GitHub Pages

En tant que développeur, je veux déployer le site sur GitHub Pages afin de le rendre accessible en ligne.

Critères d’acceptation :

- Le workflow GitHub Actions existe.
- Le build est publié.
- Le site est accessible depuis l’URL GitHub Pages.

## 4. Découpage conseillé pour Codex

## Étape 1

Créer le projet Vite React et l’arborescence.

## Étape 2

Installer les dépendances 3D.

## Étape 3

Créer l’interface de base.

## Étape 4

Afficher le globe.

## Étape 5

Charger les pays GeoJSON.

## Étape 6

Ajouter hover et clic.

## Étape 7

Créer la fiche pays.

## Étape 8

Créer la recherche.

## Étape 9

Ajouter responsive.

## Étape 10

Ajouter GitHub Pages.

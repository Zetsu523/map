# Spécifications fonctionnelles — Globe Interactif 3D

Date : 18 juin 2026

## 1. Objectif fonctionnel

L’application doit permettre à un utilisateur d’explorer un globe terrestre interactif et d’obtenir des informations simples sur les pays.

## 2. Parcours utilisateur principal

1. L’utilisateur arrive sur le site.
2. Il voit un globe 3D.
3. Il peut faire tourner le globe.
4. Il peut zoomer ou dézoomer.
5. Il peut survoler un pays.
6. Le pays survolé est mis en évidence.
7. Il peut cliquer sur un pays.
8. Une fiche d’information s’ouvre.
9. Il peut rechercher un pays dans la barre de recherche.
10. Le pays recherché est sélectionné et la fiche s’affiche.

## 3. Fonctionnalités détaillées

## F01 — Affichage du globe

### Description

Afficher une planète en 3D au centre de l’écran.

### Règles

- Le globe doit être visible au chargement de la page.
- Une texture de Terre peut être utilisée.
- Les océans doivent être visibles grâce à la texture ou au fond du globe.
- Le globe doit rester lisible sur mobile.

### Critères d’acceptation

- Le globe apparaît sans erreur.
- Le globe occupe la zone principale de la page.
- L’application ne plante pas si les données pays ne sont pas encore chargées.

## F02 — Rotation du globe

### Description

Permettre à l’utilisateur de faire tourner le globe avec la souris ou le tactile.

### Règles

- Sur desktop : clic maintenu + déplacement souris.
- Sur mobile : glissement du doigt.
- La rotation doit être fluide.

### Critères d’acceptation

- L’utilisateur peut tourner le globe horizontalement.
- L’utilisateur peut tourner le globe verticalement.
- Le globe ne sort pas de l’écran.

## F03 — Zoom

### Description

Permettre de zoomer et dézoomer.

### Règles

- Sur desktop : molette de souris.
- Sur mobile : pincement si supporté par la librairie.
- Le zoom doit être limité pour éviter de traverser la planète.

### Critères d’acceptation

- Le zoom avant fonctionne.
- Le zoom arrière fonctionne.
- Le globe reste visible.

## F04 — Affichage des pays

### Description

Afficher les pays à partir d’un fichier GeoJSON.

### Règles

- Chaque pays doit être affiché sous forme de polygone.
- Les frontières doivent être visibles.
- Les pays doivent être cliquables.

### Critères d’acceptation

- Plusieurs pays sont visibles.
- Les frontières sont compréhensibles.
- Les polygones sont alignés sur le globe.

## F05 — Survol d’un pays

### Description

Quand l’utilisateur survole un pays, celui-ci doit changer d’apparence.

### Règles

- Le pays survolé doit être mis en valeur.
- Le curseur peut changer pour montrer que l’élément est interactif.
- Le nom du pays peut apparaître dans une infobulle simple.

### Critères d’acceptation

- Le pays survolé change de couleur ou de luminosité.
- Le nom du pays est disponible visuellement.
- L’effet disparaît quand le curseur quitte le pays.

## F06 — Sélection d’un pays

### Description

Quand l’utilisateur clique sur un pays, ce pays devient sélectionné.

### Règles

- Un seul pays est sélectionné à la fois.
- Le pays sélectionné doit rester mis en évidence.
- Les informations du pays doivent s’afficher dans le panneau.

### Critères d’acceptation

- Le clic sélectionne le pays.
- Le panneau affiche le bon nom.
- Cliquer sur un autre pays remplace la sélection.

## F07 — Panneau d’information pays

### Description

Afficher une fiche d’information du pays sélectionné.

### Contenu minimum

- Nom du pays.
- Continent.
- Capitale.
- Population si disponible.
- Surface si disponible.
- Description courte.
- Bouton de fermeture.

### Règles

- Si aucune donnée complète n’existe, afficher au minimum le nom du pays.
- Ne pas faire planter l’application si une information manque.
- Sur mobile, le panneau doit apparaître en bas.

### Critères d’acceptation

- Le panneau s’ouvre après sélection.
- Les informations sont lisibles.
- Le panneau peut être fermé.

## F08 — Recherche de pays

### Description

Permettre à l’utilisateur de rechercher un pays par son nom.

### Règles

- La recherche doit être insensible aux majuscules/minuscules.
- La recherche doit gérer les accents autant que possible.
- La recherche doit afficher un résultat clair.
- Si le pays n’existe pas, afficher un message simple.

### Critères d’acceptation

- Rechercher “France” trouve la France.
- Rechercher “france” trouve la France.
- Rechercher un pays inexistant ne plante pas l’application.

## F09 — Recentrage sur un pays recherché

### Description

Quand un pays est recherché, le globe doit se positionner approximativement vers ce pays.

### Règles

- Utiliser des coordonnées latitude/longitude stockées dans les données.
- Si les coordonnées ne sont pas disponibles, afficher seulement la fiche.
- Le recentrage doit être fluide si la librairie le permet.

### Critères d’acceptation

- Rechercher “Japon” oriente le globe vers le Japon.
- La fiche du pays s’affiche.
- L’absence de coordonnées ne bloque pas l’application.

## F10 — Affichage des océans et mers

### Description

Afficher les océans et mers principales.

### V1 attendue

- Les océans sont visibles grâce à la texture de la Terre.
- Des labels peuvent indiquer :
  - Océan Atlantique ;
  - Océan Pacifique ;
  - Océan Indien ;
  - Océan Arctique ;
  - Océan Austral ;
  - Mer Méditerranée.

### Évolution V2

- Rendre les mers et océans cliquables.
- Afficher une fiche dédiée pour chaque mer ou océan.

### Critères d’acceptation

- Les océans sont visibles.
- Les principaux labels ne gênent pas la lisibilité du globe.

## F11 — Responsive

### Description

Adapter l’interface aux différentes tailles d’écran.

### Desktop

- Globe principal centré ou à gauche.
- Panneau d’information à droite.

### Mobile

- Globe en haut.
- Panneau d’information en bas.
- Barre de recherche accessible.

### Critères d’acceptation

- L’interface ne déborde pas.
- Le texte reste lisible.
- Les boutons restent utilisables au doigt.

## 4. États de l’application

### État initial

- Aucun pays sélectionné.
- Globe visible.
- Message : “Cliquez sur un pays pour afficher ses informations.”

### État de chargement

- Afficher un écran ou un message de chargement.
- Ne pas afficher d’erreur brutale.

### État pays sélectionné

- Pays mis en évidence.
- Fiche affichée.

### État erreur données

- Afficher un message propre si le fichier GeoJSON n’est pas trouvé.
- L’application doit rester utilisable autant que possible.

## 5. Données pays

Structure recommandée :

```js
export const countriesInfo = {
  France: {
    name: "France",
    aliases: ["France", "République française"],
    continent: "Europe",
    capital: "Paris",
    population: "Environ 68 millions",
    area: "551 695 km²",
    lat: 46.2276,
    lng: 2.2137,
    description: "Pays d’Europe occidentale connu pour sa culture, son histoire et sa gastronomie."
  }
};
```

## 6. Données océans

Structure recommandée :

```js
export const waterLabels = [
  {
    name: "Océan Atlantique",
    type: "océan",
    lat: 0,
    lng: -30
  },
  {
    name: "Mer Méditerranée",
    type: "mer",
    lat: 36,
    lng: 15
  }
];
```

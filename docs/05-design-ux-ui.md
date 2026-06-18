# Design UX/UI — Globe Interactif 3D

Date : 18 juin 2026

## 1. Objectif design

Créer une interface immersive et moderne donnant l’impression d’explorer la planète.

L’utilisateur doit comprendre immédiatement qu’il peut interagir avec le globe.

## 2. Direction artistique

Ambiance souhaitée :

- spatiale ;
- moderne ;
- sombre ;
- éducative ;
- premium ;
- lisible.

Le globe doit être l’élément principal.

## 3. Style visuel

## Couleurs recommandées

| Usage | Couleur proposée |
|---|---|
| Fond principal | `#050816` |
| Fond panneau | `rgba(8, 15, 35, 0.88)` |
| Texte principal | `#ffffff` |
| Texte secondaire | `#b8c7e0` |
| Accent bleu | `#38bdf8` |
| Accent vert | `#22c55e` |
| Pays survolé | bleu clair transparent |
| Pays sélectionné | vert lumineux transparent |
| Bordures | `rgba(255, 255, 255, 0.14)` |

## Typographie

Police recommandée :

- `Inter`, `system-ui`, `Arial`, `sans-serif`.

Hiérarchie :

- titre principal : 28 à 36 px desktop ;
- texte normal : 15 à 17 px ;
- petits labels : 12 à 14 px.

## 4. Layout desktop

Disposition recommandée :

```txt
+------------------------------------------------------+
| Header : titre + recherche                           |
+------------------------------------------------------+
|                                                      |
|  Globe interactif 3D                  Panneau pays   |
|                                                      |
+------------------------------------------------------+
```

Le globe doit occuper environ 65 à 75 % de la largeur.

Le panneau pays doit occuper environ 25 à 35 % de la largeur.

## 5. Layout mobile

Disposition recommandée :

```txt
+----------------------------+
| Header compact             |
| Recherche                  |
+----------------------------+
| Globe 3D                   |
|                            |
+----------------------------+
| Panneau pays en bas        |
+----------------------------+
```

Sur mobile :

- réduire les marges ;
- éviter les panneaux trop larges ;
- permettre le scroll du panneau ;
- garder les boutons tactiles assez grands.

## 6. Comportement UX

## État initial

Afficher une aide simple :

“Faites tourner la planète et cliquez sur un pays pour en savoir plus.”

## Survol pays

Le pays survolé doit changer d’apparence.

Objectif :
faire comprendre qu’il est cliquable.

## Sélection pays

Le pays sélectionné doit rester visible avec une couleur différente.

Le panneau d’information doit s’ouvrir ou se mettre à jour.

## Recherche

La recherche doit être visible et facile à utiliser.

Placeholder recommandé :

“Rechercher un pays…”

## Erreur recherche

Message recommandé :

“Aucun pays trouvé pour cette recherche.”

## Chargement

Message recommandé :

“Chargement du globe…”

## 7. Composants UI

## Header

Contenu :

- logo ou icône planète ;
- nom du projet ;
- courte phrase d’accroche.

Exemple :

Titre :
“Globe Interactif 3D”

Sous-titre :
“Explorez la planète, découvrez les pays, mers et océans.”

## SearchBar

Éléments :

- champ texte ;
- bouton optionnel ;
- message d’erreur discret.

## CountryPanel

Sections :

- nom du pays ;
- continent ;
- capitale ;
- population ;
- superficie ;
- description ;
- bouton fermer.

## OceanLegend

Petite légende :

- océans visibles ;
- mers principales ;
- indication que les mers/océans cliquables seront prévus en V2.

## 8. Accessibilité

Règles :

- contraste élevé ;
- textes lisibles ;
- taille de bouton suffisante ;
- focus visible sur les champs ;
- `aria-label` sur les boutons iconiques ;
- ne pas se baser uniquement sur la couleur pour comprendre une action.

## 9. Animations

Animations recommandées :

- apparition douce du panneau ;
- transition sur les boutons ;
- hover léger ;
- rotation fluide du globe.

Animations à éviter :

- trop de mouvements automatiques ;
- clignotements ;
- effets lourds qui ralentissent le site.

## 10. Maquette textuelle

## Desktop

```txt
[🌍 Globe Interactif 3D]       [ Rechercher un pays... ]

-------------------------------------------------------

       🌍 GLOBE 3D INTERACTIF              +----------------------+
                                           | France               |
                                           | Europe               |
                                           | Capitale : Paris     |
                                           | Population : ...     |
                                           | Description ...      |
                                           | [Fermer]             |
                                           +----------------------+
```

## Mobile

```txt
🌍 Globe Interactif 3D
[ Rechercher un pays... ]

        🌍
   Globe interactif

+----------------------------+
| France                     |
| Capitale : Paris           |
| Description ...            |
+----------------------------+
```

## 11. Règles de qualité visuelle

- Le globe ne doit pas être coupé.
- Le panneau ne doit pas cacher tout le globe sur desktop.
- Sur mobile, le panneau peut être en bas.
- Les textes doivent être lisibles sans zoom navigateur.
- Les couleurs doivent rester sobres.

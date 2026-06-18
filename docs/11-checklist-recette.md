# Checklist de recette — Globe Interactif 3D

Date : 18 juin 2026

## Objectif

Cette checklist sert à vérifier que la V1 est bien terminée.

## 1. Installation

- [ ] Le projet se clone correctement.
- [ ] `npm install` fonctionne.
- [ ] `npm run dev` fonctionne.
- [ ] L’application s’ouvre dans le navigateur.
- [ ] Aucune erreur bloquante dans la console.

## 2. Build

- [ ] `npm run build` fonctionne.
- [ ] Le dossier `dist` est généré.
- [ ] `npm run preview` fonctionne si disponible.

## 3. Globe

- [ ] Le globe s’affiche.
- [ ] Le globe est centré.
- [ ] Le globe est visible sur desktop.
- [ ] Le globe est visible sur mobile.
- [ ] La texture de la Terre est chargée.

## 4. Interactions

- [ ] La rotation souris fonctionne.
- [ ] La rotation tactile fonctionne.
- [ ] Le zoom fonctionne.
- [ ] Le globe ne disparaît pas au zoom.
- [ ] Les interactions restent fluides.

## 5. Pays

- [ ] Les pays s’affichent.
- [ ] Les frontières sont visibles.
- [ ] Le survol d’un pays fonctionne.
- [ ] Le clic sur un pays fonctionne.
- [ ] Le pays sélectionné reste mis en évidence.

## 6. Fiche pays

- [ ] La fiche s’affiche après clic.
- [ ] Le nom du pays est correct.
- [ ] La capitale s’affiche si disponible.
- [ ] Le continent s’affiche si disponible.
- [ ] La description s’affiche.
- [ ] Le bouton fermer fonctionne.
- [ ] Une donnée manquante ne casse pas la fiche.

## 7. Recherche

- [ ] Rechercher “France” fonctionne.
- [ ] Rechercher “france” fonctionne.
- [ ] Rechercher un pays avec accent fonctionne si prévu.
- [ ] Rechercher un pays inexistant affiche un message.
- [ ] La recherche ne provoque pas d’erreur console.

## 8. Océans et mers

- [ ] Les océans sont visibles sur la texture.
- [ ] Les labels principaux sont visibles.
- [ ] Les labels ne gênent pas trop la navigation.
- [ ] La légende explique le fonctionnement.

## 9. Responsive

- [ ] Desktop OK.
- [ ] Tablette OK.
- [ ] Mobile OK.
- [ ] Le panneau pays ne déborde pas.
- [ ] Les boutons sont utilisables au doigt.
- [ ] La recherche reste accessible.

## 10. Accessibilité

- [ ] Contraste suffisant.
- [ ] Textes lisibles.
- [ ] Focus visible sur le champ de recherche.
- [ ] Boutons avec texte ou aria-label.
- [ ] Pas de texte trop petit.

## 11. Déploiement GitHub Pages

- [ ] `vite.config.js` contient la bonne base.
- [ ] `.github/workflows/deploy.yml` existe.
- [ ] GitHub Pages est configuré sur GitHub Actions.
- [ ] Le workflow passe au vert.
- [ ] Le site est accessible en ligne.
- [ ] Les assets chargent correctement en ligne.

## 12. Validation finale

- [ ] La V1 correspond au cahier des charges.
- [ ] Les fonctionnalités Must Have sont terminées.
- [ ] Le README explique l’installation.
- [ ] Le README explique le déploiement.
- [ ] Les limites de la V1 sont documentées.

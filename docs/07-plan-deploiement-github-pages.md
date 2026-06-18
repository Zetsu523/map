# Plan de déploiement GitHub Pages — Globe Interactif 3D

Date : 18 juin 2026

## 1. Objectif

Déployer l’application React sur GitHub Pages.

Le projet est une application statique générée par Vite.

## 2. Pré-requis

- Avoir un dépôt GitHub.
- Avoir le projet React dans le dépôt.
- Avoir un build fonctionnel avec `npm run build`.
- Avoir configuré `vite.config.js`.

## 3. Configuration Vite

Dans `vite.config.js`, ajouter la base correspondant au nom du dépôt.

Exemple si le dépôt s’appelle `globe-interactif-3d` :

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/globe-interactif-3d/"
});
```

Si le site est déployé sur un domaine personnalisé ou à la racine d’un site utilisateur, cette configuration pourra être différente.

## 4. Script package.json

Vérifier que les scripts existent :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 5. Workflow GitHub Actions

Créer le fichier :

```txt
.github/workflows/deploy.yml
```

Contenu recommandé :

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 6. Configuration GitHub

Dans le dépôt GitHub :

1. Aller dans `Settings`.
2. Aller dans `Pages`.
3. Dans `Build and deployment`, choisir `GitHub Actions`.
4. Pousser le code sur la branche `main`.
5. Vérifier l’onglet `Actions`.
6. Ouvrir l’URL générée par GitHub Pages.

## 7. Commandes locales avant push

Avant de pousser :

```bash
npm install
npm run build
```

Si le build fonctionne :

```bash
git add .
git commit -m "docs: add conception documents"
git push
```

## 8. Problèmes possibles

## Page blanche après déploiement

Cause possible :
`base` incorrect dans `vite.config.js`.

Solution :
vérifier que `base` correspond exactement au nom du dépôt.

## Assets non chargés

Cause possible :
chemins absolus incorrects.

Solution :
utiliser les chemins compatibles avec Vite et le dossier `public`.

## Workflow échoue sur npm ci

Cause possible :
absence de `package-lock.json`.

Solution :
lancer `npm install`, committer `package-lock.json`, puis relancer.

## Build échoue

Cause possible :
erreur JavaScript, import manquant ou fichier absent.

Solution :
tester en local avec :

```bash
npm run build
```

## 9. Checklist déploiement

- [ ] Le projet est sur GitHub.
- [ ] `npm run build` fonctionne en local.
- [ ] `vite.config.js` contient la bonne base.
- [ ] Le workflow `deploy.yml` existe.
- [ ] GitHub Pages est configuré sur GitHub Actions.
- [ ] Le workflow passe au vert.
- [ ] Le site est accessible en ligne.

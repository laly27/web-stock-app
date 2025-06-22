# 🍽️ web stock app - Application de Gestion de Stock

Une application web moderne de gestion de stock pour restaurant, développée avec Nuxt.js 3, Pinia et Tailwind CSS.

## 🌐 Démonstration en ligne

**Testez l'application directement :** [https://web-stock-app.netlify.app/](https://web-stock-app.netlify.app/)

## ✨ Fonctionnalités

- **Dashboard interactif** avec statistiques en temps réel
- **Gestion des produits** : ajout, modification, suppression avec catégorisation
- **Système de commandes** avec décrément automatique du stock
- **Génération de factures** imprimables au format HTML
- **Statistiques détaillées** : produits les plus vendus, revenus, analyses
- **Interface responsive** adaptée mobile et desktop
- **Persistance locale** : toutes les données stockées dans le navigateur (localStorage)
- **Navigation intuitive** avec sidebar et header dynamiques

## 🛠️ Technologies utilisées

- **Nuxt.js 3** - Framework Vue.js full-stack
- **Vue 3** avec Composition API
- **Pinia** - Gestion d'état moderne pour Vue
- **Tailwind CSS** - Framework CSS utilitaire
- **localStorage** - Persistance des données côté client

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm, yarn ou pnpm

## 🚀 Installation et démarrage

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd sunu-resto
```

### 2. Installer les dépendances

```bash
# Avec npm
npm install

# Avec yarn
yarn install

# Avec pnpm
pnpm install
```

### 3. Démarrer le serveur de développement

```bash
# Avec npm
npm run dev

# Avec yarn
yarn dev

# Avec pnpm
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📦 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation de la build
npm run preview

# Génération statique
npm run generate
```

## 📱 Pages de l'application

### 🏠 Dashboard (/)
- Vue d'ensemble avec métriques clés
- Statistiques : total produits, stock, commandes, revenus
- Commandes récentes et alertes stock faible

### 🍽️ Produits (/produits)
- Liste complète des produits avec filtres
- Ajout/modification/suppression de produits
- Gestion des catégories et du stock
- Recherche et tri par catégorie

### 🛒 Commandes (/commandes)
- Création de nouvelles commandes
- Sélection de produits avec quantités
- Calcul automatique des totaux
- Historique des commandes

### 🧾 Factures (/factures)
- Consultation des factures par commande
- Génération de factures imprimables
- Détails complets des transactions

### 📈 Statistiques (/stats)
- Analyse des ventes et performances
- Produits les plus vendus
- Revenus par période
- Analyse du stock

## 💾 Stockage des données

L'application utilise le **localStorage** du navigateur pour persister les données :
- `sunu-resto-products` : Liste des produits
- `sunu-resto-orders` : Historique des commandes

Les données sont automatiquement sauvegardées à chaque modification et rechargées au démarrage de l'application.

## 🎨 Design et UX

- **Palette de couleurs** : Bleu primaire, vert succès, orange alerte
- **Typographie** : Police Inter pour une lisibilité optimale
- **Responsive** : Interface adaptée à tous les écrans
- **Animations** : Transitions fluides et micro-interactions
- **Accessibilité** : Contrastes respectés et navigation intuitive

## 🔧 Structure du projet

```
sunu-resto/
├── assets/css/          # Styles globaux et Tailwind
├── components/          # Composants Vue réutilisables
├── pages/              # Pages de l'application (routing automatique)
├── stores/             # Stores Pinia (products, orders)
├── public/             # Assets statiques
└── nuxt.config.ts      # Configuration Nuxt
```

## 📝 Utilisation

### Ajouter des produits
1. Aller sur la page "Produits"
2. Cliquer sur "Ajouter un produit"
3. Remplir le formulaire (nom, catégorie, prix, stock)
4. Valider

### Créer une commande
1. Aller sur la page "Commandes"
2. Cliquer sur "Nouvelle commande"
3. Sélectionner les produits et quantités
4. Saisir le nom du client
5. Confirmer la commande

### Générer une facture
1. Aller sur la page "Factures"
2. Sélectionner une commande
3. Cliquer sur "Imprimer" pour générer le PDF

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Génération statique (recommandé)
```bash
npm run generate
```

Les fichiers générés dans le dossier `dist/` peuvent être déployés sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages, etc.).


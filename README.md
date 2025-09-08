# test-hellowork

## Description

**test-hellowork** est une application Node.js qui récupère des offres d’emploi depuis l'API France Travail, les stocke dans une base SQLite et expose une API REST pour les consulter.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur (pour le support natif de fetch)
- [npm](https://www.npmjs.com/)
- (Optionnel) [sqlite3](https://www.sqlite.org/) CLI pour explorer la base
- (Optionnel) [SQLite Viewer](https://beta.sqliteviewer.app/) Extension vs code pour visualiser les bases sqlite

---

## Configuration

1. **Cloner le dépôt :**
   ```sh
   git clone https://github.com/your-username/test-hellowork.git
   cd test-hellowork
   ```

2. **Installer les dépendances :**
   ```sh
   npm install
   ```

3. **Variables d’environnement :**

   Copiez le fichier `.env` exemple :
   ```sh
   cp .env.example .env
   ```
   Ensuite éditez directement le fichier `.env` :
   ```
   DB_NAME="db.sqlite"
   PORT=3000
   ENV=development
   JOBS_API_URL="https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search"
   JOBS_API_AUTH_URL="https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire"
   JOBS_API_CLIENT_ID="VOTRE_CLIENT_ID"
   JOBS_API_SECRET_KEY="VOTRE_CLIENT_SECRET"
   ```

---

## Lancer en développement

1. **Démarrer le serveur API avec rechargement automatique (nodemon) :**
   ```sh
   npm start
   ```
   Le serveur démarre sur le port défini dans `.env` (par défaut : 3000).

2. **Planificateur de jobs :**
   Le planificateur (Bree) s'exécute automatiquement et récupère les offres toutes les 5 minutes.

---

## Lancer en production

1. **Démarrer le serveur :**
   ```sh
   npm start
   ```

2. **Pensez à mettre `ENV=production` dans votre fichier `.env` pour activer le mode production.**

---

## Lancement de l'application
La commande npm start démarre PM2 qui lance en tâche de fond l'api et le planificateur de jobs.

## Endpoints de l'API

- `GET /api/offers` — Liste les offres (supporte `?city=Paris` et `?limit=10`)
- `GET /api/offers/:code` — Détail d’une offre

---

## Base de données

- L'application utilise SQLite par défaut (`db.sqlite`).
- Les tables sont créées automatiquement au premier lancement.

---

## Dépannage

- **Erreurs de connexion à l’API :** Vérifiez votre connexion internet, proxy/firewall et vos identifiants API.
- **Erreurs de base de données :** Vérifiez que l’application a les droits d’écriture sur le dossier contenant `db.sqlite`.

---

##
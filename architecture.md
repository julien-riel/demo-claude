# Architecture - Simulateur de Portefeuille Boursier

## Vue d'ensemble de l'architecture

Cette application suit une architecture client-serveur avec une API REST Node.js/Express et une Single Page Application (SPA) frontend.

```
┌─────────────────┐    HTTP/REST     ┌─────────────────┐    Database     ┌─────────────────┐
│   SPA Frontend  │ ◄──────────────► │  Express.js API │ ◄──────────────► │   PostgreSQL    │
│   (React/Vue)   │                  │    (Node.js)    │                  │    Database     │
└─────────────────┘                  └─────────────────┘                  └─────────────────┘
         │                                    │
         │                                    │
         ▼                                    ▼
┌─────────────────┐                  ┌─────────────────┐
│   Static Files  │                  │  External APIs  │
│   (CSS, JS)     │                  │  (NYSE Data)    │
└─────────────────┘                  └─────────────────┘
```

## Backend Architecture - Express.js REST API

### Structure du projet
```
backend/
├── src/
│   ├── controllers/          # Contrôleurs REST
│   │   ├── portfolioController.js
│   │   ├── transactionController.js
│   │   └── authController.js
│   ├── services/             # Logique métier
│   │   ├── portfolioService.js
│   │   ├── transactionService.js
│   │   ├── xirrService.js
│   │   └── nyseDataService.js
│   ├── models/               # Modèles de données
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Portfolio.js
│   ├── routes/               # Définition des routes
│   │   ├── api.js
│   │   ├── portfolio.js
│   │   └── transactions.js
│   ├── middleware/           # Middleware Express
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/                # Utilitaires
│   │   ├── xirr.js
│   │   └── dateUtils.js
│   └── config/               # Configuration
│       ├── database.js
│       └── environment.js
├── tests/                    # Tests unitaires et d'intégration
├── package.json
└── server.js                 # Point d'entrée
```

### API Endpoints

#### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/logout` - Déconnexion

#### Transactions
- `GET /api/transactions` - Liste des transactions
- `POST /api/transactions` - Créer une transaction
- `PUT /api/transactions/:id` - Modifier une transaction
- `DELETE /api/transactions/:id` - Supprimer une transaction
- `POST /api/transactions/import` - Importer des transactions

#### Portfolio
- `GET /api/portfolio` - Obtenir le portfolio
- `GET /api/portfolio/performance` - Calculer le rendement XIRR
- `GET /api/portfolio/performance/:date` - Rendement à une date donnée

#### Données de marché
- `GET /api/market/search/:symbol` - Rechercher un titre
- `GET /api/market/quote/:symbol` - Prix actuel d'un titre

### Technologies Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Base de données**: PostgreSQL 14+
- **ORM**: Sequelize ou Prisma
- **Authentification**: JWT tokens
- **Validation**: Joi ou express-validator
- **Tests**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

## Frontend Architecture - SPA

### Structure du projet
```
frontend/
├── src/
│   ├── components/           # Composants réutilisables
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── Loading.jsx
│   │   ├── forms/
│   │   │   ├── TransactionForm.jsx
│   │   │   └── ImportForm.jsx
│   │   └── portfolio/
│   │       ├── PortfolioSummary.jsx
│   │       ├── TransactionList.jsx
│   │       └── PerformanceChart.jsx
│   ├── pages/                # Pages principales
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Portfolio.jsx
│   │   └── Login.jsx
│   ├── services/             # Services API
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   └── portfolioService.js
│   ├── store/                # Gestion d'état
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── transactionSlice.js
│   │   └── portfolioSlice.js
│   ├── utils/                # Utilitaires
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── hooks/                # Hooks React personnalisés
│   │   ├── useAuth.js
│   │   ├── useTransactions.js
│   │   └── usePortfolio.js
│   └── styles/               # Styles CSS
│       ├── globals.css
│       └── components/
├── public/
├── package.json
└── index.html
```

### Technologies Frontend
- **Framework**: React 18+ avec TypeScript
- **Routage**: React Router 6
- **État global**: Redux Toolkit
- **Requêtes HTTP**: Axios
- **UI Framework**: Material-UI ou Tailwind CSS
- **Graphiques**: Chart.js ou Recharts
- **Build**: Vite
- **Tests**: Jest + React Testing Library

## Base de données

### Schéma PostgreSQL
```sql
-- Utilisateurs
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL', 'DIVIDEND')),
  quantity DECIMAL(10,4) NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  transaction_date DATE NOT NULL,
  fees DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cache des données de marché
CREATE TABLE market_data (
  symbol VARCHAR(10) PRIMARY KEY,
  current_price DECIMAL(10,4),
  company_name VARCHAR(255),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
```

## Sécurité

### Authentification & Autorisation
- JWT tokens avec expiration
- Refresh tokens pour les sessions longues
- Validation des tokens sur chaque requête API
- Middleware d'autorisation par utilisateur

### Validation des données
- Validation côté client (frontend)
- Validation côté serveur (backend)
- Sanitisation des entrées utilisateur
- Protection contre les injections SQL

### Sécurité réseau
- HTTPS obligatoire en production
- CORS configuré pour les domaines autorisés
- Rate limiting sur les endpoints API
- Helmet.js pour les headers de sécurité

## Déploiement

### Environnements
- **Développement**: Local avec Docker Compose
- **Test**: Pipeline CI/CD avec tests automatisés
- **Production**: Container orchestration (Kubernetes ou Docker Swarm)

### Infrastructure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Reverse Proxy │    │   CDN           │
│   (AWS ALB)     │────│   (Nginx)       │────│   (CloudFront)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   API Servers   │    │   Static Assets │
│   (Node.js)     │    │   (S3 Bucket)   │
└─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Redis Cache   │
│   (PostgreSQL)  │    │   (Sessions)    │
└─────────────────┘    └─────────────────┘
```

## Monitoring & Logging

### Métriques
- Performance des endpoints API
- Temps de réponse de la base de données
- Taux d'erreur par endpoint
- Utilisation des ressources (CPU, mémoire)

### Logging
- Logs structurés (JSON)
- Niveaux de log (debug, info, warn, error)
- Centralisation des logs (ELK Stack)
- Alertes sur les erreurs critiques

## Scalabilité

### Horizontal Scaling
- API stateless pour la réplication
- Load balancing entre instances
- Base de données avec réplication read-only
- Cache Redis pour les données fréquentes

### Optimisations
- Pagination des listes de transactions
- Cache des calculs XIRR coûteux
- Compression des réponses API
- Lazy loading des composants frontend
-- Script d'initialisation de la base de données
-- Création des tables pour le simulateur de portefeuille boursier

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL', 'DIVIDEND')),
  quantity DECIMAL(15,6) NOT NULL,
  price DECIMAL(15,6) NOT NULL,
  transaction_date DATE NOT NULL,
  fees DECIMAL(15,6) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de cache des données de marché
CREATE TABLE market_data (
  symbol VARCHAR(10) PRIMARY KEY,
  current_price DECIMAL(15,6),
  company_name VARCHAR(255),
  exchange VARCHAR(10),
  currency VARCHAR(3) DEFAULT 'USD',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des portfolios (pour les calculs pré-calculés)
CREATE TABLE portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_value DECIMAL(15,6),
  total_invested DECIMAL(15,6),
  xirr_rate DECIMAL(8,4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, snapshot_date)
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_portfolio_snapshots_user_date ON portfolio_snapshots(user_id, snapshot_date);
CREATE INDEX idx_market_data_updated ON market_data(last_updated);

-- Fonction pour mettre à jour la colonne updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données de test (optionnel)
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('test@example.com', '$2b$10$example_hash', 'John', 'Doe');

INSERT INTO market_data (symbol, current_price, company_name, exchange) VALUES
('AAPL', 150.25, 'Apple Inc.', 'NASDAQ'),
('GOOGL', 2500.50, 'Alphabet Inc.', 'NASDAQ'),
('MSFT', 300.75, 'Microsoft Corporation', 'NASDAQ'),
('TSLA', 250.00, 'Tesla Inc.', 'NASDAQ'),
('AMZN', 3200.00, 'Amazon.com Inc.', 'NASDAQ');
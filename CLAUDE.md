# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a stock portfolio simulator (simulateur de portefeuille boursier) that uses NYSE data. The application allows users to:
- Enter transactions manually via forms or import them from files
- Calculate personal XIRR (Internal Rate of Return) at any point in time (past or present)
- Manage and track their investment portfolio performance

## Architecture

The application follows a client-server architecture with:
- **Backend**: Express.js REST API (Node.js)
- **Frontend**: Single Page Application (React/Vue SPA)
- **Database**: PostgreSQL with Redis for caching
- **External APIs**: NYSE data integration for real-time stock prices

## Development Environment

### Docker Setup
Use Docker for the development environment:
```bash
# Start the development environment
docker-compose up -d

# Stop the environment
docker-compose down
```

Services provided:
- PostgreSQL (port 5432): Main database
- Redis (port 6379): Cache and sessions
- Adminer (port 8080): Database administration interface

### Database
- Uses PostgreSQL with UUID primary keys
- Key tables: `users`, `transactions`, `portfolio_snapshots`, `market_data`
- Database initialization script: `database/init.sql`
- Connection details in docker-compose.yml

## Project Structure

### Backend Structure (Planned)
```
backend/
├── src/
│   ├── controllers/     # REST API controllers
│   ├── services/        # Business logic (portfolioService, xirrService, nyseDataService)
│   ├── models/          # Data models (User, Transaction, Portfolio)
│   ├── routes/          # API route definitions
│   ├── middleware/      # Express middleware (auth, validation, errorHandler)
│   ├── utils/           # Utilities (xirr calculations, dateUtils)
│   └── config/          # Configuration files
```

### Frontend Structure (Planned)
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API client services
│   ├── store/           # Redux state management
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Frontend utilities
```

## Key API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Transactions
- `GET /api/transactions` - List user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `POST /api/transactions/import` - Import transactions from file

### Portfolio
- `GET /api/portfolio` - Get portfolio summary
- `GET /api/portfolio/performance` - Calculate current XIRR
- `GET /api/portfolio/performance/:date` - Historical performance

### Market Data
- `GET /api/market/search/:symbol` - Search stock symbols
- `GET /api/market/quote/:symbol` - Get current stock price

## Core Technologies

### Backend
- Node.js 18+ runtime
- Express.js 4.x framework
- PostgreSQL 14+ database
- Sequelize or Prisma ORM
- JWT authentication
- Joi or express-validator for validation
- Jest + Supertest for testing

### Frontend
- React 18+ with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Axios for HTTP requests
- Material-UI or Tailwind CSS for UI
- Chart.js or Recharts for visualization

## Key Business Logic

### XIRR Calculation
The core feature is calculating the Internal Rate of Return (XIRR) for portfolios:
- Handles multiple cash flows (buy/sell/dividends)
- Supports historical analysis at any point in time
- Computationally expensive - should be cached in Redis

### Transaction Types
- `BUY`: Stock purchase
- `SELL`: Stock sale  
- `DIVIDEND`: Dividend payment

### Data Models
- Users have portfolios
- Portfolios contain transactions
- Transactions reference stock symbols
- Market data is cached for performance

## Development Status

This is a new project in the planning phase. The current repository contains:
- Architecture documentation
- Database schema and Docker setup
- Specification document
- 20 GitHub issues outlining the complete development plan

The implementation should follow the phases outlined in the GitHub issues:
1. Phase 1: Backend Setup (Issues #1-7)
2. Phase 2: Frontend Setup (Issues #8-12)  
3. Phase 3: Integration & Testing (Issues #13-16)
4. Phase 4: Advanced Features (Issues #17-20)
# Portfolio Simulator Backend

Express.js REST API for the stock portfolio simulator application.

## Features

- **Express.js** server with security middleware
- **PostgreSQL** database integration with Sequelize ORM
- **JWT** authentication system
- **Rate limiting** and security headers
- **Comprehensive logging** system
- **Test suite** with Jest and Supertest
- **Code formatting** with ESLint and Prettier

## Project Structure

```
backend/
├── src/
│   ├── controllers/         # Route controllers
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── server.js           # Application entry point
├── tests/                  # Test files
├── package.json
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis (for caching)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=portfolio_user
DB_PASSWORD=portfolio_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### API Information
- `GET /api` - API overview and available endpoints

### Planned Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/portfolio` - Portfolio overview
- `GET /api/portfolio/performance` - XIRR calculations

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode for development:
```bash
npm run test:watch
```

## Code Quality

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
```

## Docker Support

The backend can be run using Docker with the provided docker-compose.yml in the project root.

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate limiting** - Request throttling
- **Input validation** - Request validation with Joi
- **Compression** - Response compression

## Database

Uses Sequelize ORM with PostgreSQL. Database configuration is in `src/config/database.js`.

## Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## License

MIT
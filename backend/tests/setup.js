// Jest setup file for database tests
process.env.NODE_ENV = 'test';
process.env.DB_NAME_TEST = 'portfolio_db_test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Mock console.log for cleaner test output
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Only log actual test output, not database logs
  if (!args[0]?.includes?.('Executing') && !args[0]?.includes?.('Database')) {
    originalConsoleLog(...args);
  }
};

// Global test cleanup
afterAll(async () => {
  // Close any open database connections
  const { sequelize } = require('../src/config/database');
  if (sequelize) {
    await sequelize.close();
  }
});
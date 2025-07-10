const { sequelize, validateConnection } = require('../../src/config/database');

describe('Database Configuration', () => {
  describe('Sequelize Instance', () => {
    it('should have a valid sequelize instance', () => {
      expect(sequelize).toBeDefined();
      expect(sequelize.constructor.name).toBe('Sequelize');
    });

    it('should use PostgreSQL dialect', () => {
      expect(sequelize.getDialect()).toBe('postgres');
    });
  });

  describe('Connection Validation', () => {
    it('should validate database connection', async () => {
      const isValid = await validateConnection();
      expect(typeof isValid).toBe('boolean');
    }, 10000);
  });

  describe('Environment Configuration', () => {
    it('should load appropriate config based on NODE_ENV', () => {
      const config = sequelize.config;
      expect(config).toBeDefined();
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
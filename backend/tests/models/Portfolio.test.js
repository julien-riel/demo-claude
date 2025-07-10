const { User, Portfolio } = require('../../src/models');
const { sequelize } = require('../../src/config/database');

describe('Portfolio Model', () => {
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    testUser = await User.create({
      email: 'portfolio@example.com',
      password_hash: await User.hashPassword('password123'),
      first_name: 'Portfolio',
      last_name: 'Tester',
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Portfolio.destroy({ where: {}, force: true });
  });

  describe('Portfolio Creation', () => {
    it('should create a portfolio snapshot with valid data', async () => {
      const portfolioData = {
        user_id: testUser.id,
        snapshot_date: '2024-01-15',
        total_value: 10500.50,
        total_invested: 10000.00,
        xirr_rate: 12.5,
      };

      const portfolio = await Portfolio.create(portfolioData);

      expect(portfolio.id).toBeDefined();
      expect(portfolio.user_id).toBe(testUser.id);
      expect(portfolio.snapshot_date).toBe('2024-01-15');
      expect(parseFloat(portfolio.total_value)).toBe(10500.50);
      expect(parseFloat(portfolio.total_invested)).toBe(10000.00);
      expect(parseFloat(portfolio.xirr_rate)).toBe(12.5);
    });

    it('should require user_id and snapshot_date', async () => {
      await expect(Portfolio.create({})).rejects.toThrow();
      
      await expect(Portfolio.create({
        user_id: testUser.id,
      })).rejects.toThrow();
      
      await expect(Portfolio.create({
        snapshot_date: '2024-01-15',
      })).rejects.toThrow();
    });

    it('should enforce unique constraint on user_id and snapshot_date', async () => {
      const portfolioData = {
        user_id: testUser.id,
        snapshot_date: '2024-01-15',
        total_value: 10000.00,
        total_invested: 9500.00,
        xirr_rate: 8.5,
      };

      await Portfolio.create(portfolioData);
      
      await expect(Portfolio.create(portfolioData)).rejects.toThrow();
    });

    it('should validate positive values', async () => {
      const invalidValueData = {
        user_id: testUser.id,
        snapshot_date: '2024-01-15',
        total_value: -1000.00,
        total_invested: 9500.00,
      };

      await expect(Portfolio.create(invalidValueData)).rejects.toThrow();

      const invalidInvestedData = {
        user_id: testUser.id,
        snapshot_date: '2024-01-15',
        total_value: 10000.00,
        total_invested: -9500.00,
      };

      await expect(Portfolio.create(invalidInvestedData)).rejects.toThrow();
    });
  });

  describe('Portfolio Methods', () => {
    beforeEach(async () => {
      await Portfolio.bulkCreate([
        {
          user_id: testUser.id,
          snapshot_date: '2024-01-01',
          total_value: 10000.00,
          total_invested: 10000.00,
          xirr_rate: 0.0,
        },
        {
          user_id: testUser.id,
          snapshot_date: '2024-01-15',
          total_value: 10500.00,
          total_invested: 10000.00,
          xirr_rate: 12.5,
        },
        {
          user_id: testUser.id,
          snapshot_date: '2024-02-01',
          total_value: 11000.00,
          total_invested: 10500.00,
          xirr_rate: 15.2,
        },
      ]);
    });

    it('should find portfolios by user', async () => {
      const portfolios = await Portfolio.findByUser(testUser.id);
      
      expect(portfolios).toHaveLength(3);
      expect(portfolios[0].snapshot_date >= portfolios[1].snapshot_date).toBe(true);
    });

    it('should find latest portfolio by user', async () => {
      const latestPortfolio = await Portfolio.findLatestByUser(testUser.id);
      
      expect(latestPortfolio).toBeDefined();
      expect(latestPortfolio.snapshot_date).toBe('2024-02-01');
    });

    it('should find portfolio by date', async () => {
      const portfolio = await Portfolio.findByDate(testUser.id, '2024-01-15');
      
      expect(portfolio).toBeDefined();
      expect(portfolio.snapshot_date).toBe('2024-01-15');
      expect(parseFloat(portfolio.total_value)).toBe(10500.00);
    });

    it('should calculate return percentage correctly', async () => {
      const portfolio = await Portfolio.create({
        user_id: testUser.id,
        snapshot_date: '2024-03-01',
        total_value: 12000.00,
        total_invested: 10000.00,
      });

      const returnPercentage = portfolio.getReturn();
      expect(returnPercentage).toBe(20.0); // (12000 - 10000) / 10000 * 100
    });

    it('should handle zero invested amount', async () => {
      const portfolio = await Portfolio.create({
        user_id: testUser.id,
        snapshot_date: '2024-03-01',
        total_value: 12000.00,
        total_invested: 0.00,
      });

      const returnPercentage = portfolio.getReturn();
      expect(returnPercentage).toBe(0);
    });

    it('should format XIRR correctly', async () => {
      const portfolio = await Portfolio.create({
        user_id: testUser.id,
        snapshot_date: '2024-03-01',
        total_value: 12000.00,
        total_invested: 10000.00,
        xirr_rate: 15.789,
      });

      const formattedXIRR = portfolio.getFormattedXIRR();
      expect(formattedXIRR).toBe('15.79%');
    });

    it('should handle null XIRR', async () => {
      const portfolio = await Portfolio.create({
        user_id: testUser.id,
        snapshot_date: '2024-03-01',
        total_value: 12000.00,
        total_invested: 10000.00,
        xirr_rate: null,
      });

      const formattedXIRR = portfolio.getFormattedXIRR();
      expect(formattedXIRR).toBe('N/A');
    });

    it('should determine if portfolio is positive', async () => {
      const positivePortfolio = await Portfolio.create({
        user_id: testUser.id,
        snapshot_date: '2024-03-01',
        total_value: 12000.00,
        total_invested: 10000.00,
      });

      const negativePortfolio = await Portfolio.create({
        user_id: testUser.id,
        snapshot_date: '2024-03-02',
        total_value: 8000.00,
        total_invested: 10000.00,
      });

      expect(positivePortfolio.isPositive()).toBe(true);
      expect(negativePortfolio.isPositive()).toBe(false);
    });

    it('should create or update portfolio snapshots', async () => {
      const snapshotData = {
        snapshot_date: '2024-03-01',
        total_value: 12000.00,
        total_invested: 10000.00,
        xirr_rate: 18.5,
      };

      // Create new
      const newPortfolio = await Portfolio.createOrUpdate(testUser.id, snapshotData);
      expect(newPortfolio.snapshot_date).toBe('2024-03-01');
      expect(parseFloat(newPortfolio.total_value)).toBe(12000.00);

      // Update existing
      const updatedData = {
        snapshot_date: '2024-03-01',
        total_value: 12500.00,
        total_invested: 10000.00,
        xirr_rate: 20.0,
      };

      const updatedPortfolio = await Portfolio.createOrUpdate(testUser.id, updatedData);
      expect(updatedPortfolio.id).toBe(newPortfolio.id);
      expect(parseFloat(updatedPortfolio.total_value)).toBe(12500.00);
    });
  });

  describe('Portfolio Associations', () => {
    it('should be associated with a user', async () => {
      const portfolio = await Portfolio.create({
        user_id: testUser.id,
        snapshot_date: '2024-01-15',
        total_value: 10000.00,
        total_invested: 9500.00,
      });

      const portfolioWithUser = await Portfolio.findByPk(portfolio.id, {
        include: ['user'],
      });

      expect(portfolioWithUser.user).toBeDefined();
      expect(portfolioWithUser.user.id).toBe(testUser.id);
    });
  });
});
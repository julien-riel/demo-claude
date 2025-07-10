const { User, Transaction } = require('../../src/models');
const { sequelize } = require('../../src/config/database');

describe('Transaction Model', () => {
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    testUser = await User.create({
      email: 'investor@example.com',
      password_hash: await User.hashPassword('password123'),
      first_name: 'Test',
      last_name: 'Investor',
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Transaction.destroy({ where: {}, force: true });
  });

  describe('Transaction Creation', () => {
    it('should create a transaction with valid data', async () => {
      const transactionData = {
        user_id: testUser.id,
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 10,
        price: 150.50,
        transaction_date: '2024-01-15',
        fees: 9.99,
        notes: 'Test purchase',
      };

      const transaction = await Transaction.create(transactionData);

      expect(transaction.id).toBeDefined();
      expect(transaction.user_id).toBe(testUser.id);
      expect(transaction.symbol).toBe('AAPL');
      expect(transaction.type).toBe('BUY');
      expect(parseFloat(transaction.quantity)).toBe(10);
      expect(parseFloat(transaction.price)).toBe(150.50);
      expect(transaction.transaction_date).toBe('2024-01-15');
      expect(parseFloat(transaction.fees)).toBe(9.99);
      expect(transaction.notes).toBe('Test purchase');
    });

    it('should require mandatory fields', async () => {
      await expect(Transaction.create({})).rejects.toThrow();
      
      await expect(Transaction.create({
        user_id: testUser.id,
      })).rejects.toThrow();
    });

    it('should validate transaction type enum', async () => {
      const transactionData = {
        user_id: testUser.id,
        symbol: 'AAPL',
        type: 'INVALID',
        quantity: 10,
        price: 150.50,
        transaction_date: '2024-01-15',
      };

      await expect(Transaction.create(transactionData)).rejects.toThrow();
    });

    it('should convert symbol to uppercase', async () => {
      const transactionData = {
        user_id: testUser.id,
        symbol: 'aapl',
        type: 'BUY',
        quantity: 10,
        price: 150.50,
        transaction_date: '2024-01-15',
      };

      const transaction = await Transaction.create(transactionData);
      expect(transaction.symbol).toBe('AAPL');
    });

    it('should validate positive quantities and prices', async () => {
      const invalidQuantityData = {
        user_id: testUser.id,
        symbol: 'AAPL',
        type: 'BUY',
        quantity: -10,
        price: 150.50,
        transaction_date: '2024-01-15',
      };

      await expect(Transaction.create(invalidQuantityData)).rejects.toThrow();

      const invalidPriceData = {
        user_id: testUser.id,
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 10,
        price: -150.50,
        transaction_date: '2024-01-15',
      };

      await expect(Transaction.create(invalidPriceData)).rejects.toThrow();
    });
  });

  describe('Transaction Methods', () => {
    beforeEach(async () => {
      await Transaction.bulkCreate([
        {
          user_id: testUser.id,
          symbol: 'AAPL',
          type: 'BUY',
          quantity: 10,
          price: 150.00,
          transaction_date: '2024-01-15',
          fees: 9.99,
        },
        {
          user_id: testUser.id,
          symbol: 'GOOGL',
          type: 'BUY',
          quantity: 2,
          price: 2500.00,
          transaction_date: '2024-01-20',
          fees: 9.99,
        },
        {
          user_id: testUser.id,
          symbol: 'AAPL',
          type: 'SELL',
          quantity: 5,
          price: 160.00,
          transaction_date: '2024-02-01',
          fees: 9.99,
        },
      ]);
    });

    it('should find transactions by user', async () => {
      const transactions = await Transaction.findByUser(testUser.id);
      
      expect(transactions).toHaveLength(3);
      expect(transactions[0].transaction_date >= transactions[1].transaction_date).toBe(true);
    });

    it('should find transactions by symbol', async () => {
      const aaplTransactions = await Transaction.findBySymbol(testUser.id, 'AAPL');
      
      expect(aaplTransactions).toHaveLength(2);
      expect(aaplTransactions.every(t => t.symbol === 'AAPL')).toBe(true);
      expect(aaplTransactions[0].transaction_date <= aaplTransactions[1].transaction_date).toBe(true);
    });

    it('should calculate total value correctly', async () => {
      const transaction = await Transaction.create({
        user_id: testUser.id,
        symbol: 'MSFT',
        type: 'BUY',
        quantity: 5,
        price: 300.00,
        transaction_date: '2024-01-15',
        fees: 9.99,
      });

      const totalValue = transaction.getTotalValue();
      expect(totalValue).toBe(1509.99); // 5 * 300 + 9.99
    });

    it('should calculate net value for different transaction types', async () => {
      const buyTransaction = await Transaction.create({
        user_id: testUser.id,
        symbol: 'MSFT',
        type: 'BUY',
        quantity: 5,
        price: 300.00,
        transaction_date: '2024-01-15',
        fees: 9.99,
      });

      const sellTransaction = await Transaction.create({
        user_id: testUser.id,
        symbol: 'MSFT',
        type: 'SELL',
        quantity: 2,
        price: 320.00,
        transaction_date: '2024-02-15',
        fees: 9.99,
      });

      const dividendTransaction = await Transaction.create({
        user_id: testUser.id,
        symbol: 'MSFT',
        type: 'DIVIDEND',
        quantity: 3,
        price: 0.75,
        transaction_date: '2024-03-15',
        fees: 0,
      });

      expect(buyTransaction.getNetValue()).toBe(-1509.99); // -(5 * 300 + 9.99)
      expect(sellTransaction.getNetValue()).toBe(630.01); // 2 * 320 - 9.99
      expect(dividendTransaction.getNetValue()).toBe(2.25); // 3 * 0.75
    });
  });

  describe('Transaction Associations', () => {
    it('should be associated with a user', async () => {
      const transaction = await Transaction.create({
        user_id: testUser.id,
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 10,
        price: 150.00,
        transaction_date: '2024-01-15',
      });

      const transactionWithUser = await Transaction.findByPk(transaction.id, {
        include: ['user'],
      });

      expect(transactionWithUser.user).toBeDefined();
      expect(transactionWithUser.user.id).toBe(testUser.id);
    });
  });
});
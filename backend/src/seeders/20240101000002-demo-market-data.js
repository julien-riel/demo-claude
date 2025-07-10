module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('market_data', [
      {
        symbol: 'AAPL',
        current_price: 175.50,
        company_name: 'Apple Inc.',
        exchange: 'NASDAQ',
        currency: 'USD',
        last_updated: new Date(),
      },
      {
        symbol: 'GOOGL',
        current_price: 2750.25,
        company_name: 'Alphabet Inc.',
        exchange: 'NASDAQ',
        currency: 'USD',
        last_updated: new Date(),
      },
      {
        symbol: 'MSFT',
        current_price: 415.75,
        company_name: 'Microsoft Corporation',
        exchange: 'NASDAQ',
        currency: 'USD',
        last_updated: new Date(),
      },
      {
        symbol: 'TSLA',
        current_price: 250.00,
        company_name: 'Tesla Inc.',
        exchange: 'NASDAQ',
        currency: 'USD',
        last_updated: new Date(),
      },
      {
        symbol: 'AMZN',
        current_price: 145.80,
        company_name: 'Amazon.com Inc.',
        exchange: 'NASDAQ',
        currency: 'USD',
        last_updated: new Date(),
      },
      {
        symbol: 'NVDA',
        current_price: 480.25,
        company_name: 'NVIDIA Corporation',
        exchange: 'NASDAQ',
        currency: 'USD',
        last_updated: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('market_data', null, {});
  }
};
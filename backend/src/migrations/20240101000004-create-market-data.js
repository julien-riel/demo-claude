module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('market_data', {
      symbol: {
        type: Sequelize.STRING(10),
        primaryKey: true,
      },
      current_price: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: true,
      },
      company_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      exchange: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD',
      },
      last_updated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex('market_data', ['last_updated']);
    await queryInterface.addIndex('market_data', ['exchange']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('market_data');
  }
};
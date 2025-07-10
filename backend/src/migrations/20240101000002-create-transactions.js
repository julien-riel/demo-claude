module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      symbol: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('BUY', 'SELL', 'DIVIDEND'),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: false,
      },
      transaction_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fees: {
        type: Sequelize.DECIMAL(15, 6),
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex('transactions', ['user_id']);
    await queryInterface.addIndex('transactions', ['symbol']);
    await queryInterface.addIndex('transactions', ['transaction_date']);
    await queryInterface.addIndex('transactions', ['user_id', 'transaction_date']);
    await queryInterface.addIndex('transactions', ['user_id', 'symbol']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
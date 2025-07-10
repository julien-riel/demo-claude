module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('portfolio_snapshots', {
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
      snapshot_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: true,
      },
      total_invested: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: true,
      },
      xirr_rate: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: true,
        comment: 'Internal Rate of Return as percentage',
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
    await queryInterface.addIndex('portfolio_snapshots', ['user_id']);
    await queryInterface.addIndex('portfolio_snapshots', ['snapshot_date']);
    await queryInterface.addIndex('portfolio_snapshots', ['user_id', 'snapshot_date'], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('portfolio_snapshots');
  }
};
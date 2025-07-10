const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    symbol: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        len: [1, 10],
        isUppercase: true,
      },
    },
    type: {
      type: DataTypes.ENUM('BUY', 'SELL', 'DIVIDEND'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    price: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fees: {
      type: DataTypes.DECIMAL(15, 6),
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (transaction) => {
        transaction.updated_at = new Date();
      },
      beforeValidate: (transaction) => {
        if (transaction.symbol) {
          transaction.symbol = transaction.symbol.toUpperCase();
        }
      },
    },
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['symbol'],
      },
      {
        fields: ['transaction_date'],
      },
      {
        fields: ['user_id', 'transaction_date'],
      },
    ],
  });

  // Instance methods
  Transaction.prototype.getTotalValue = function() {
    return parseFloat(this.quantity) * parseFloat(this.price) + parseFloat(this.fees || 0);
  };

  Transaction.prototype.getNetValue = function() {
    const total = parseFloat(this.quantity) * parseFloat(this.price);
    const fees = parseFloat(this.fees || 0);
    
    if (this.type === 'BUY') {
      return -(total + fees); // Negative for cash outflow
    } else if (this.type === 'SELL') {
      return total - fees; // Positive for cash inflow
    } else if (this.type === 'DIVIDEND') {
      return total; // Positive for dividend income
    }
    return 0;
  };

  // Class methods
  Transaction.findByUser = async function(userId, options = {}) {
    return this.findAll({
      where: { user_id: userId },
      order: [['transaction_date', 'DESC']],
      ...options,
    });
  };

  Transaction.findBySymbol = async function(userId, symbol, options = {}) {
    return this.findAll({
      where: { 
        user_id: userId,
        symbol: symbol.toUpperCase(),
      },
      order: [['transaction_date', 'ASC']],
      ...options,
    });
  };

  Transaction.getPortfolioTransactions = async function(userId, options = {}) {
    return this.findAll({
      where: { user_id: userId },
      order: [['transaction_date', 'ASC']],
      ...options,
    });
  };

  // Associations
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return Transaction;
};
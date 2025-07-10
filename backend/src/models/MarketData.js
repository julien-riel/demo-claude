const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MarketData = sequelize.define('MarketData', {
    symbol: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      validate: {
        len: [1, 10],
        isUppercase: true,
      },
    },
    current_price: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    exchange: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'market_data',
    timestamps: false,
    hooks: {
      beforeValidate: (marketData) => {
        if (marketData.symbol) {
          marketData.symbol = marketData.symbol.toUpperCase();
        }
      },
      beforeUpdate: (marketData) => {
        marketData.last_updated = new Date();
      },
    },
    indexes: [
      {
        fields: ['last_updated'],
      },
      {
        fields: ['exchange'],
      },
    ],
  });

  // Instance methods
  MarketData.prototype.isDataStale = function(maxAgeMinutes = 15) {
    const now = new Date();
    const ageMinutes = (now - this.last_updated) / (1000 * 60);
    return ageMinutes > maxAgeMinutes;
  };

  MarketData.prototype.getFormattedPrice = function() {
    return this.current_price ? `$${parseFloat(this.current_price).toFixed(2)}` : 'N/A';
  };

  // Class methods
  MarketData.findBySymbol = async function(symbol) {
    return this.findByPk(symbol.toUpperCase());
  };

  MarketData.findByExchange = async function(exchange, options = {}) {
    return this.findAll({
      where: { exchange: exchange.toUpperCase() },
      order: [['symbol', 'ASC']],
      ...options,
    });
  };

  MarketData.updatePrice = async function(symbol, priceData) {
    const [marketData, created] = await this.upsert({
      symbol: symbol.toUpperCase(),
      ...priceData,
      last_updated: new Date(),
    });
    
    return { marketData, created };
  };

  MarketData.getStaleData = async function(maxAgeMinutes = 15) {
    const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
    
    return this.findAll({
      where: {
        last_updated: {
          [sequelize.Op.lt]: cutoffTime,
        },
      },
    });
  };

  MarketData.searchSymbols = async function(query, limit = 10) {
    return this.findAll({
      where: {
        [sequelize.Op.or]: [
          {
            symbol: {
              [sequelize.Op.iLike]: `%${query.toUpperCase()}%`,
            },
          },
          {
            company_name: {
              [sequelize.Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
      limit,
      order: [['symbol', 'ASC']],
    });
  };

  MarketData.bulkUpdatePrices = async function(pricesData) {
    const updates = pricesData.map(data => ({
      symbol: data.symbol.toUpperCase(),
      current_price: data.price,
      last_updated: new Date(),
    }));

    return this.bulkCreate(updates, {
      updateOnDuplicate: ['current_price', 'last_updated'],
    });
  };

  return MarketData;
};
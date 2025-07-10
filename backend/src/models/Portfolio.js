const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Portfolio = sequelize.define('Portfolio', {
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
    snapshot_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_value: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    total_invested: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    xirr_rate: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true,
      comment: 'Internal Rate of Return as percentage (e.g., 15.25 for 15.25%)',
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
    tableName: 'portfolio_snapshots',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (portfolio) => {
        portfolio.updated_at = new Date();
      },
    },
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['snapshot_date'],
      },
      {
        unique: true,
        fields: ['user_id', 'snapshot_date'],
      },
    ],
  });

  // Instance methods
  Portfolio.prototype.getReturn = function() {
    if (!this.total_value || !this.total_invested || this.total_invested === 0) {
      return 0;
    }
    return ((parseFloat(this.total_value) - parseFloat(this.total_invested)) / parseFloat(this.total_invested)) * 100;
  };

  Portfolio.prototype.getFormattedXIRR = function() {
    return this.xirr_rate ? `${parseFloat(this.xirr_rate).toFixed(2)}%` : 'N/A';
  };

  Portfolio.prototype.isPositive = function() {
    return this.getReturn() > 0;
  };

  // Class methods
  Portfolio.findByUser = async function(userId, options = {}) {
    return this.findAll({
      where: { user_id: userId },
      order: [['snapshot_date', 'DESC']],
      ...options,
    });
  };

  Portfolio.findLatestByUser = async function(userId) {
    return this.findOne({
      where: { user_id: userId },
      order: [['snapshot_date', 'DESC']],
    });
  };

  Portfolio.findByDate = async function(userId, date) {
    return this.findOne({
      where: { 
        user_id: userId,
        snapshot_date: date,
      },
    });
  };

  Portfolio.createOrUpdate = async function(userId, snapshotData) {
    const existingPortfolio = await this.findByDate(userId, snapshotData.snapshot_date);
    
    if (existingPortfolio) {
      return existingPortfolio.update(snapshotData);
    } else {
      return this.create({
        user_id: userId,
        ...snapshotData,
      });
    }
  };

  Portfolio.getPerformanceHistory = async function(userId, startDate = null, endDate = null) {
    const whereClause = { user_id: userId };
    
    if (startDate || endDate) {
      whereClause.snapshot_date = {};
      if (startDate) whereClause.snapshot_date[sequelize.Op.gte] = startDate;
      if (endDate) whereClause.snapshot_date[sequelize.Op.lte] = endDate;
    }

    return this.findAll({
      where: whereClause,
      order: [['snapshot_date', 'ASC']],
      attributes: ['snapshot_date', 'total_value', 'total_invested', 'xirr_rate'],
    });
  };

  // Associations
  Portfolio.associate = function(models) {
    Portfolio.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return Portfolio;
};
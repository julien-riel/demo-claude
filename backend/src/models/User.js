const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: (user) => {
        user.updated_at = new Date();
      },
    },
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  };

  // Class methods
  User.hashPassword = async function(password) {
    return bcrypt.hash(password, 12);
  };

  User.findByEmail = async function(email) {
    return this.findOne({ where: { email } });
  };

  // Associations
  User.associate = function(models) {
    User.hasMany(models.Transaction, {
      foreignKey: 'user_id',
      as: 'transactions',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Portfolio, {
      foreignKey: 'user_id',
      as: 'portfolios',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
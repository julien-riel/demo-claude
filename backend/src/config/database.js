const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER || 'portfolio_user',
    password: process.env.DB_PASSWORD || 'portfolio_password',
    database: process.env.DB_NAME || 'portfolio_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'portfolio_user',
    password: process.env.DB_PASSWORD || 'portfolio_password',
    database: process.env.DB_NAME_TEST || 'portfolio_db_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

module.exports = { sequelize, config };
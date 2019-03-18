const path = require('path');
const { getEnvVariable } = require('../../helpers/environment');

module.exports = {
    client: 'postgresql',
    connection: {
      host: getEnvVariable('PAYMENT_HOST', 'localhost'),
      database: getEnvVariable('PAYMENT_DB', 'payment_test'),
      user: getEnvVariable('PAYMENT_DB_USER', 'payment_user'),
      port: getEnvVariable('PAYMENT_DB_PORT', 5432),
      password: getEnvVariable('PAYMENT_DB_PASSWORD', '//$$(..)@a?fgh?<*#$^ghk%__'),
      adminUser: getEnvVariable('DB_ADMIN_USER', 'postgres'),
      adminPassword: getEnvVariable('DB_ADMIN_PASSWORD', 'mb|33_<C<kl&A*df.c8%*'),
      role: getEnvVariable('PAYMENT_DB_ROLE', 'payment_user'),
      application_name: 'Payment',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 50,
    },
    migrations: {
      directory: path.resolve(__dirname, '../migrations'),
      tableName: 'payment_test_knex_migrations',
    },
    debug: true,
  };

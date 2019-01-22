const path = require('path');
const { getEnvVariable } = require('../../helpers/environment');

module.exports = {
    client: 'postgresql',
    connection: {
      host: getEnvVariable('CUSTOMER_HOST', 'localhost'),
      database: getEnvVariable('CUSTOMER_DB', 'postgres'),
      user: getEnvVariable('CUSTOMER_DB_USER', 'customer_user'),
      port: getEnvVariable('CUSTOMER_DB_PORT', 5432),
      password: getEnvVariable('CUSTOMER_DB_PASSWORD', '&&//a)(=fgg??<*df.ff%*'),
      adminUser: getEnvVariable('DB_ADMIN_USER', 'postgres'),
      adminPassword: getEnvVariable('DB_ADMIN_PASSWORD', 'mb|33_<C<kl&A*df.c8%*'),
      role: getEnvVariable('CUSTOMER_DB_ROLE', 'customer_user'),
      application_name: 'Customer',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 50,
    },
    migrations: {
      directory: path.resolve(__dirname, '../migrations'),
      tableName: 'customer_knex_migrations',
    },
    debug: true,
  };

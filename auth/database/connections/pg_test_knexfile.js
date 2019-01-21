const path = require('path');
const { getEnvVariable } = require('../../helpers/environment');

module.exports = {
    client: 'postgresql',
    connection: {
      host: getEnvVariable('AUTH_HOST', 'localhost'),
      database: getEnvVariable('AUTH_DB_TEST', 'auth_test'),
      user: getEnvVariable('AUTH_DB_USER', 'auth_user'),
      port: getEnvVariable('AUTH_DB_PORT', 5432),
      password: getEnvVariable('AUTH_DB_PASSWORD', 'kl&Agg|53_<C<*df.ff%*'),
      adminUser: getEnvVariable('DB_ADMIN_USER', 'postgres'),
      adminPassword: getEnvVariable('DB_ADMIN_PASSWORD', 'mb|33_<C<kl&A*df.c8%*'),
      role: getEnvVariable('AUTH_DB_ROLE', 'auth_user'),
      application_name: 'Auth',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 50,
    },
    migrations: {
      directory: path.resolve(__dirname, '../migrations'),
      tableName: 'auth_test_knex_migrations',
    },
    debug: true,
  };
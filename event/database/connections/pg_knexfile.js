const path = require('path');
const { getEnvVariable } = require('../../helpers/environment');

module.exports = {
    client: 'postgresql',
    connection: {
      host: getEnvVariable('EVENT_HOST', 'localhost'),
      database: getEnvVariable('EVENT_DB', 'postgres'),
      user: getEnvVariable('EVENT_DB_USER', 'event_user'),
      port: getEnvVariable('EVENT_DB_PORT', 5432),
      password: getEnvVariable('EVENT_DB_PASSWORD', '()/>aWD=&&g??<*df.f?@@*'),
      adminUser: getEnvVariable('DB_ADMIN_USER', 'postgres'),
      adminPassword: getEnvVariable('DB_ADMIN_PASSWORD', 'mb|33_<C<kl&A*df.c8%*'),
      role: getEnvVariable('EVENT_DB_ROLE', 'event_user'),
      application_name: 'Event',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 50,
    },
    migrations: {
      directory: path.resolve(__dirname, '../migrations'),
      tableName: 'event_knex_migrations',
    },
    debug: true,
  };

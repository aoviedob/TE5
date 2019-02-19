const path = require('path');
const { getEnvVariable } = require('../../helpers/environment');

module.exports = {
    client: 'postgresql',
    connection: {
      host: getEnvVariable('TICKET_HOST', 'localhost'),
      database: getEnvVariable('TICKET_DB', 'postgres'),
      user: getEnvVariable('TICKET_DB_USER', 'ticket_user'),
      port: getEnvVariable('TICKET_DB_PORT', 5432),
      password: getEnvVariable('TICKET_DB_PASSWORD', 'aob/$a)))66!==5df.ff=*'),
      adminUser: getEnvVariable('DB_ADMIN_USER', 'postgres'),
      adminPassword: getEnvVariable('DB_ADMIN_PASSWORD', 'mb|33_<C<kl&A*df.c8%*'),
      role: getEnvVariable('TICKET_DB_ROLE', 'ticket_user'),
      application_name: 'Ticket',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 50,
    },
    migrations: {
      directory: path.resolve(__dirname, '../migrations'),
      tableName: 'ticket_knex_migrations',
    },
    debug: true,
  };

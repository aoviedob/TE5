import knex from 'knex';
import config from './pg_knexfile.js';
import knexTinyLogger from 'knex-tiny-logger';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'PG DBConnection'} );

let pgDbConnection;

module.exports = {
  get pgDbConnection() {
    if (!pgDbConnection) {
      pgDbConnection = knexTinyLogger(knex(config));
      logger.info({ database: config.connection.database }, 'Knex singleton created');
    }
    return pgDbConnection;
  },
};

import knex from 'knex';
import path from 'path';
import knexTinyLogger from 'knex-tiny-logger';
import { getEnvVariable } from '../../helpers/environment';
import bunyan from 'bunyan';
import config from './pg_test_knexfile.js';

const logger = bunyan.createLogger({ name: 'PG DBConnection'} );

let pgTestDbConnection;

module.exports = {
  get pgTestDbConnection() {
    if (!pgTestDbConnection) {
      pgTestDbConnection = knexTinyLogger(knex(config));
      logger.info({ database: config.connection.database }, 'Knex singleton created');
    }
    return pgTestDbConnection;
  },
};

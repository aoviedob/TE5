const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('TICKET_SCHEMA', 'ticket'),
};
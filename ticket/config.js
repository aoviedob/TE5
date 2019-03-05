const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('TICKET_SCHEMA', 'ticket'),
  queue: {
    hostname: getEnvVariable('QUEUE_HOSTNAME', 'amqp://localhost'),
    name: getEnvVariable('QUEUE_NAME', 'ticketsQueue'),
    exchange: getEnvVariable('EXCHANGE_NAME', 'ticketsExchange'),
  },
};
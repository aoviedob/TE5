const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  authExternalAuthenticateUrl: getEnvVariable('AUTH_EXTERNAL_AUTHENTICATE_URL', 'http://localhost:3000/api/authenticate'),
  queue: {
    hostname: getEnvVariable('QUEUE_HOSTNAME', 'amqp://mkfakewd:wt0WICKKeTZsvFHGNnevqENlpukhmK32@mosquito.rmq.cloudamqp.com/mkfakewd'),
    name: getEnvVariable('QUEUE_NAME', 'communicationQueue'),
    exchange: getEnvVariable('EXCHANGE_NAME', 'communicationExchange'),
  }
};
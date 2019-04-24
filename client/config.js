const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  eventServiceDomain: getEnvVariable('EVENT_SERVICE_DOMAIN', 'http://localhost:3050'),
  ticketServiceDomain: getEnvVariable('TICKET_SERVICE_DOMAIN', 'http://localhost:3060'),
  authServiceDomain: getEnvVariable('AUTH_SERVICE_DOMAIN', 'http://localhost:3000'),
  customerServiceDomain: getEnvVariable('CUSTOMER_SERVICE_DOMAIN', 'http://localhost:3030'),
  authSystemLoginCredentials: {
    email: getEnvVariable('AUTH_SYSTEM_LOGIN_USER', 'andres+system@gmail.com'),
    password: getEnvVariable('AUTH_SYSTEM_LOGIN_PASSWORD', 'secret'),
  },
};
const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  eventServiceDomain: getEnvVariable('EVENT_SERVICE_DOMAIN', 'http://localhost:3050'),
  commServiceDomain: getEnvVariable('COMM_SERVICE_DOMAIN', 'http://localhost:3065'),
  ticketServiceDomain: getEnvVariable('TICKET_SERVICE_DOMAIN', 'http://localhost:3060'),
  authServiceDomain: getEnvVariable('AUTH_SERVICE_DOMAIN', 'http://localhost:3000'),
  customerServiceDomain: getEnvVariable('CUSTOMER_SERVICE_DOMAIN', 'http://localhost:3030'),
  ticketSocketIODomain: getEnvVariable('TICKET_SOCKET_DOMAIN', 'http://localhost:8099'),
  customerSocketIODomain: getEnvVariable('CUSTOMER_SOCKET_DOMAIN', 'http://localhost:8090'),
  authSystemLoginCredentials: {
    email: getEnvVariable('AUTH_SYSTEM_LOGIN_USER', 'andres+system@gmail.com'),
    password: getEnvVariable('AUTH_SYSTEM_LOGIN_PASSWORD', 'secret'),
  },
};
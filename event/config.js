const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('CUSTOMER_SCHEMA', 'event'),
  authExternalAuthenticateUrl: getEnvVariable('AUTH_EXTERNAL_AUTHENTICATE_URL', 'http://localhost:3000/api/authenticate'),
};
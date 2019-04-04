const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  domain: getEnvVariable('PAYMENT_SERVICE_DOMAIN', 'localhost:4550'),
  formUrl: getEnvVariable('PAYMENT_FORM_URL', '/?'),
};
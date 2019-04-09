const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  domain: getEnvVariable('EVENT_SERVICE_DOMAIN', 'http://localhost:3050'),
};
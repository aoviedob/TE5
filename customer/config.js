const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('CUSTOMER_SCHEMA', 'customer'),
  authExternalLoginUrl: getEnvVariable('AUTH_EXTERNAL_LOGIN_URL', 'localhost:3000/api/external/login'),
  authCreateUserUrl: getEnvVariable('AUTH_CREATE_USER_URL', 'localhost:3000/api/user'),
  crypto: {
    sharedEncryptionKey: getEnvVariable('SHARED_ENCRYPTION_KEY', '4&//#@.c9Cb%*|44_<kl[<CI?u|5WW5->='),
    algorithm: 'AES-256-CTR',
    algorithmKeySize: 32,
    algorithmIvSize: 16,
    algorithmEncode: 'base64',
    algorithmCharset: 'utf8',
  },
  authExternalLoginCredentials: {
    user: getEnvVariable('AUTH_EXTERNAL_LOGIN_USER', 'andres+external@gmail.com'),
    password: getEnvVariable('AUTH_EXTERNAL_LOGIN_PASSWORD', 'secret'),
  },
};
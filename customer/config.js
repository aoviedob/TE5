const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('CUSTOMER_SCHEMA', 'customer'),
  authExternalLoginUrl: getEnvVariable('AUTH_EXTERNAL_LOGIN_URL', 'http://localhost:3000/api/external/login'),
  authExternalAuthenticateUrl: getEnvVariable('AUTH_EXTERNAL_AUTHENTICATE_URL', 'http://localhost:3000/api/authenticate'),
  authCreateUserUrl: getEnvVariable('AUTH_CREATE_USER_URL', 'http://localhost:3000/api/users'),
  productUrl: getEnvVariable('PRODUCT_URL', 'http://localhost:3050/api/ticketCategory'),
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
  maxAllowedProductQuantity: getEnvVariable('MAX_ALLOWED_PRODUCT_QUANTITY', 10),
};
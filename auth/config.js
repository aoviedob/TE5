const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('AUTH_SCHEMA', 'auth'),
  maxLoginAttempts: getEnvVariable('MAX_LOGIN_ATTEMPTS', 5),
  accountLockedMinutes: getEnvVariable('ACCOUNT_LOCKED_MINUTES', 15),
  crypto: {
    encryptionKey: getEnvVariable('AUTH_ENCRYPTION_KEY', '&A*df.c8%*mb|33_<C<kl[I?u|dM->55?'),
    sharedEncryptionKey: getEnvVariable('SHARED_ENCRYPTION_KEY', '4&//#@.c9Cb%*|44_<kl[<CI?u|5WW5->='),
    tokenKey: getEnvVariable('AUTH_TOKEN_KEY', '*&A().yo%%mb%*|66_$kl<C[I#u"dM-77>'),
    tokenExpiresIn: '1d',
    tokenAlgorithm: 'HS256',
    algorithm: 'AES-256-CTR',
    algorithmKeySize: 32,
    algorithmIvSize: 16,
    algorithmEncode: 'base64',
    algorithmCharset: 'utf8',
  },
  authAdminLoginCredentials: {
    user: getEnvVariable('AUTH_ADMIN_LOGIN_USER', 'andres+admin@gmail.com'),
    password: getEnvVariable('AUTH_ADMIN_LOGIN_PASSWORD', 'secret'),
  },
  authExternalLoginCredentials: {
    user: getEnvVariable('AUTH_EXTERNAL_LOGIN_USER', 'andres+external@gmail.com'),
    password: getEnvVariable('AUTH_EXTERNAL_LOGIN_PASSWORD', 'secret'),
  },
  authSystemLoginCredentials: {
    user: getEnvVariable('AUTH_SYSTEM_LOGIN_USER', 'andres+system@gmail.com'),
    password: getEnvVariable('AUTH_SYSTEM_LOGIN_PASSWORD', 'secret'),
  },
  managerDefaultLoginCredentials: {
    user: getEnvVariable('DEFAULT_LOGIN_USER', 'andres+manager@gmail.com'),
    password: getEnvVariable('DEFAULT_LOGIN_PASSWORD', 'secret'),
  },
  defaultLoginCredentials: {
    user: getEnvVariable('DEFAULT_LOGIN_USER', 'andres+default@gmail.com'),
    password: getEnvVariable('DEFAULT_LOGIN_PASSWORD', 'secret'),
  }
};
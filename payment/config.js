const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('PAYMENT_SCHEMA', 'payment'),
  crypto: {
    encryptionKey: getEnvVariable('ENCRYPTION_KEY', 'e*$**.c7%*m=oo+_<C<kl[OOu*Md-><<?'),
    tokenKey: getEnvVariable('TOKEN_KEY', '%*(oo)y.t%^m^%a|fg__$l#C[k#u"%%-@@<'),
    apiEncryptionKey: getEnvVariable('API_ENCRYPTION_KEY', '**((&(yhka%n^^_b|2g@_$l7csk!u@%*-*@<'),
    clientEncryptionKey: getEnvVariable('CLIENT_ENCRYPTION_KEY', '~*(~$/yhka%n^^_b|&g7_)l7cskUu@/*-&@9'),
    tokenExpiresIn: getEnvVariable('PAYMENT_TOKEN_EXPIRES_IN', '1d'),
    apiKeyExpiresIn: getEnvVariable('PAYMENT_API_KEY_EXPIRES_IN', '300'),
    tokenAlgorithm: 'HS256',
    algorithm: 'AES-256-CTR',
    algorithmKeySize: 32,
    algorithmIvSize: 16,
    algorithmEncode: 'base64',
    algorithmCharset: 'utf8',
  },
  domain: getEnvVariable('PAYMENT_SERVICE_DOMAIN', 'http://localhost:4550'),
  formUrl: getEnvVariable('PAYMENT_FORM_URL', '/?'),
};

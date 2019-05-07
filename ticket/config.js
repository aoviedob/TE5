const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('TICKET_SCHEMA', 'ticket'),
  authExternalAuthenticateUrl: getEnvVariable('AUTH_EXTERNAL_AUTHENTICATE_URL', 'http://localhost:3000/api/authenticate'),
  initiatePaymentUrl: getEnvVariable('PAYMENT_PROVIDER_DOMAIN', 'http://localhost:4550/api/payment/initiate'),
  queue: {
    hostname: getEnvVariable('QUEUE_HOSTNAME', 'amqp://localhost'),
    name: getEnvVariable('QUEUE_NAME', 'ticketsQueue'),
    exchange: getEnvVariable('EXCHANGE_NAME', 'ticketsExchange'),
  },
  crypto: {
    paymentPrivateKey: getEnvVariable('PAYMENT_PRIVATE_KEY', 'aS@@@.D8%***|!D_)C<kl[I?u|dM->001'),
    encryptionKey: getEnvVariable('ENCRYPTION_KEY', 'aS@@@.D8%***|!D_)C<kl[I?u|dM->001'),
    tokenKey: getEnvVariable('TOKEN_KEY', 'b**%%.n)@@77%*|~~_$gg<C[I#u"dM-><<'),
    tokenExpiresIn: '1d',
    tokenAlgorithm: 'HS256',
    algorithm: 'AES-256-CTR',
    algorithmKeySize: 32,
    algorithmIvSize: 16,
    algorithmEncode: 'base64',
    algorithmCharset: 'utf8',
  },
};
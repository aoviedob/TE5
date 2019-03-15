const { getEnvVariable } = require('./helpers/environment');

module.exports = {
  schema: getEnvVariable('TICKET_SCHEMA', 'ticket'),
  queue: {
    hostname: getEnvVariable('QUEUE_HOSTNAME', 'amqp://localhost'),
    name: getEnvVariable('QUEUE_NAME', 'ticketsQueue'),
    exchange: getEnvVariable('EXCHANGE_NAME', 'ticketsExchange'),
  },
  crypto: {
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
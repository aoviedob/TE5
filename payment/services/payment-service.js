import * as paymentRepo from '../dal/payment-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { decryptWithPrivateKey, decrypt, encryptWithPrivateKey } from './crypto-service';
import { domain, formUrl } from '../config';
import CardValidate from 'credit-card-validate';

export const getClientById = async (dbContext, clientId) => {
  validatePreconditions(['dbContext', 'clientId'], { dbContext, clientId });
  return mapRepoEntity(await(paymentRepo.getCustomerById(dbContext, clientId)));
};

const getClientPrivateKey = async(dbContext, clientId) => {
  const client = await getClientById(dbContext, clientId);

  if (client == null) {
    logger.error({ dbContext, clientId }, 'INCONSISTENCY_DETECTED - Client does not exist');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }

  const { privateKey: encryptedPrivateKey } = client;
  return decrypt(encryptedPrivateKey).privateKey;
};

const authenticate = async(dbContext, clientId, body) => {
  validatePreconditions(['dbContext', 'clientId'], { dbContext, clientId });

  const privateKey = await getClientPrivateKey(dbContext, clientId);
  
  let decryptedBody;
  try {
    decryptedBody = decryptWithPrivateKey(body, privateKey);  
  } catch(err) {
    logger.error({ dbContext, clientId }, 'INCONSISTENCY_DETECTED - Content is not properly encrypted');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }
  return decryptedBody;
};

export const requestApiKey = (dbContext, clientId) => {
  await authenticate(dbContext, clientId, body);
  return createApiKey({ clientId });
};

export const initiatePayment = async(dbContext, clientId) => {
  const decryptedBody = await authenticate(dbContext, clientId, body);
 
  const { invoice, customerId, amount } = decryptedBody;
  validatePreconditions(['invoice', 'customerId', 'amount'], decryptedBody);
  const token = createToken({ ...decryptedBody, clientId });

  return encryptWithPrivateKey({
    formUrl: `${domain}${formUrl}?token=${token}`,
  }, privateKey);
};

const creditCardFactory = CardValidate.CreditCardFactory(CardValidate.cards);

const throwPaymentDataInvalidError = data => {
  logger.error(data, 'INCONSISTENCY_DETECTED - Payment data is invalid');
  const error = new Error('INCONSISTENCY_DETECTED');
  error.status = 412;
  throw error;
};

const validatePaymentData = (paymentData, extraData) => {
  try {
    const { cardNumber, cardHolder, securityCode, expirationDate } = paymentData;
    
    const formattedExpDate = new Date(expirationDate);
    const [type] = creditCardFactory.find(cardNumber, formattedExpDate, securityCode);
    const card = CardValidate.cards.[type](cardNumber, formattedExpDate, securityCode);
    if (!card.isValid()) {
      throwPaymentDataInvalidError({ cardNumber, cardHolder, ...extraData });
    }
  } catch {
    throwPaymentDataInvalidError({ cardNumber, cardHolder, ...extraData });
  }
};

export const pay = async (req, dbContext, paymentData = {}) => {
  const { cardNumber, cardHolder } = paymentData;
  let tokenContent;
  try{
    tokenContent = verifyToken(req.token);
  } catch(err) {
    logger.error({ dbContext, cardNumber,  cardHolder }, 'INCONSISTENCY_DETECTED - Payment token is not valid');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }

  const apiKey = getApiKeyFromRequest(req);
  const apiKeyVerification = verifyApiKey(apiKey);

  if (!apiKeyVerification) {
    logger.error({ dbContext, cardNumber, cardHolder }, 'INCONSISTENCY_DETECTED - ApiKey is not valid');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }

  const { clientId } = apiKeyVerification;
  const { clientId: tokenClientId } = tokenContent;

  if (clientId !== tokenClientId) {
    logger.error({ dbContext, tokenContent, cardHolder, cardHolder, clientId }, 'INCONSISTENCY_DETECTED - Unmatching keys');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }

  validatePreconditions(['invoice', 'customerId', 'amount', 'clientId', 'dbContext', 'cardNumber', 'cardHolder', 'securityCode', 'expirationDate'], { ...tokenContent, ...paymentData, dbContext });
  const { invoice, customerId, amount, clientId } = tokenContent;

  validatePaymentData(paymentData, tokenContent);

  const privateKey = await getClientPrivateKey(dbContext, clientId);
  const { cardNumber, cardHolder } = paymentData;
  
  const { id: paymentRequestId } = await paymentRepo.createPaymentRequest(dbContext, mapParams({ clientId, externalInvoiceId: invoice, externalCustomerId: customerId, amount, cardNumber: encryptWithPrivateKey(cardNumber, privateKey, true), cardHolder: encryptWithPrivateKey(cardHolder, privateKey, true) }));
  if (!paymentRequestId) {
    return null;
  }

  const { transaction } = await paymentRepo.createTransaction(dbContext, mapParams({ paymentRequestId }));
  return await paymentRepo.createPaymentResponse(dbContext, mapParams({ paymentRequestId, transaction, status: 'SUCCESS' }));
};

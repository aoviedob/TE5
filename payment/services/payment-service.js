import * as paymentRepo from '../dal/payment-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { decryptWithPrivateKey, decrypt, encryptWithPrivateKey, verifyToken } from './crypto-service';
import { domain, formUrl } from '../config';
import * as CardValidate from 'credit-card-validate';
import bunyan from 'bunyan';
import moment from 'moment';
const logger = bunyan.createLogger({ name: 'PaymentService'});

export const getClientById = async (dbContext, clientId) => {
  validatePreconditions(['dbContext', 'clientId'], { dbContext, clientId });
  return mapRepoEntity(await(paymentRepo.getClientById(dbContext, clientId)));
};

const getClientPrivateKey = async(dbContext, clientId) => {
  const client = await getClientById(dbContext, clientId);
  
  if (client == null) {
    logger.error({ dbContext, clientId }, 'INCONSISTENCY_DETECTED - Client does not exist');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 401;
    throw error;
  }

  const { privateKey: encryptedPrivateKey } = client;
  return decrypt(encryptedPrivateKey, null, true).privateKey;
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
    error.status = 401;
    throw error;
  }
  return decryptedBody;
};

export const requestApiKey = async (dbContext, clientId, body) => {
  await authenticate(dbContext, clientId, body);
  return createApiKey({ clientId });
};

export const initiatePayment = async(dbContext, clientId, body) => {
  const decryptedBody = await authenticate(dbContext, clientId, body);
 
  const { invoice, customerId, amount } = decryptedBody;
  validatePreconditions(['invoice', 'customerId', 'amount'], decryptedBody);
  const token = createToken({ ...decryptedBody, clientId });

  return encryptWithPrivateKey({
    formUrl: `${domain}${formUrl}token=${token}`,
  }, privateKey);
};

export const login = async req => {
  try {
    verifyToken(req.token);
  } catch(error) {
    logger.error(error, 'INCONSISTENCY_DETECTED - Provided token is invalid');
    const err = new Error('INCONSISTENCY_DETECTED');
    err.status = 401;
    throw err;
  }
  return null;
};

export const getPaymentAmount = async req => {
  try {
    const { amount } = verifyToken(req.token);
    return { amount };
  } catch(error) {
    logger.error(error, 'INCONSISTENCY_DETECTED - Provided token is invalid');
    const err = new Error('INCONSISTENCY_DETECTED');
    err.status = 401;
    throw err;
  }
  return null;
};

const creditCardFactory = new CardValidate.CreditCardFactory(Object.values(CardValidate.cards));

const paymentDataInvalidError = data => {
  logger.error(data, 'INCONSISTENCY_DETECTED - Payment data is invalid');
  return false;
};

const validatePaymentData = (paymentData = {}, extraData = {}) => {
  const { cardNumber, cardHolder, securityCode, expirationDate } = paymentData;

  try {
    const formattedExpDate = moment();
    let exYear;
    let exMonth;
    
    if (expirationDate.includes('/')) {
      const parts = expirationDate.split('/')
      exMonth = parts[0];
      exYear = parts[1];
    } else {
      const parts = expirationDate.match(/.{1,2}/g);
      exMonth = parts[0];
      exYear = parts[1];
    }
 
    const [type] = creditCardFactory.find(cardNumber, formattedExpDate.month(exMonth).year(exYear).toDate(), securityCode);
    console.log('typeHola', type);
    if(!type) {
      return paymentDataInvalidError({ cardNumber, cardHolder, ...extraData, isInvalid: true });
    }

    const card = new CardValidate.cards[type.name](cardNumber, formattedExpDate, securityCode);
    console.log('cardHola', card);
    if (!card.isValid()) {
      return paymentDataInvalidError({ cardNumber, cardHolder, ...extraData, isInvalid: true });
    }
  } catch(error){
    return paymentDataInvalidError({ error, cardNumber, cardHolder, ...extraData });
  }

  return true;
};

export const pay = async (req, dbContext, paymentData = {}) => {
  const t = validatePaymentData(paymentData);
  if (!t) return { isInvalid: true };

  const { cardNumber, cardHolder } = paymentData;
  let tokenContent;
  try{
    tokenContent = verifyToken(req.token);
  } catch(err) {
    logger.error({ dbContext, cardNumber,  cardHolder }, 'INCONSISTENCY_DETECTED - Payment token is not valid');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 401;
    throw error;
  }

  const apiKey = getApiKeyFromRequest(req);
  const apiKeyVerification = verifyApiKey(apiKey);

  if (!apiKeyVerification) {
    logger.error({ dbContext, cardNumber, cardHolder }, 'INCONSISTENCY_DETECTED - ApiKey is not valid');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 401;
    throw error;
  }

  const { clientId } = apiKeyVerification;
  const { clientId: tokenClientId } = tokenContent;

  if (clientId !== tokenClientId) {
    logger.error({ dbContext, tokenContent, cardHolder, cardHolder, clientId }, 'INCONSISTENCY_DETECTED - Unmatching keys');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 401;
    throw error;
  }

  validatePreconditions(['invoice', 'customerId', 'amount', 'clientId', 'dbContext', 'cardNumber', 'cardHolder', 'securityCode', 'expirationDate'], { ...tokenContent, ...paymentData, dbContext });
  const { invoice, customerId, amount } = tokenContent;

  const validCard = validatePaymentData(paymentData, tokenContent);
  if (!validCard) return { isInvalid: true };

  const privateKey = await getClientPrivateKey(dbContext, tokenClientId);
  
  const { id: paymentRequestId } = await paymentRepo.createPaymentRequest(dbContext, mapParams({ clientId: tokenClientId, externalInvoiceId: invoice, externalCustomerId: customerId, amount, cardNumber: encryptWithPrivateKey(cardNumber, privateKey, true), cardHolder: encryptWithPrivateKey(cardHolder, privateKey, true) }));
  if (!paymentRequestId) {
    return null;
  }

  const { transaction } = await paymentRepo.createTransaction(dbContext, mapParams({ paymentRequestId }));
  return await paymentRepo.createPaymentResponse(dbContext, mapParams({ paymentRequestId, transaction, status: 'SUCCESS' }));
};

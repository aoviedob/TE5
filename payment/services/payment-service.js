import * as paymentRepo from '../dal/payment-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { decryptWithPrivateKey, decrypt, encryptWithPrivateKey } from './crypto-service';
import { domain, formUrl } from '../config';

export const getClientById = async (dbContext, clientId) => {
  validatePreconditions(['dbContext', 'clientId'], { dbContext, clientId });
  return mapRepoEntity(await(paymentRepo.getCustomerById(dbContext, clientId)));
};

export const initiatePayment = async(dbContext, clientId, body) => {
  validatePreconditions(['dbContext', 'clientId'], { dbContext, clientId });
  const client = await getClientById(dbContext, clientId);
  
  if (client == null) {
    logger.error({ dbContext, clientId }, 'INCONSISTENCY_DETECTED - Client does not exist');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }
  const { privateKey: encryptedPrivateKey } = client;
  const privateKey = decrypt(encryptedPrivateKey).privateKey;
  
  let decryptedBody;
  try {
    decryptedBody = decryptWithPrivateKey(body, privateKey);  
  } catch(err) {
    logger.error({ dbContext, clientId }, 'INCONSISTENCY_DETECTED - Content is not properly encrypted');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }

  const { invoice, customerId, amount } = decryptedBody;
  const apiKey = createApiKey();

  return encryptWithPrivateKey({
    formUrl: `${domain}${formUrl}?${apiKey}`,
    apiKey,
  }, privateKey);
};

export const pay = () => {

};

export const getCustomers = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await customerRepo.getCustomers(dbContext)).map(customer => mapRepoEntity(customer));
};

export const getCustomerById = async (dbContext, customerId) => {
  validatePreconditions(['dbContext', 'customerId'], { dbContext, customerId });
  return mapRepoEntity((await customerRepo.getCustomerById(dbContext, customerId)));
};

export const getCustomersByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return (await customerRepo.getCustomersByName(dbContext, name)).map(customer => mapRepoEntity(customer));
};

export const getCustomersByEmail = async (dbContext, email) => {
  validatePreconditions(['dbContext', 'email'], { dbContext, email });
  return (await customerRepo.getCustomersByEmail(dbContext, email)).map(customer => mapRepoEntity(customer));
};

export const getCustomerByEmail = async (dbContext, email) => {
  validatePreconditions(['dbContext', 'email'], { dbContext, email });
  return mapRepoEntity(await customerRepo.getCustomerByEmail(dbContext, email));
};

export const updateCustomer = async (dbContext, customerId, customer) => { 
  validatePreconditions(['dbContext', 'customerId', 'customer'], { dbContext, customerId, customer });
  return await customerRepo.updateCustomer(dbContext, customerId, mapParams(customer));
};

export const createCustomer = async (dbContext, customer) => {
  validatePreconditions(['dbContext', 'email', 'fullname', 'password'], { dbContext, ...customer });
  const externalUserId = await createUser(customer);
  const { id: customerId } = await customerRepo.createCustomer(dbContext, mapParams({ ...customer, externalUserId }));
  return await getCustomerById(dbContext, customerId);
};

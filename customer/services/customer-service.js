import * as customerRepo from '../dal/customer-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import request from 'superagent';
import { authExternalLoginUrl, authCreateUserUrl, authExternalLoginCredentials } from '../config';
import { encrypt } from './crypto-service';

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
  
  const { user, password } = authExternalLoginCredentials;
  const encryptedCredentials = encrypt({ user, password });
  const { token } = await request
   .post(authExternalLoginUrl)
   .send(encryptedCredentials)
   .set('Accept', 'application/json');

  const { id: externalUserId } = await request
   .post(authCreateUserUrl)
   .send({ ...customer, isCustomer: true })
   .set('Authorization', `Bearer ${token}`)
   .set('Accept', 'application/json');

  const { id: customerId } = await customerRepo.createCustomer(dbContext, mapParams({ ...customer, externalUserId }));
  return await getCustomerById(dbContext, customerId);
};

export const deleteCustomer = async (dbContext, customerId) => {
  validatePreconditions(['dbContext', 'customerId'], { dbContext, customerId });
  await customerRepo.deleteCustomer(dbContext, customerId);
};

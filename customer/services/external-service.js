import { authExternalLoginUrl, authCreateUserUrl, authExternalLoginCredentials } from '../config';
import request from 'superagent';
import { encrypt } from './crypto-service';

export const createUser = async customer => {
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

  return externalUserId;
};
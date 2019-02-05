import { authExternalLoginUrl, authCreateUserUrl, authExternalLoginCredentials, productUrl } from '../config';
import request from 'superagent';
import { encrypt } from './crypto-service';

const getTemporalToken = async() => {
  const { user, password } = authExternalLoginCredentials;
  const encryptedCredentials = encrypt({ user, password });
  const { token } = await request
    .post(authExternalLoginUrl)
    .send(encryptedCredentials)
    .set('Accept', 'application/json');

  return token;
};

export const createUser = async customer => {
  const token = await getTemporalToken();
  const { id: externalUserId } = await request
    .post(authCreateUserUrl)
    .send({ ...customer, isCustomer: true })
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json');

  return externalUserId;
};

export const getProduct = async (req, productId) =>
  await request
    .get(`${productUrl}/${productId}`)
    .set('Authorization', `Bearer ${req.token}`)
    .set('Accept', 'application/json');
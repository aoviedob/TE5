import { authExternalLoginUrl, authCreateUserUrl, authExternalLoginCredentials, productUrl } from '../config';
import request from 'superagent';
import { encrypt } from './crypto-service';

const getTemporalToken = async() => {
  const { user, password } = authExternalLoginCredentials;
  const encryptedCredentials = encrypt({ user, password });
  const { token } = await request
    .post(authExternalLoginUrl)
    .type('form')
    .accept('application/json')
    .send(encryptedCredentials);

  return token;
};

export const createUser = async customer => {

  const token = await getTemporalToken();
  console.log('customer', customer);
  const { id: externalUserId } = await request
    .post(authCreateUserUrl)
    .type('form')
    .set('Authorization', `Bearer ${token}`)
    .accept('application/json')
    .send({ ...customer, isCustomer: true })

  return externalUserId;
};

export const getProduct = async (req, productId) =>
  await request
    .get(`${productUrl}/${productId}`)
    .set('Authorization', `Bearer ${req.token}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
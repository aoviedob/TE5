import { authExternalLoginUrl, authCreateUserUrl, authExternalLoginCredentials, productUrl } from '../config';
import request from 'superagent';
import { encrypt } from './crypto-service';

const getTemporalToken = async() => {
  const { email, password } = authExternalLoginCredentials;
  const encryptedCredentials = encrypt({ email, password });
  const { body } = await request
    .post(authExternalLoginUrl)
    .type('form')
    .accept('application/json')
    .send({ body: encryptedCredentials });

  return body.token;
};

export const createUser = async customer => {

  const token = await getTemporalToken();

  try {  
    const { body } = await request
      .post(authCreateUserUrl)
      .type('form')
      .set('Authorization', `Bearer ${token}`)
      .accept('application/json')
      .send({ ...customer, isCustomer: true });

      return body.id;
   } catch(error) {
     throw error;
   }
};

export const getProduct = async (req, productId) => {
  const result = await request
    .get(`${productUrl}/${productId}`)
    .set('Authorization', `Bearer ${req.token}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  return result.body;
};

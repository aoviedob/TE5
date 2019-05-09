import { authExternalLoginUrl, authCreateUserUrl, authExternalLoginCredentials, productUrl, initiatePaymentUrl, crypto, paymentClientId } from '../config';
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
    const result = await request
      .post(authCreateUserUrl)
      .type('form')
      .set('Authorization', `Bearer ${token}`)
      .accept('application/json')
      .send({ ...customer, isCustomer: true });
      console.log('resultHola', result);
      console.log('bodyHola', result.body);
      return result.body.id;
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

export const initiatePayment = async ({  invoice, customerId, amount }) => {
  try {
    const payload = encrypt({ invoice, customerId, amount }, crypto.paymentEncryptionKey);
    const result = await request
      .post(initiatePaymentUrl)
      .type('form')
      .accept('application/json')
      .send({ payload, clientId: paymentClientId });
      console.log('resultHola', result);
      console.log('bodyHola', result.body);
      return result.body;
   } catch(error) {
     throw error;
   }
}

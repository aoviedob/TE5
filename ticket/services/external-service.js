import { authExternalLoginUrl, authCreateUserUrl, authExternalLoginCredentials, productUrl, initiatePaymentUrl } from '../config';
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

export const initiatePayment = async content => {
  const encryptedContent = encrypt(content);

  try {  
    const result = await request
      .post(authCreateUserUrl)
      .type('form')
      .accept('application/json')
      .send({ body: encryptedCredentials });

      return externalUserId;
   } catch(error) {
     throw error;
   }
};


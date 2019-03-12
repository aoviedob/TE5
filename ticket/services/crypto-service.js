import crypto from 'crypto';
import { crypto as cryptoConfig } from '../config';
import jwt from 'jsonwebtoken';

const encrypt = object => { 
  const { algorithmIvSize, algorithm, sharedEncryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const initializationVector = crypto
    .randomBytes(algorithmIvSize)
    .toString(algorithmEncode)
    .slice(0, algorithmIvSize);

  const cipher = crypto.createCipheriv(algorithm, sharedEncryptionKey.slice(0, algorithmKeySize), initializationVector);
  let encryptedJSON = cipher.update(JSON.stringify(object), algorithmCharset, algorithmEncode);
  encryptedJSON += cipher.final(algorithmEncode);

  return `${initializationVector}:${encryptedJSON}`;
};

const decrypt = (encryptedJSON, customEncryptionKey = null) => {
  const { algorithm, encryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const encryptedParts = encryptedJSON.split(':');
  const initializationVector = encryptedParts[0];
  const encryptedText = encryptedParts[1];

  const decipher = crypto.createDecipheriv(algorithm, (customEncryptionKey || encryptionKey).slice(0, algorithmKeySize), initializationVector);
  let decryptedText = decipher.update(encryptedText, algorithmEncode, algorithmCharset);
  decryptedText += decipher.final(algorithmCharset);
  return JSON.parse(decryptedText);
};

export const createToken = (object, options = {}) => {
  const { tokenKey, tokenExpiresIn, tokenAlgorithm } = cryptoConfig;
  
  const encryptedJSON = encrypt(object);
  const tokenOptions = { expiresIn: tokenExpiresIn, algorithm: tokenAlgorithm, ...options };
  return jwt.sign({ body: encryptedJSON }, tokenKey , tokenOptions);
};

export const decodeToken = token => {
  let decodedToken = {};
  try {
    const { body } = jwt.decode(token);
    decodedToken.body = decrypt(body);

    const { tokenKey } = cryptoConfig;
    jwt.verify(token, tokenKey);
  } catch(error) {
    decodedToken.error = error;
  }

  return decodedToken;
};
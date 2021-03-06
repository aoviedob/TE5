import crypto from 'crypto';
import { crypto as cryptoConfig } from '../config';
import jwt from 'jsonwebtoken';

export const encrypt = (data, customEncryptionKey, isText = false) => { 
  const { algorithmIvSize, algorithm, encryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const initializationVector = crypto
    .randomBytes(algorithmIvSize)
    .toString(algorithmEncode)
    .slice(0, algorithmIvSize);

  const cipher = crypto.createCipheriv(algorithm, (customEncryptionKey || encryptionKey).slice(0, algorithmKeySize), initializationVector);
  let encryptedJSON = cipher.update((isText ? data : JSON.stringify(data)), algorithmCharset, algorithmEncode);
  encryptedJSON += cipher.final(algorithmEncode);

  return `${initializationVector}:${encryptedJSON}`;
};

export const decrypt = (encryptedJSON, customEncryptionKey = null, isText = false ) => {
  const { algorithm, encryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const encryptedParts = encryptedJSON.split(':');
  const initializationVector = encryptedParts[0];
  const encryptedText = encryptedParts[1];

  const decipher = crypto.createDecipheriv(algorithm, (customEncryptionKey || encryptionKey).slice(0, algorithmKeySize), initializationVector);
  let decryptedText = decipher.update(encryptedText, algorithmEncode, algorithmCharset);
  decryptedText += decipher.final(algorithmCharset);
  return isText ? decryptedText : JSON.parse(decryptedText);
};

export const createToken = (object, options = {}) => {
  const { tokenKey, tokenExpiresIn, tokenAlgorithm } = cryptoConfig;
  
  const encryptedJSON = encrypt(object);
  const tokenOptions = { expiresIn: tokenExpiresIn, algorithm: tokenAlgorithm, ...options };
  return jwt.sign({ body: encryptedJSON }, tokenKey , tokenOptions);
};

export const verifyToken = token => {
  const { tokenKey } = cryptoConfig;
  const { body } = jwt.verify(token, tokenKey);
  return decrypt(body);
};

export const createApiKey = (object, options = {}) => {
  const { apiEncryptionKey, tokenAlgorithm } = cryptoConfig;

  const tokenOptions = { algorithm: tokenAlgorithm, ...options };
  return jwt.sign(object, apiEncryptionKey , tokenOptions);
};

export const verifyApiKey = token => {
  const { apiEncryptionKey } = cryptoConfig;
  try {
    const content = jwt.verify(token, apiEncryptionKey);
  } catch (error) {
    return false;
  }
  return content;
};


export const createPrivateKey = (object, options = {}) => {
  const { clientEncryptionKey, tokenAlgorithm } = cryptoConfig;

  const tokenOptions = { algorithm: tokenAlgorithm, ...options };
  return jwt.sign({}, clientEncryptionKey , tokenOptions);
};

export const decryptWithPrivateKey = (body, privateKey, isText) => decrypt(body, privateKey, isText);

export const encryptWithPrivateKey = (object, privateKey, isText) =>  encrypt(object, privateKey, isText);

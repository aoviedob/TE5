import crypto from 'crypto';
import { crypto as cryptoConfig } from '../config';
import jwt from 'jsonwebtoken';

export const encrypt = (object, customEncryptionKey) => { 
  const { algorithmIvSize, algorithm, encryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const initializationVector = crypto
    .randomBytes(algorithmIvSize)
    .toString(algorithmEncode)
    .slice(0, algorithmIvSize);

  const cipher = crypto.createCipheriv(algorithm, (customEncryptionKey || encryptionKey).slice(0, algorithmKeySize), initializationVector);
  let encryptedJSON = cipher.update(JSON.stringify(object), algorithmCharset, algorithmEncode);
  encryptedJSON += cipher.final(algorithmEncode);

  return `${initializationVector}:${encryptedJSON}`;
};

export const decrypt = (encryptedJSON, customEncryptionKey = null) => {
  const { algorithm, encryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const encryptedParts = encryptedJSON.split(':');
  const initializationVector = encryptedParts[0];
  const encryptedText = encryptedParts[1];

  const decipher = crypto.createDecipheriv(algorithm, (customEncryptionKey || encryptionKey).slice(0, algorithmKeySize), initializationVector);
  let decryptedText = decipher.update(encryptedText, algorithmEncode, algorithmCharset);
  decryptedText += decipher.final(algorithmCharset);
  return JSON.parse(decryptedText);
};

export const decryptWithSharedPrivateKey = encryptedJSON =>
  decrypt(encryptedJSON, cryptoConfig.sharedEncryptionKey);

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

export const createHash = text => crypto.createHash('sha256').update(text).digest(cryptoConfig.algorithmEncode);

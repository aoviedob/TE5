import crypto from 'crypto';
import { crypto as cryptoConfig } from '../config';

export const encrypt = (data, customEncryptionKey, isText = false) => { 
  const { algorithmIvSize, algorithm, sharedEncryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const initializationVector = crypto
    .randomBytes(algorithmIvSize)
    .toString(algorithmEncode)
    .slice(0, algorithmIvSize);

  const cipher = crypto.createCipheriv(algorithm, (customEncryptionKey || sharedEncryptionKey).slice(0, algorithmKeySize), initializationVector);
  let encryptedJSON = cipher.update((isText ? data : JSON.stringify(data)), algorithmCharset, algorithmEncode);
  encryptedJSON += cipher.final(algorithmEncode);

  return `${initializationVector}:${encryptedJSON}`;
};

export const decrypt = (encryptedJSON, customEncryptionKey = null, isText = false ) => {
  const { algorithm, sharedEncryptionKey, algorithmEncode, algorithmCharset, algorithmKeySize } = cryptoConfig;
  
  const encryptedParts = encryptedJSON.split(':');
  const initializationVector = encryptedParts[0];
  const encryptedText = encryptedParts[1];

  const decipher = crypto.createDecipheriv(algorithm, (customEncryptionKey || sharedEncryptionKey).slice(0, algorithmKeySize), initializationVector);
  let decryptedText = decipher.update(encryptedText, algorithmEncode, algorithmCharset);
  decryptedText += decipher.final(algorithmCharset);
  return isText ? decryptedText : JSON.parse(decryptedText);
};
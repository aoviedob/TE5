export const encrypt = object => { 
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

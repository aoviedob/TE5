export const convertToSnakeCase = str => {
  const upperChars = str.match(/([A-Z])/g);
  if (!upperChars) return str;
    
  let snakeCaseStr = upperChars.reduce((acc, upperChar) => {
  	 console.log('acc', acc);
     acc = acc.replace(new RegExp(upperChar), `_${upperChar.toLowerCase()}`);
     return acc;
  }, str);

  if (snakeCaseStr.slice(0, 1) === '_') {
    snakeCaseStr = snakeCaseStr.slice(1);
  }
  return snakeCaseStr;
};

export const mapParams = paramsObj =>
  Object.keys(paramsObj).reduce((acc, key) => {
    const snakeCaseKey = convertToSnakeCase(key);
  	acc[snakeCaseKey] = paramsObj[key];
  	return acc;
  }, {});

export const convertSnakeToCamelCase = str => str.replace(/(\_\w)/g, m => m[1].toUpperCase());

export const mapRepoEntity = entity =>
  Object.keys(entity).reduce((acc, key) => {
  	const camelCaseKey = convertSnakeToCamelCase(key);
  	acc[camelCaseKey] = entity[key];
  	return acc;
  }, {});
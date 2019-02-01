export const convertToSnakeCase = str => {
  const upperChars = str.match(/([A-Z])/g);
  if (!upperChars) return str;
    
  let snakeCaseStr = upperChars.reduce((acc, upperChar) => {
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

const isObject = value => value !== null && value !== undefined && typeof value === 'object';

export const mapRepoEntity = entity =>
  Object.keys(entity).reduce((acc, key) => {
    console.log('key', key);
    const camelCaseKey = convertSnakeToCamelCase(key);
    console.log('camelCaseKey', camelCaseKey);
    const value = entity[key];
    if (Array.isArray(value)) {
      console.log('value', value);
      acc[camelCaseKey] = value.map(item => (isObject(item) ? mapRepoEntity(item) : item ));
    } if (isObject(value)) {
      acc[camelCaseKey] = mapRepoEntity(value);
    } else {
      acc[camelCaseKey] = value;
    }
  	return acc;
  }, {});
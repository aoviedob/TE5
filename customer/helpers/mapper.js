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

const isObject = value => value !== null && value !== undefined && !(value instanceof Date) && !Array.isArray(value) && typeof value === 'object';

export const mapRepoEntity = entity =>
  Object.keys(entity).reduce((acc, key) => {
    const camelCaseKey = convertSnakeToCamelCase(key);
    const value = entity[key];
    if (Array.isArray(value)) {
      const mappedArray = value.map(item => (isObject(item) ? mapRepoEntity(item) : item ));
      acc[camelCaseKey] = mappedArray;
    } if (isObject(value)) {
      acc[camelCaseKey] = mapRepoEntity(value);
    } else if(!isObject(value) && !Array.isArray(value)) {
      acc[camelCaseKey] = value;
    }
  	return acc;
  }, {});
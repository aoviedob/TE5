import * as userTypeRepo from '../dal/user-type-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';

export const getUserTypes = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await userTypeRepo.getUserTypes(dbContext)).map(userType => mapRepoEntity(userType));
};

export const getUserTypeById = async (dbContext, userTypeId) => {
  validatePreconditions(['dbContext', 'userTypeId'], { dbContext, userTypeId });
  return mapRepoEntity((await userTypeRepo.getUserTypeById(dbContext, userTypeId)));
};

export const getUserTypeByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return mapRepoEntity((await userTypeRepo.getUserTypeByName(dbContext, name)));
};

export const getUserTypesByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return (await userTypeRepo.getUserTypesByName(dbContext, name)).map(userType => mapRepoEntity(userType));
};

export const updateUserType = async (dbContext, userTypeId, userType) => { 
  validatePreconditions(['dbContext', 'userTypeId', 'userType'], { dbContext, userTypeId, userType });
  return await userTypeRepo.updateUserType(dbContext, userTypeId, mapParams(userType));
};

export const createUserType = async (dbContext, userType) => {
  validatePreconditions(['dbContext', 'name', 'displayName'], { dbContext, ...userType });
  const { id: userTypeId } = await userTypeRepo.createUserType(dbContext, mapParams(userType));
  return await getUserTypeById(dbContext, userTypeId);
};

export const deleteUserType = async (dbContext, userTypeId) => {
  validatePreconditions(['dbContext', 'userTypeId'], { dbContext, userTypeId });
  await userTypeRepo.deleteUserType(dbContext, userTypeId);
};
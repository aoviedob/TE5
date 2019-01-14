import * as roleRepo from '../dal/role-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';

export const getRoles = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await roleRepo.getRoles(dbContext)).map(role => mapRepoEntity(role));
};

export const getRoleById = async (dbContext, roleId) => {
  validatePreconditions(['dbContext', 'roleId'], { dbContext, roleId });
  return mapRepoEntity((await roleRepo.getRoleById(dbContext, roleId)));
};

export const getRoleByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return mapRepoEntity((await roleRepo.getRoleByName(dbContext, name)));
};

export const getRolesByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return (await roleRepo.getRolesByName(dbContext, name)).map(role => mapRepoEntity(role));
};

export const updateRole = async (dbContext, roleId, role) => { 
  validatePreconditions(['dbContext', 'roleId', 'role'], { dbContext, roleId, role });
  return await roleRepo.updateRole(dbContext, roleId, mapParams(role));
};

export const createRole = async (dbContext, role) => {
  validatePreconditions(['dbContext', 'name', 'displayName', 'rights'], { dbContext, ...role });
  const { id: roleId } = await roleRepo.createRole(dbContext, mapParams(role));
  return await getRoleById(dbContext, roleId);
};

export const deleteRole = async (dbContext, roleId) => {
  validatePreconditions(['dbContext', 'roleId'], { dbContext, roleId });
  await roleRepo.deleteRole(dbContext, roleId);
};

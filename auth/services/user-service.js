import * as userRepo from '../dal/user-repo';
import { createHash, createToken, verifyToken, decryptWithSharedPrivateKey } from './crypto-service';
import { validatePreconditions } from '../helpers/validator';
import { mapParams, mapRepoEntity } from '../helpers/mapper';
import { maxLoginAttempts, accountLockedMinutes } from '../config';
import moment from 'moment';
import { getTokenFromRequest } from '../helpers/request';
import { getUserTypeByName } from './user-type-service';
import { getRoleByName } from './role-service';
import * as DalTypes from '../helpers/enums/dal-types';
import { authExternalLoginCredentials } from '../config';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'UserService'});

export const sanitizeUser = user => { 
  if (Object.keys(user).length === 0) {
    return user;
  }

  return mapRepoEntity({
    id: user.id,
    user_type_id: user.user_type_id,
    fullname: user.fullname,
    alias: user.alias,
    email: user.email,
    phone: user.phone,
    metadata: user.metadata,
    updated_at: user.updated_at,
  });
};

export const getUsers = async dbContext => { 
  validatePreconditions(['dbContext'], {dbContext});
  return (await userRepo.getUsers(dbContext)).map(user => sanitizeUser(user));
};

export const getUserById = async (dbContext, userId) => {
  validatePreconditions(['dbContext', 'userId'], {dbContext, userId});
  return sanitizeUser(await userRepo.getUserById(dbContext, userId));
};

export const getUserByEmail = async (dbContext, email) => { 
  validatePreconditions(['dbContext', 'email'], {dbContext, email});
  return sanitizeUser(await userRepo.getUserByEmail(dbContext, email));
};

export const getUsersByEmail = async (dbContext, email) => {
  validatePreconditions(['dbContext', 'email'], {dbContext, email});
  return (await userRepo.getUsersByEmail(dbContext, email)).map(user => sanitizeUser(user));
};

export const updateUser = async (dbContext, userId, user) => { 
  validatePreconditions(['dbContext', 'userId', 'user'], { dbContext, userId, user });
  return await userRepo.updateUser(dbContext, userId, mapParams(user));
};

export const createUser = async (dbContext, user = {}) => {
  const preconditions = ['dbContext', 'fullname', 'email', 'password'];
  if (!user.isCustomer) {
    preconditions.push('userTypeId');
    preconditions.push('roleId');
  }
  validatePreconditions(preconditions, { dbContext, ...user });

  let userToSave = { ...user };
  if (user.isCustomer) {
    const { id: userTypeId } = await getUserTypeByName(dbContext, DalTypes.PredefinedUserType.CUSTOMER);
    const { id: roleId } = await getRoleByName(dbContext, DalTypes.PredefinedRole.CUSTOMER);
    userToSave = { ...userToSave, userTypeId, roleId };
  }

  const userId = await userRepo.createUser(dbContext, { ...mapParams(userToSave), password: createHash(userToSave.password) });
  return await getUserById(dbContext, userId);
};

export const deleteUser = async (dbContext, userId) => {
  validatePreconditions(['dbContext', 'userId'], {dbContext, userId});
  await userRepo.deleteUser(dbContext, userId);
};

const updateLoginAttempts = async (dbContext, email) => {
  const { id: userId, login_attempts } = await userRepo.getUserByEmail(dbContext, email);
  if (!userId) { 
    logger.error({ email }, 'Account does not exist');
    return;
  }

  await updateUser(dbContext, userId, { login_attempts: login_attempts + 1, last_login_attempt: moment().format() });
};

const isAccountLocked = async (dbContext, dbUser) => {
  const { login_attempts, last_login_attempt } = dbUser;
  if (login_attempts < maxLoginAttempts) return false;

  const duration = moment.duration(moment().diff(moment(last_login_attempt)));
  const hours = duration.asHours();
  const minutes = duration.asMinutes();

  if(parseInt(hours) > 0 || minutes > accountLockedMinutes) {
    await updateUser(dbContext, dbUser.id, { login_attempts: 0 });
    return false;
  }

  return true;
};

const validateCredentialsAndCreateToken = async(dbContext, { email, password, tokenOptions = {} }) => {
  const { user: dbUser, role, userType } = await userRepo.login(dbContext, { email, password: createHash(password) });

  if (!dbUser) {
    await updateLoginAttempts(dbContext, email);
    logger.error({ email }, 'Unauthorized Login');
    const error = new Error('UNAUTHORIZED');
    error.status = 401;
    throw error;
  }

  if((await isAccountLocked(dbContext, dbUser))){
    logger.error({ email }, 'Account is locked');
    const error = new Error('ACCOUNT_LOCKED');
    error.status = 401;
    throw error;
  }

  return { token: createToken({ user: sanitizeUser(dbUser), role: mapRepoEntity(role), userType: mapRepoEntity(userType) }, tokenOptions) };
};

export const login = async (dbContext, user) => {
  const { email, password } = user || {};
  validatePreconditions(['dbContext', 'email', 'password'], {dbContext, email, password});
 
  return await validateCredentialsAndCreateToken(dbContext, { email, password });
};

export const externalLogin = async (dbContext, encryptedContent) => {
  validatePreconditions(['dbContext', 'encryptedContent'], {dbContext, encryptedContent });
  const user = decryptWithSharedPrivateKey(encryptedContent);
  validatePreconditions(['email', 'password'], user);
  
  if (user.email !== authExternalLoginCredentials.user) {
    logger.error(user, 'External Login Unauthorized');
    const error = new Error('UNAUTHORIZED_EXTERNAL_LOGIN');
    error.status = 401;
    throw error;
  }

  return await validateCredentialsAndCreateToken(dbContext, { ...user, tokenOptions: { expiresIn: 120 }});
};

export const authenticate = req => {
  try {
    const token = getTokenFromRequest(req);
    return verifyToken(token);
  } catch(err) {
    logger.error({ req, error: err }, 'Authenticate Unauthorized');
    const error = new Error('UNAUTHORIZED');
    error.status = 401;
    throw error;
  }
};

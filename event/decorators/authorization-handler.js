import bunyan from 'bunyan';
import request from 'superagent';
import { authExternalAuthenticateUrl } from '../config';
import { getTokenFromRequest } from '../helpers/request';
const logger = bunyan.createLogger({ name: 'Authorization Handler'});

export const authenticate = async (req, res, next) => {
  const tokenBody = await request
    .get(authExternalAuthenticateUrl)
    .set('Authorization', `Bearer ${getTokenFromRequest(req)}`)
    .set('Content-Type', 'application/json')
    .catch(error => {
      logger.error(error, 'Authenticate error');
    });

  if (!tokenBody) {
    next();
  }
  req.tokenBody = JSON.parse(tokenBody.text);
  next();
};

export const RequiredRole = roles => (target, name, descriptor) => {
 var oldValue = descriptor.value;

  descriptor.value = (...args) => {
    const { role = {}, user = {} } = args[0].tokenBody;
    
    if (roles.includes(role.name)) {
      return oldValue.apply(this, args);     
    }

    const message = `Unauthorized Role for ${name}`;
    logger.error({ userId: user.id, role: role.name }, message);
    const error = new Error('NOT_ENOUGH_RIGHTS');
    error.status = 403;
    throw error;
  };

  return descriptor;
};

export const RequiredRight = rights => (target, name, descriptor) => {
 var oldValue = descriptor.value;

  descriptor.value = (...args) => {
    const { role = {}, user = {} } = JSON.parse(args[0].tokenBody);

    if (role.rights.some(r => rights.includes(r))) {
    return oldValue.apply(this, args);     
    }

    const message = `Unauthorized rights for ${name}`;
    logger.error({ userId: user.id, role: role.name }, message);
    const error = new Error('NOT_ENOUGH_RIGHTS');
    error.status = 403;
    throw error;
  };

  return descriptor;
};
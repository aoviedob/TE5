import { verifyToken } from '../services/crypto-service';
import { getTokenFromRequest } from '../helpers/request';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'AuthApiMiddleware'});

const unprotectedApis = [
  '/api/login',
  '/api/external/login'
];

export const requestHandler = (route, action) =>
  async (req, res, next) => {
    if (!unprotectedApis.includes(route)) {
      try {
        const token = getTokenFromRequest(req);
        req.tokenBody = verifyToken(token);
        req.token = token;
      } catch(error) {
        res.status(401).send('UNAUTHORIZED');
        return;
      }
    }

    try {
      const result = await action(req);
      res.setHeader('Content-Type', 'application/json');
      res.json(result);
    } catch(error) {
      logger.error(error, 'Error on request');
      res.status(error.status || 400).send(error.message);
    }
  };

export const routerMiddleware = app => {
  const routeMethods = ['get', 'put', 'post', 'delete'];

  routeMethods.forEach(method => {
    const router = { [method]: app[method].bind(app) };
    
    app[method] = (route, ...routeMiddleware) => {
      if (!routeMiddleware || !routeMiddleware.length) return router[method](route);

      const [action] = routeMiddleware.splice(routeMiddleware.length - 1, 1);
      return router[method](route, ...routeMiddleware, requestHandler(route, action));
    };
  });
};
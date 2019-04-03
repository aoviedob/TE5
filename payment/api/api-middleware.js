import { getTokenFromRequest } from '../helpers/request';

export const requestHandler = (route, action) =>
  async (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);
        req.token = token;
      } catch(error) {
        res.status(401).send('UNAUTHORIZED');
        return;
      }
  
    try {
      const result = await action(req);
      res.setHeader('Content-Type', 'application/json');
      res.json(JSON.stringify(result));
    } catch(error) {
      console.log('errorHola', error);
      res.status(error.status).send(error.message);
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
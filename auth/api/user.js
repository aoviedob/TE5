import * as userService from '../services/user-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, RequiredRight } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class UserApi {

  constructor(app) {
    app.get('/api/users', this.getUsers);
    app.get('/api/user/:userId', this.getUserById);
    app.get('/api/user/byEmail/:email', this.getUserByEmail);
    app.get('/api/users/byEmail/:email', this.getUsersByEmail);
    app.post('/api/user', this.createUser);
    app.put('/api/user/:userId', this.updateUser);
    app.delete('/api/user/:userId', this.deleteUser);
    app.post('/api/login', this.login);
    app.post('/api/authenticate', this.authenticate);
    app.post('/api/external/login', this.externalLogin);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getUsers(req) { return await userService.getUsers(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN])
  async getUserById(req) {
    const { userId } = req.params || {};
    return await userService.getUserById(POSTGRES_CONTEXT, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getUserByEmail(req) {
    const { email } = req.params || {};
    return await userService.getUserByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getUsersByEmail(req) {
    const { email } = req.params || {};
    return await userService.getUsersByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EXTERNAL])
  async createUser(req) {
    const { body } = req;
    return await userService.createUser(POSTGRES_CONTEXT, body);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async updateUser(req) {
    const { body, params = {} } = req;
    return await userService.updateUser(POSTGRES_CONTEXT, params.userId, body);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async deleteUser(req) {
    const { userId } = req.params || {};
    return await userService.deleteUser(POSTGRES_CONTEXT, userId);
  }

  @RequiredRight(['externalLogin'])
  async externalLogin(req) {
    const { body } = req;
    return await userService.externalLogin(POSTGRES_CONTEXT, body); 
  }
  
  async login(req) {
    const { body } = req;
    return await userService.login(POSTGRES_CONTEXT, body);
  }

  authenticate(req) { return authenticate(req); }
}

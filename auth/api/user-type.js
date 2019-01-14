import * as userTypeService from '../services/user-type-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole } from '../decorators/authorization-handler';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class UserTypeApi {

  constructor(app) {
    app.get('/api/userTypes', this.getUserTypes);
    app.get('/api/userType/:userTypeId', this.getUserTypeById);
    app.get('/api/userType/byName/:name', this.getUserTypeByName);
    app.get('/api/userTypes/byName/:name', this.getUserTypesByName);
    app.post('/api/userType', this.createUserType);
    app.put('/api/userType/:userTypeId', this.updateUserType);
    app.delete('/api/userType/:userTypeId', this.deleteUserType);
  }

  @RequiredRole(['admin'])
  async getUserTypes(req) { return await userTypeService.getUserTypes(POSTGRES_CONTEXT); }

  @RequiredRole(['admin'])
  async getUserTypeById(req) {
    const { userTypeId } = req.params || {};
    return await userTypeService.getUserTypeById(POSTGRES_CONTEXT, userTypeId);
  }

  @RequiredRole(['admin'])
  async getUserTypeByName(req) {
    const { name } = req.params || {};
    return await userTypeService.getUserTypeByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole(['admin'])
  async getUserTypesByName(req) {
    const { name } = req.params || {};
    return await userTypeService.getUserTypesByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole(['admin'])
  async createUserType(req) {
    const { body = {} } = req;
    return await userTypeService.createUserType(POSTGRES_CONTEXT, body);
  }

  @RequiredRole(['admin'])
  async updateUserType(req) {
    const { body, params = {} } = req;
    return await userTypeService.updateUserType(POSTGRES_CONTEXT, params.userTypeId, body);
  }

  @RequiredRole(['admin'])
  async deleteUserType(req) {
    const { userTypeId } = req.params || {};
    return await userTypeService.deleteUserType(POSTGRES_CONTEXT, userTypeId);
  }

}

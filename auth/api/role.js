import * as roleService from '../services/role-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole } from '../decorators/authorization-handler';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class RoleApi {

  constructor(app) {
    app.get('/api/roles', this.getRoles);
    app.get('/api/role/:roleId', this.getRoleById);
    app.get('/api/role/byName/:name', this.getRoleByName);
    app.get('/api/roles/byName/:name', this.getRolesByName);
    app.post('/api/role', this.createRole);
    app.put('/api/role/:roleId', this.updateRole);
    app.delete('/api/role/:roleId', this.deleteRole);
  }

  @RequiredRole(['admin'])
  async getRoles(req) { return await roleService.getRoles(POSTGRES_CONTEXT); }

  @RequiredRole(['admin'])
  async getRoleById(req) {
    const { roleId } = req.params || {};
    return await roleService.getRoleById(POSTGRES_CONTEXT, roleId);
  }

  @RequiredRole(['admin'])
  async getRoleByName(req) {
    const { name } = req.params || {};
    return await roleService.getRoleByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole(['admin'])
  async getRolesByName(req) {
    const { name } = req.params || {};
    return await roleService.getRolesByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole(['admin'])
  async createRole(req) {
    const { body } = req;
    return await roleService.createRole(POSTGRES_CONTEXT, body);
  }

  @RequiredRole(['admin'])
  async updateRole(req) {
    const { body, params = {} } = req;
    return await roleService.updateRole(POSTGRES_CONTEXT, params.roleId, body);
  }

  @RequiredRole(['admin'])
  async deleteUserType(req) {
    const { roleId } = req.params || {};
    return await roleService.deleteRole(POSTGRES_CONTEXT, roleId);
  }

}
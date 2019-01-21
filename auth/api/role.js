import * as roleService from '../services/role-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

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

  @RequiredRole([PredefinedRole.ADMIN])
  async getRoles(req) { return await roleService.getRoles(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN])
  async getRoleById(req) {
    const { roleId } = req.params || {};
    return await roleService.getRoleById(POSTGRES_CONTEXT, roleId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getRoleByName(req) {
    const { name } = req.params || {};
    return await roleService.getRoleByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getRolesByName(req) {
    const { name } = req.params || {};
    return await roleService.getRolesByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async createRole(req) {
    const { body } = req;
    return await roleService.createRole(POSTGRES_CONTEXT, body);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async updateRole(req) {
    const { body, params = {} } = req;
    return await roleService.updateRole(POSTGRES_CONTEXT, params.roleId, body);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async deleteRole(req) {
    const { roleId } = req.params || {};
    return await roleService.deleteRole(POSTGRES_CONTEXT, roleId);
  }

}
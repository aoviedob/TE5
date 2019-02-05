import * as customerService from '../services/customer-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class CustomerApi {

  constructor(app) {
    app.get('/api/customers', this.getCustomers);
    app.get('/api/customers/:customerId', this.getCustomerById);
    app.get('/api/customers/likeName/:name', this.getCustomersByName);
    app.get('/api/customers/likeEmail/:email', this.getCustomersByEmail);
    app.get('/api/customers/byEmail/:email', this.getCustomerByEmail);
    app.post('/api/customers', this.createCustomer);
    app.put('/api/customers/:customerId', this.updateCustomer);
    app.delete('/api/customers/:customerId', this.deleteCustomer);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getCustomers(req) { return await customerService.getCustomers(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN])
  async getCustomerById(req) {
    const { customerId } = req.params || {};
    return await customerService.getCustomerById(POSTGRES_CONTEXT, customerId);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getCustomersByName(req) {
    const { name } = req.params || {};
    return await customerService.getCustomersByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getCustomersByEmail(req) {
    const { email } = req.params || {};
    return await customerService.getCustomersByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async getCustomerByEmail(req) {
    const { email } = req.params || {};
    return await customerService.getCustomerByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async createCustomer(req) {
    const { body } = req;
    return await customerService.createCustomer(POSTGRES_CONTEXT, body);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.SYSTEM])
  async updateCustomer(req) {
    const { body, params = {} } = req;
    return await customerService.updateCustomer(POSTGRES_CONTEXT, params.customerId, body);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async deleteCustomer(req) {
    const { customerId } = req.params || {};
    return await customerService.deleteCustomer(POSTGRES_CONTEXT, customerId);
  }
}

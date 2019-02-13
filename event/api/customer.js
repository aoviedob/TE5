import * as customerService from '../services/customer-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class UserApi {

  constructor(app) {
    app.get('/api/customers', this.getCustomers);
    app.get('/api/customer/:customerId', this.getCustomerById);
    app.get('/api/customers/byName/:name', this.getCustomersByName);
    app.get('/api/customers/byEmail/:email', this.getCustomersByEmail);
    app.get('/api/customer/byEmail/:email', this.getCustomerByEmail);
    app.post('/api/customer', this.createCustomer);
    app.put('/api/customer/:customerId', this.updateCustomer);
    app.delete('/api/user/:customerId', this.deleteCustomer);
  }

  @RequiredRole(['admin'])
  async getCustomers(req) { return await customerService.getCustomers(POSTGRES_CONTEXT); }

  @RequiredRole(['admin'])
  async getCustomerById(req) {
    const { customerId } = req.params || {};
    return await customerService.getCustomerById(POSTGRES_CONTEXT, customerId);
  }

  @RequiredRole(['admin'])
  async getCustomersByName(req) {
    const { name } = req.params || {};
    return await customerService.getCustomersByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole(['admin'])
  async getCustomersByEmail(req) {
    const { email } = req.params || {};
    return await customerService.getCustomersByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole(['admin'])
  async getCustomerByEmail(req) {
    const { email } = req.params || {};
    return await customerService.getCustomerByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole(['admin'])
  async createCustomer(req) {
    const { body } = req;
    return await customerService.createCustomer(POSTGRES_CONTEXT, body);
  }

  @RequiredRole(['admin'])
  async updateCustomer(req) {
    const { body, params = {} } = req;
    return await customerService.updateCustomer(POSTGRES_CONTEXT, params.userId, body);
  }

  @RequiredRole(['admin'])
  async deleteCustomer(req) {
    const { userId } = req.params || {};
    return await customerService.deleteCustomer(POSTGRES_CONTEXT, userId);
  }
}
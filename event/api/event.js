import * as eventService from '../services/event-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class UserApi {

  constructor(app) {
    app.get('/api/events', this.getEvents);
    app.get('/api/events/:eventId', this.getEventById);
    app.get('/api/events/:categoryId', this.getCustomersByName);
    app.get('/api/customers/byEmail/:email', this.getCustomersByEmail);
    app.get('/api/customer/byEmail/:email', this.getCustomerByEmail);
    app.post('/api/customer', this.createCustomer);
    app.put('/api/customer/:customerId', this.updateCustomer);
    app.delete('/api/user/:customerId', this.deleteCustomer);
  }

  @RequiredRole(['admin'])
  async getEvents(req) { return await eventService.getCustomers(POSTGRES_CONTEXT); }

  @RequiredRole(['admin'])
  async getEventById(req) {
    const { eventId } = req.params || {};
    return await eventService.getEventById(POSTGRES_CONTEXT, eventId);
  }

  @RequiredRole(['admin'])
  async getCustomersByName(req) {
    const { name } = req.params || {};
    return await eventService.getCustomersByName(POSTGRES_CONTEXT, name);
  }

  @RequiredRole(['admin'])
  async getCustomersByEmail(req) {
    const { email } = req.params || {};
    return await eventService.getCustomersByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole(['admin'])
  async getCustomerByEmail(req) {
    const { email } = req.params || {};
    return await eventService.getCustomerByEmail(POSTGRES_CONTEXT, email);
  }

  @RequiredRole(['admin'])
  async createCustomer(req) {
    const { body } = req;
    return await eventService.createCustomer(POSTGRES_CONTEXT, body);
  }

  @RequiredRole(['admin'])
  async updateCustomer(req) {
    const { body, params = {} } = req;
    return await eventService.updateCustomer(POSTGRES_CONTEXT, params.userId, body);
  }

  @RequiredRole(['admin'])
  async deleteCustomer(req) {
    const { userId } = req.params || {};
    return await eventService.deleteCustomer(POSTGRES_CONTEXT, userId);
  }
}

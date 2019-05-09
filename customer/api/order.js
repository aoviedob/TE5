import * as orderService from '../services/order-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class CustomerApi {

  constructor(app) {
    app.get('/api/orders/byCustomer/:customerId', authenticate, this.getOrdersByCustomerId);
    app.get('/api/orders/:orderId', authenticate, this.getOrderById);
    app.get('/api/orders/:customerId/byStatus/:status', authenticate, this.getOrderByStatus);
    app.post('/api/orders', authenticate, this.createOrder);
    app.post('/api/orders/lines',authenticate,  this.createOrderLine);
    app.put('/api/orders/:orderId',authenticate,  this.updateOrder);
    app.put('/api/orders/lines/:orderId/:productId', authenticate, this.updateOrderLine);
    app.delete('/api/orders/:orderId', authenticate, this.deleteOrder);
    app.delete('/api/orders/lines/:orderId/:productId', authenticate, this.deleteOrderLine);
    app.post('/api/orders/place', authenticate, this.placeOrder);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async getOrdersByCustomerId(req) { 
    const { customerId } = req.params || {};
    return await orderService.getOrdersByCustomerId(POSTGRES_CONTEXT, customerId); 
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async getOrderById(req) {
    const { orderId } = req.params || {};
    return await orderService.getOrderById(POSTGRES_CONTEXT, { orderId });
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async getOrderByStatus(req) {
    const { status, customerId } = req.params || {};
    return await orderService.getOrderByStatus(POSTGRES_CONTEXT, { status, customerId });
  }
  
  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async createOrder(req) {
    const { body } = req;
    return await orderService.createOrder(req, { dbContext: POSTGRES_CONTEXT, order: body });
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async placeOrder(req) {
    const { body } = req;
    return await orderService.placeOrder(req, { dbContext: POSTGRES_CONTEXT, order: body });
  }
  
  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async createOrderLine(req) {
    const { body } = req;
    return await orderService.createOrderLine(req, { dbContext: POSTGRES_CONTEXT, orderLine: body });
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async updateOrder(req) {
    const { body, params = {} } = req;
    return await orderService.updateOrder(req, { dbContext: POSTGRES_CONTEXT, orderId: params.orderId, order: body });
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async updateOrderLine(req) {
    const { body, params = {} } = req;
    const { orderId, productId } = params; 
    return await orderService.updateOrderLine(req, { dbContext: POSTGRES_CONTEXT, orderLine: { ...body, orderId, externalProductId: productId } });
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async deleteOrder(req) {
    const { orderId } = req.params || {};
    return await orderService.deleteOrder(POSTGRES_CONTEXT, orderId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async deleteOrderLine(req) {
    const { orderId, productId } = req.params || {};
    return await orderService.deleteOrderLine(req, { dbContext: POSTGRES_CONTEXT, orderId, externalProductId: productId });
  }
}

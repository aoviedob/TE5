import * as ticketService from '../services/ticket-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class TicketApi {

  constructor(app) {
    app.get('/api/tickets', authenticate, this.getTickets);
    app.get('/api/tickets/:ticketId', authenticate, this.getTicketById);
    app.get('/api/tickets/byInvoice/:invoiceId', authenticate, this.getTicketByInvoiceId);
    app.get('/api/tickets/byCategory/:categoryId', authenticate, this.getTicketsByCategoryId);
    app.get('/api/tickets/byCoupon/:couponId', authenticate, this.getTicketsByCouponId);
    app.get('/api/tickets/byCustomer/:customerId', authenticate, this.getTicketsByCustomerId);
    app.post('/api/tickets/reserve', authenticate, this.reserveTicket);
    app.post('/api/tickets/release', authenticate, this.releaseTicket);
    app.post('/api/tickets/confirm', authenticate, this.confirmTicket);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getTickets(req) { return await ticketService.getTickets(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT, PredefinedRole.SYSTEM])
  async getTicketById(req) {
    const { ticketId } = req.params || {};
    return await ticketService.getTicketById(POSTGRES_CONTEXT, ticketId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getTicketByInvoiceId(req) {
    const { invoiceId } = req.params || {};
    return await ticketService.getTicketByInvoiceId(POSTGRES_CONTEXT, invoiceId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getTicketsByCategoryId(req) {
    const { categoryId } = req.params || {};
    return await ticketService.getTicketsByCategoryId(POSTGRES_CONTEXT, categoryId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getTicketsByCouponId(req) {
    const { couponId } = req.params || {};
    return await ticketService.getTicketsByCouponId(POSTGRES_CONTEXT, couponId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT, PredefinedRole.CUSTOMER])
  async getTicketsByCustomerId(req) {
    const { customerId } = req.params || {};
    return await ticketService.getTicketsByCustomerId(POSTGRES_CONTEXT, customerId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async reserveTicket(req) {
    const { body, tokenBody: { user: { id: userId }} } = req;
    return await ticketService.reserveTicket(POSTGRES_CONTEXT, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async releaseTicket(req) {
    const { body } = req;
    return await ticketService.releaseTicket(body);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.CUSTOMER])
  async confirmTicket(req) {
    const { body } = req;
    return await ticketService.confirmTicket(body);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async cancelTicket(req) {
    const { params, tokenBody: { user: { id: userId }} } = req;
    const { ticketId } = params || {};
    return await ticketService.cancelTicket(POSTGRES_CONTEXT, ticketId, userId);
  }
}

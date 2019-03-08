import * as ticketRepo from '../dal/ticket-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { sendQueueMessage } from '../helpers/queue';
import bunyan from 'bunyan';
import QueueMessageTypes from '../helpers/enums/queue-message-types';
import { notify } from '../socketIO';
import SocketTypes from '../helpers/enums/socket-types';
import { getTicketCategoryById, updateTicketCategory } from './ticket-category-service';
import { getCouponById } from './coupon-service';
import DALTypes from '../helpers/enums/dal-types';

const logger = bunyan.createLogger({ name: 'TicketService'});

export const getTickets = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await ticketsRepo.getTickets(dbContext)).map(ticket => mapRepoEntity(ticket));
};

export const getTicketById = async (dbContext, ticketId) => {
  validatePreconditions(['dbContext', 'ticketId'], { dbContext, ticketId });
  return mapRepoEntity((await ticketsRepo.getTicketById(dbContext, ticketId)));
};

export const getTicketByInvoiceId = async (dbContext, invoiceId) => {
  validatePreconditions(['dbContext', 'invoiceId'], { dbContext, invoiceId });
  return mapRepoEntity((await ticketsRepo.getTicketByInvoiceId(dbContext, invoiceId)));
};

export const getTicketsByCategoryId = async (dbContext, categoryId) => {
  validatePreconditions(['dbContext', 'categoryId'], { dbContext, categoryId });
  return (await ticketsRepo.getTicketsByCategoryId(dbContext, categoryId)).map(ticket => mapRepoEntity(ticket));
};

export const getTicketsByCouponId = async (dbContext, couponId) => {
  validatePreconditions(['dbContext', 'couponId'], { dbContext, couponId });
  return (await ticketsRepo.getTicketsByCouponId(dbContext, couponId)).map(ticket => mapRepoEntity(ticket));
};

export const reserveTicket = (dbContext, { categoryId, customerId, quantity, couponId }) => {
  validatePreconditions(['dbContext', 'categoryId', 'customerId', 'quantity'], { dbContext, categoryId, customerId, quantity });
  const msg = { dbContext, categoryId, customerId, quantity, couponId };
  logger.info(msg, 'About to reserve ticket');
  await sendQueueMessage({
    type: QueueMessageTypes.RESERVE_TICKET,
    msg,
  });
};

const notifyReserveTicketError = async (error, msg, data) => {
  logger.info(data, error);
  
  return await notify({
    type: SocketTypes.RESERVE_TICKET_ERROR,
    msg,
  }):
};

export const reserveTicketHandler = msgData => {
  validatePreconditions(['dbContext', 'categoryId', 'customerId', 'quantity'], msgData);
  const { dbContext, categoryId, customerId, quantity, couponId } = msgData;
  const { available } = await getTicketCategoryById(dbContext, categoryId);
  
  if (quantity > available) {
    return await notifyReserveTicketError('Not enough tickets available', 'NOT_ENOUGH_TICKETS', msgData);
  }

  if (couponId) {
    const { externalCustomerId, state } = await getCouponById(dbContext, couponId);
    if (externalCustomerId && externalCustomerId !== customerId) {
      return await notifyReserveTicketError('Coupon belongs to somebody else', 'COUPON_ASSIGNED_TO_OTHER_CUSTOMER', msgData);
    }

    if (state !== DALTypes.CouponState.ACTIVE) {
      return await notifyReserveTicketError('Coupon is not active', 'COUPON_INACTIVE', msgData);
    }
  }

   await updateTicketCategory(dbContext, categoryId, category, userId);

};

export const createTicket = async (dbContext, category, userId) => {
  validatePreconditions(['dbContext', 'name', 'externalEventId', 'quantity', 'price', 'userId'], { dbContext, ...category, userId });

  const auditColumns = { updatedBy: userId, createdBy: userId };
  const { id: categoryId } = await ticketsRepo.createTicket(dbContext, mapParams({ ...category, ...auditColumns, available: category.quantity }));
  return await getTicketById(dbContext, categoryId);
};

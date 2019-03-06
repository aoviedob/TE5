import * as ticketRepo from '../dal/ticket-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { connectToQueue } from '../workers/queue';
import { queue } from '../config';
import bunyan from 'bunyan';
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

export const reserveTicket = () => {
  const { channel } = await connectToQueue();
  const { exchange, name } = queue;
  channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.publish(name, msg.type , new Buffer(JSON.stringify(msg)), { persistent: true });
};

export const createTicket = async (dbContext, category, userId) => {
  validatePreconditions(['dbContext', 'name', 'externalEventId', 'quantity', 'price', 'userId'], { dbContext, ...category, userId });

  const auditColumns = { updatedBy: userId, createdBy: userId };
  const { id: categoryId } = await ticketsRepo.createTicket(dbContext, mapParams({ ...category, ...auditColumns, available: category.quantity }));
  return await getTicketById(dbContext, categoryId);
};

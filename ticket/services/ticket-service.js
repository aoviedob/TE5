import * as ticketRepo from '../dal/ticket-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { sendQueueMessage } from '../helpers/queue';
import bunyan from 'bunyan';
import QueueMessageTypes from '../helpers/enums/queue-message-types';
import { notify } from '../socketIO';
import SocketTypes from '../helpers/enums/socket-types';
import { getTicketCategoryById, updateTicketCategory } from './ticket-category-service';
import { getCouponById, updateCoupon } from './coupon-service';
import DALTypes from '../helpers/enums/dal-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { createToken, decodeToken } from './crypto-service';
import TokenErrors from '../helpers/enums/token-errors';
import { initiatePayment } from './external-service';

const moment = extendMoment(Moment);
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

export const getTicketsByCustomerId = async (dbContext, customerId) => {
  validatePreconditions(['dbContext', 'customerId'], { dbContext, customerId });
  return (await ticketsRepo.getTicketsByCouponId(dbContext, customerId)).map(ticket => mapRepoEntity(ticket));
};

export const reserveTicket = async (dbContext, ticket, userId) => {
  const msg = { ...ticket, dbContext, userId };

  validatePreconditions(['dbContext', 'ticketCategoryId', 'externalCustomerId', 'quantity', 'userId'], msg);

  const category = await getTicketCategoryById(dbContext, ticketCategoryId);
  if (!category) {
    logger.error(msg, 'Category does not exist');
    const error = new Error('CATEGORY_DOES_NOT_EXIST');
    error.status = 412;
    throw error;
  }

  const coupon = await getCouponById(dbContext, couponId);
  if (!coupon) {
    logger.error(msg, 'Coupon does not exist');
    const error = new Error('COUPON_DOES_NOT_EXIST');
    error.status = 412;
    throw error;
  }

  
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
  });
};

export const createTicket = async (dbContext, { category, userId, trx }) => {
  validatePreconditions(['dbContext', 'name', 'externalEventId', 'quantity', 'price', 'userId'], { dbContext, ...category, userId });

  const auditColumns = { updatedBy: userId, createdBy: userId };
  const { id: categoryId } = await ticketsRepo.createTicket(dbContext, mapParams({ ...category, ...auditColumns, available: category.quantity }), trx);
  return await getTicketById(dbContext, categoryId);
};

const validateCoupon = async (dbContext, ticket) => {
  const { externalCustomerId: customerId, quantity, couponId } = ticket;
  
  const uiMessage = 'COUPON_NOT_AVAILABLE';
  const coupon = await getCouponById(dbContext, couponId);
  const { externalCustomerId, state, startDate, endDate, available } = coupon;
    
  if (externalCustomerId && externalCustomerId !== customerId) {
    await notifyReserveTicketError('Coupon belongs to somebody else', uiMessage, ticket);
    return false;
  }

  if (state !== DALTypes.CouponState.ACTIVE) {
    await notifyReserveTicketError('Coupon is not active', uiMessage, ticket);
    return false;
  }

  if (startDate || endDate) {
    const start = startDate || moment();
    const end = endDate || moment().add('years', 1);
    const range = moment.range(start, end);

    if (!range.contains(moment())) {
      await notifyReserveTicketError('Current date is not within the coupon date range', uiMessage, ticket);
      return false;
    }
  }

  if (available < quantity) {
    await notifyReserveTicketError('There are not enough coupons available', 'NOT_ENOUGH_COUPONS', ticket);
    return false;
  }

  return true;
};

export const reserveTicketHandler = async msgData => {
  validatePreconditions(['dbContext', 'ticketCategoryId', 'externalCustomerId', 'quantity', 'userId'], msgData);
  const { dbContext, ticketCategoryId,  quantity, couponId, userId } = msgData;
  const category = await getTicketCategoryById(dbContext, ticketCategoryId);

  const { available } = category;
  if (quantity > available) {
    return await notifyReserveTicketError('Not enough tickets available', 'NOT_ENOUGH_TICKETS', msgData);
  }

  if (couponId) {
    const isCouponValid = await validateCoupon(dbContext, msgData);
    if (!isCouponValid) return null;
  }

  const reserved = await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      await updateTicketCategory(dbContext, { categoryId: ticketCategoryId, category: { available: available - quantity }, userId, trx });

      if (couponId) {
        const { available: availableCoupons } = await getCouponById(dbContext, couponId);
        await updateCoupon(dbContext, { couponId, coupon: { available: availableCoupons - quantity }, userId, trx });
      }

    } catch (error) {
      logger.error(tokenBody, 'An error has occurred in reserve handler');
      reject(error);
    }

    resolve(true);
  }));

  const notification = reserved ? {
    type: SocketTypes.TICKET_RESERVED,
    msg: { token: createToken(msgData, { expiresIn: 300 }) },
  } : { 
    type: SocketTypes.TICKET_RESERVED_ERROR, 
    msg: msgData,
  };

  return await notify(notification);
};

export const releaseTicket = async req => {
  const decodedToken = decodeToken(req.token);
  const { error, body: tokenBody } = decodedToken;
  validatePreconditions(['dbContext', 'ticketCategoryId', 'externalCustomerId', 'quantity', 'userId'], tokenBody);

  if (error && error.name === TokenErrors.JSON_WEB_TOKEN_ERROR) {
    logger.error({ ...decodeToken }, 'Token is invalid');
    const error = new Error('INCONSISTENCY_DETECTED');
    error.status = 412;
    throw error;
  }

  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      const { dbContext, ticketCategoryId, quantity: ticketQuantity, couponId, userId } = tokenBody;
      const { available, quantity: categoryQuantity } = await getTicketCategoryById(dbContext, ticketCategoryId);
      
      if (available + ticketQuantity > categoryQuantity) {
        logger.error({ ...tokenBody, categoryQuantity, available }, 'The available tickets is higher than the original quantity');
        const error = new Error('INCONSISTENCY_DETECTED');
        error.status = 412;
        throw error;
      }

      await updateTicketCategory(dbContext, { categoryId: ticketCategoryId, category: { available: available + ticketQuantity }, userId, trx });

      if (couponId) {
        const { available: availableCoupons, quantity: couponQuantity } = await getCouponById(dbContext, couponId);

        if (availableCoupons + ticketQuantity > couponQuantity) {
          logger.error({ ...tokenBody, categoryQuantity, available }, 'The available coupons is higher than the original quantity');
          const error = new Error('INCONSISTENCY_DETECTED');
          error.status = 412;
          throw error;
        }

        await updateCoupon(dbContext, { couponId, coupon: { available: availableCoupons + ticketQuantity }, userId, trx });
      }

    } catch (error) {
      logger.error(tokenBody, 'An error has occurred while releasing ticket');
      reject(error);
    }

    resolve(true);
  }));
  
  return await notify({
    type: SocketTypes.TICKET_RELEASED,
    msg: tokenBody,
  });
};

const handleTokenError = async(req, { body, error }) => {
  if (!error) return;
  const logData = { ...req, ...body, error };
  if (error.name === TokenErrors.TOKEN_EXPIRED_ERROR) {
    logger.error(logData, 'Token has expired');
    return await releaseTicket(req);
  }

  logger.error(logData, 'Token is invalid');
  const err = new Error('INCONSISTENCY_DETECTED');
  err.status = 412;
  throw err;
}

export const confirmTicket = async (req) => {
  const decodedToken = decodeToken(req.token);
  await handleTokenError(req, decodedToken);

  const { body: msgData } = decodedToken;
  const msg = { ...msgData };
  validatePreconditions(['dbContext', 'ticketCategoryId', 'externalCustomerId', 'quantity', 'userId'], msg);
  
  logger.info(msg, 'About to confirm ticket');
  await sendQueueMessage({
    type: QueueMessageTypes.CONFIRM_TICKET,
    msg,
  });
};

export const confirmTicketHandler = async msgData => {
  validatePreconditions(['dbContext', 'ticketCategoryId', 'externalCustomerId', 'quantity', 'userId'], msgData);
  const { dbContext, ticketCategoryId,  quantity, couponId, userId } = msgData;
 
  const category = await getTicketCategoryById(dbContext, ticketCategoryId);
  const { price } = category;
  let finalPrice = price;
  let availableCoupons = null;

  if (couponId) {
    const { discount, isPercentage, available } = await getCouponById(dbContext, couponId);
    finalPrice = isPercentage ? price - (price * discount) : price - discount;
    availableCoupons = available; 
  }

  if (finalPrice < 0) {
    finalPrice = 0;
  }

  const results = await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      if (couponId && availableCoupons === 0) {
        await updateCoupon(dbContext, { couponId, coupon: { state: DALTypes.CouponState.INACTIVE }, userId, trx });
      }

      let tickets = [];
      for (let i = 0; i < quantity; i++) {
        tickets.push(await createTicket(dbContext, { category, userId, trx }));
      }
    } catch (error) {
      logger.error(tokenBody, 'An error has occurred while confirming ticket');
      reject(error);
    }

    resolve(tickets);
  }));

  const notifyType = results.length ? SocketTypes.TICKET_CONFIRMED : SocketTypes.TICKET_CONFIRMED_ERROR;

  return await notify({
    type: notifyType,
    msg: { msgData, tickets: results },
  });
};

export const cancelTicket = async(dbContext, ticketId, userId) => {
  validatePreconditions(['dbContext', 'ticketId', 'userId'], { userId, ticketId });

  const auditColumns = { updatedBy: userId, createdBy: userId };
  await ticketsRepo.cancelTicket(dbContext, mapParams({ ticketId, ...auditColumns }));
};
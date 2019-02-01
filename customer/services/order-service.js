import * as orderRepo from '../dal/order-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { getProduct } from './external-service';
import { maxAllowedProductQuantity } from '../config';
import UnitOfWork from '../database/unit_of_work.js';
import DalTypes from '../helpers/enums/dal-types';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'OrderService'});

export const getOrdersByCustomerId = async (dbContext, customerId) => { 
  validatePreconditions(['dbContext', 'customerId'], { dbContext, customerId });
  return (await orderRepo.getOrdersByCustomerId(dbContext, customerId)).map(order => mapRepoEntity(order));
};

export const getOrderById = async (dbContext, { orderId, trx }) => {
  validatePreconditions(['dbContext', 'orderId'], { dbContext, orderId });
  const tt = (await orderRepo.getOrderById(dbContext, { orderId, trx }));
  console.log('tt', tt);
  const t = mapRepoEntity(tt);
  console.log('tttt', t);
  return t;
};

const validateProductQuantity = (req, orderLine) => {
  const { quantity } = orderLine;
  if (quantity > maxAllowedProductQuantity) {
    logger.error({ ...req.tokenBody, ...orderLine }, 'Quantity exceeds the max');
    const error = new Error('QUANTITY_EXCEEDS_THE_MAX');
    error.status = 412;
    throw error;
  }
};

const updateOrderAmount = async(req, { dbContext, orderId, trx }) => {
  const { orderLines } = await getOrderById(dbContext, { orderId, trx });
    console.log('entra', orderLines);
  if (!orderLines.length) return;
  
  const products = await Promise.all(orderLines.map(async ({ externalProductId }) => await getProduct(req, externalProductId)));
  console.log('productsHOla', products);
  if (!products || !products.length) {
    logger.error({ ...req.tokenBody, orderId }, 'Empty product list');
    const error = new Error('EMPTY_PRODUCT_LIST');
    error.status = 500;
    throw error;
  }

  const total_amount = products.reduce((acc, product) => {
    const { quantity } = orderLines.find(ol => ol.external_product_id === product.id);
    acc = acc + (product.price * quantity);
    return acc;
  }, 0);

  await orderRepo.updateOrder(dbContext, { orderId, order: { total_amount }, trx });
};

export const updateOrderLine = async (req, { dbContext, orderLine, trx }) => { 
  validatePreconditions(['dbContext', 'orderId', 'externalProductId'], { dbContext, ...orderLine });
  validateProductQuantity(req, orderLine);
 
  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    const { orderId, externalProductId } = orderLine;
    await orderRepo.updateOrderLine(dbContext, { orderId, externalProductId, orderLine: mapParams(orderLine), trx });
    await updateOrderAmount(req, { dbContext, orderId, trx });
  }));
};

export const createOrderLine = async (req, dbContext, orderLine) => {
  validatePreconditions(['dbContext', 'orderId', 'externalProductName', 'externalProductId', 'quantity'], { dbContext, ...orderLine });
  validateProductQuantity(req, orderLine);
  
  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    const dbOrderLine = await orderRepo.createOrderLine(dbContext, { orderLine: mapParams(orderLine), trx });
    await updateOrderAmount(req, { dbContext, orderId: orderLine.orderId, trx });
    resolve(mapRepoEntity(dbOrderLine));
  }));
};

export const deleteOrderLine = async (dbContext, orderId, externalProductId) => {
  validatePreconditions(['dbContext', 'orderId', 'externalProductId'], { dbContext, orderId, externalProductId });
  
  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    await orderRepo.deleteOrderLine(dbContext, { orderId, externalProductId, trx });
    await updateOrderAmount(req, { dbContext, orderId, trx });
  }));
};

export const updateOrder = async (dbContext, orderId, order) => { 
  validatePreconditions(['dbContext', 'orderId', 'order'], { dbContext, orderId, order });

  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    await orderRepo.updateOrder(dbContext, { orderId, order: mapParams(order), trx });
    
    const { orderLines = [] } = order;
    if (orderLines.length){
      await Promise.all(orderLines.map(async orderLine => await orderRepo.upsertOrderLine(req, { dbContext, orderLine: mapParams(orderLine), trx })));
    }

    await updateOrderAmount({}, { dbContext, orderId, trx });
  }));
};
 
export const createOrder = async (dbContext, order) => {
  validatePreconditions(['dbContext', 'customerId'], { dbContext, ...order });

  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    const mappedOrder = mapParams(order);
    const { id: orderId } = await orderRepo.createOrder(dbContext, { order: { total_amount: 0, status: DalTypes.OrderStatus.PENDING, ...mappedOrder }, trx });
    
    const { orderLines = [] } = order;
    if (orderLines.length) {
      await Promise.all(orderLines.map(async orderLine => await orderRepo.createOrderLine(dbContext, { orderLine: { ...mapParams(orderLine), order_id: orderId }, trx })));
    }
    await updateOrderAmount({}, { dbContext, orderId, trx });
    const dbOrder = await getOrderById(dbContext, { orderId, trx });
    resolve(dbOrder);
  }));
};

export const deleteOrder = async (dbContext, orderId) => {
  validatePreconditions(['dbContext', 'orderId'], { dbContext, orderId });

  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    const { orderLines } = await getOrderById(dbContext, { orderId, trx });
    await orderRepo.deleteOrder(dbContext, { orderId, trx });

    if (orderLines.length) {
      await Promise.all(orderLines.map(async ({ externalProductId }) => await orderRepo.deleteOrderLine(dbContext, { orderId, externalProductId, trx })));
    }
  }));
};

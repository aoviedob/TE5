import * as orderRepo from '../dal/order-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { getProduct, initiatePayment } from './external-service';
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
  return mapRepoEntity((await orderRepo.getOrderById(dbContext, { orderId, trx })));
};

export const getOrderByStatus = async (dbContext, { status, customerId }) => {
  validatePreconditions(['dbContext', 'status'], { dbContext, status, customerId });
  return mapRepoEntity((await orderRepo.getOrderByStatus(dbContext, { status, customerId })));
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
  const { orderLines = [] } = await getOrderById(dbContext, { orderId, trx });
  if (!orderLines.length) return;

  const products = await Promise.all(orderLines.map(async ({ externalProductCategoryId }) => await getProduct(req, externalProductCategoryId)));
  if (!products || !products.length) {
    logger.error({ ...req.tokenBody, orderId }, 'Empty product list');
    const error = new Error('EMPTY_PRODUCT_LIST');
    error.status = 500;
    throw error;
  }

  const total_amount = products.reduce((acc, product) => {
    const { id, quantity } = orderLines.find(ol => ol.externalProductCategoryId === product.id);
    if (quantity > product.available) {
      logger.error({ id, quantity, orderId, available: product.available }, 'Not enough products');
      const error = new Error('NOT_ENOUGH_PRODUCTS');
      error.status = 500;
      throw error;
    }
    acc = acc + (product.price * quantity);
    return acc;
  }, 0);
  console.log('total_amount', total_amount);

  await orderRepo.updateOrder(dbContext, { orderId, order: { total_amount }, trx });
};

export const updateOrderLine = async (req, { dbContext, orderLine, trx }) => { 
  validatePreconditions(['dbContext', 'orderId', 'externalProductId'], { dbContext, ...orderLine });
  validateProductQuantity(req, orderLine);
 
  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      const { orderId, externalProductId } = orderLine;
      await orderRepo.updateOrderLine(dbContext, { orderId, externalProductId, orderLine: mapParams(orderLine), trx });
      await updateOrderAmount(req, { dbContext, orderId, trx });
    } catch (error) {
      reject(error);
    }

    resolve(true);
  }));
};

export const createOrderLine = async (req, { dbContext, orderLine }) => {
  validatePreconditions(['dbContext', 'orderId', 'externalProductName', 'externalProductId', 'quantity', 'externalProductCategoryId'], { dbContext, ...orderLine });
  validateProductQuantity(req, orderLine);
  
  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {  
      const dbOrderLine = await orderRepo.createOrderLine(dbContext, { orderLine: mapParams(orderLine), trx });
      await updateOrderAmount(req, { dbContext, orderId: orderLine.orderId, trx });
      resolve(mapRepoEntity(dbOrderLine));
    } catch (error) {
      reject(error);
    }
  }));
};

export const deleteOrderLine = async (req, { dbContext, orderId, externalProductId }) => {
  validatePreconditions(['dbContext', 'orderId', 'externalProductId'], { dbContext, orderId, externalProductId });
  
  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      await orderRepo.deleteOrderLine(dbContext, { orderId, externalProductId, trx });
      await updateOrderAmount(req, { dbContext, orderId, trx });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};

export const updateOrder = async (req, { dbContext, orderId, order }) => { 
  validatePreconditions(['dbContext', 'orderId', 'order'], { dbContext, orderId, order });

  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {  
      await orderRepo.updateOrder(dbContext, { orderId, order: mapParams(order), trx });
    
      const { orderLines = [] } = order;
      if (orderLines.length){
        await Promise.all(orderLines.map(async orderLine => await orderRepo.upsertOrderLine(dbContext, { orderId, externalProductId: orderLine.externalProductId, orderLine: mapParams({ ...orderLine, orderId }), trx })));
      }

      await updateOrderAmount(req, { dbContext, orderId, trx });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};
 
export const createOrder = async (req, { dbContext, order }) => {
  validatePreconditions(['dbContext', 'customerId'], { dbContext, ...order });

  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      const mappedOrder = mapParams(order);
      const { id: orderId } = await orderRepo.createOrder(dbContext, { order: { total_amount: 0, status: DalTypes.OrderStatus.PENDING, ...mappedOrder }, trx });
    
      const { orderLines = [] } = order;
      if (orderLines.length) {
        await Promise.all(orderLines.map(async orderLine => await orderRepo.createOrderLine(dbContext, { orderLine: { ...mapParams(orderLine), order_id: orderId }, trx })));
      }
      await updateOrderAmount(req, { dbContext, orderId, trx });
      const dbOrder = await getOrderById(dbContext, { orderId, trx });
      resolve(dbOrder);
    } catch (error) {
      reject(error);
    }
  }));
};

export const deleteOrder = async (dbContext, orderId) => {
  validatePreconditions(['dbContext', 'orderId'], { dbContext, orderId });

  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      const { orderLines } = await getOrderById(dbContext, { orderId, trx });

      if (orderLines.length) {
        await Promise.all(orderLines.map(async ({ externalProductId }) => await orderRepo.deleteOrderLine(dbContext, { orderId, externalProductId, trx })));
      }

      await orderRepo.deleteOrder(dbContext, { orderId, trx });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};

export const placeOrder = async (req, { dbContext, order }) => {
  validatePreconditions(['dbContext', 'id'], { dbContext, ...order });
  return await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      const { customerId, totalAmount } = await getOrderById(dbContext, { orderId: order.id, trx });
      const formUrl = await initiatePayment({ customerId, amount: totalAmount });
     
      resolve({ formUrl });
    } catch (error) {
      reject(error);
    }
  }));
};

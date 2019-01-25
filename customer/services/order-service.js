import * as orderRepo from '../dal/order-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';

export const getOrdersByCustomerId = async (dbContext, customerId) => { 
  validatePreconditions(['dbContext', 'customerId'], { dbContext, customerId });
  return (await orderRepo.getOrdersByCustomerId(dbContext, customerId)).map(order => mapRepoEntity(order));
};

export const getOrderById = async (dbContext, orderId) => {
  validatePreconditions(['dbContext', 'orderId'], { dbContext, orderId });
  return mapRepoEntity((await orderRepo.getOrderById(dbContext, orderId)));
};

export const updateOrder = async (dbContext, orderId, order) => { 
  validatePreconditions(['dbContext', 'orderId', 'order'], { dbContext, orderId, order });
  const t = await orderRepo.updateOrder(dbContext, orderId, mapParams(order));
};

export const createOrder = async (dbContext, customer) => {
  validatePreconditions(['dbContext', 'email', 'fullname', 'password'], { dbContext, ...customer });
  const externalUserId = await createOrder(customer);
  const { id: customerId } = await orderRepo.createCustomer(dbContext, mapParams({ ...customer, externalUserId }));
  return await getCustomerById(dbContext, customerId);
};

export const deleteOrder = async (dbContext, orderId) => {
  validatePreconditions(['dbContext', 'orderId'], { dbContext, orderId });
  await orderRepo.deleteOrder(dbContext, orderId);
};

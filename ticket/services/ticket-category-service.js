import * as ticketCategoryRepo from '../dal/ticket-category-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { getTicketsByCategoryId } from './ticket-service';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'TicketCategoryService'});

export const getTicketCategories = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await ticketCategoryRepo.getTicketCategories(dbContext)).map(ticketCategory => mapRepoEntity(ticketCategory));
};

export const getTicketCategoryById = async (dbContext, ticketCategoryId) => {
  validatePreconditions(['dbContext', 'ticketCategoryId'], { dbContext, ticketCategoryId });
  return mapRepoEntity((await ticketCategoryRepo.getTicketCategoryById(dbContext, ticketCategoryId)));
};

export const getTicketCategoriesByEventId = async (dbContext, eventId) => {
  validatePreconditions(['dbContext', 'eventId'], { dbContext, eventId });
  return (await ticketCategoryRepo.getTicketCategoriesByEventId(dbContext, eventId)).map(ticketCategory => mapRepoEntity(ticketCategory));
};

export const getTicketCategoriesByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, customerId });
  return (await ticketCategoryRepo.getTicketCategoriesByName(dbContext, name)).map(ticketCategory => mapRepoEntity(ticketCategory));
};

export const getTicketCategoriesByOrganizerId = async (dbContext, organizerId) => {
  validatePreconditions(['dbContext', 'organizerId'], { dbContext, organizerId });
  return (await ticketCategoryRepo.getTicketCategoriesByOrganizerId(dbContext, organizerId)).map(ticketCategory => mapRepoEntity(ticketCategory));
};

const isTicketCategoryInUse = async (dbContext, categoryId) => !!(await getTicketsByCategoryId(dbContext, categoryId).length);

const canUpdateTicketCategory = async (dbContext, categoryId, category = {}) => {
  if(!(await isTicketCategoryInUse(dbContext, categoryId))) return true;

  const { quantity, price, externalEventId } = category;
  if (price || price === 0 || quantity === 0 || externalEventId) return false;
};

export const updateTicketCategory = async (dbContext, { categoryId, category, userId, trx }) => { 
  validatePreconditions(['dbContext', 'categoryId', 'category', 'userId'], { dbContext, categoryId, category, userId });
  
  if (!(await canUpdateTicketCategory(dbContext, categoryId, category))) {
    const message = 'CATEGORY_IS_ALREADY_IN_USE';
    logger.error({ categoryId, category }, message);
    const error = new Error(message);
    error.status = 412;
    throw error;
  }

  return await ticketCategoryRepo.updateTicketCategory(dbContext, categoryId, mapParams({ ...category, updatedBy: userId }), trx);
};

export const createTicketCategory = async (dbContext, category, userId) => {
  validatePreconditions(['dbContext', 'name', 'externalEventId', 'quantity', 'price', 'userId'], { dbContext, ...category, userId });

  const auditColumns = { updatedBy: userId, createdBy: userId };
  const { id: categoryId } = await ticketCategoryRepo.createTicketCategory(dbContext, mapParams({ ...category, ...auditColumns, available: category.quantity }));
  return await getTicketCategoryById(dbContext, categoryId);
};

export const deleteTicketCategory = async (dbContext, categoryId) => {
  if((await isTicketCategoryInUse(dbContext, categoryId))) {
    const message = 'CATEGORY_IS_ALREADY_IN_USE';
    logger.error({ categoryId }, message);
    const error = new Error(message);
    error.status = 412;
    throw error;
  }

  validatePreconditions(['dbContext', 'categoryId'], { dbContext, categoryId });
  await ticketCategoryRepo.deleteTicketCategory(dbContext, categoryId);
};

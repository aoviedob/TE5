import * as eventCategoryRepo from '../dal/event-category-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import UnitOfWork from '../database/unit_of_work.js';

export const getEventCategories = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await eventCategoryRepo.getEventCategories(dbContext)).map(category => mapRepoEntity(category));
};

export const getEventCategoryById = async (dbContext, categoryId) => {
  validatePreconditions(['dbContext', 'categoryId'], { dbContext, categoryId });
  return mapRepoEntity((await eventCategoryRepo.getEventCategoryById(dbContext, categoryId)));
};

export const getEventCategoriesByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return (await eventCategoryRepo.getEventCategoriesByName(dbContext, name)).map(category => mapRepoEntity(category));
};

export const updateEventCategory = async (dbContext, categoryId, category, userId) => { 
  validatePreconditions(['dbContext', 'categoryId', 'category', 'userId'], { dbContext, categoryId, category, userId });
  const auditColumns = { updatedBy: userId };
  return await eventCategoryRepo.updateEventCategory(dbContext, categoryId, mapParams({ ...category, ...auditColumns}));
};

export const createEventCategory = async (dbContext, category, userId) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, ...category });
  const auditColumns = { updatedBy: userId, createdBy: userId };
  const { id: categoryId } = await eventCategoryRepo.createEventCategory(dbContext, mapParams({ ...category, ...auditColumns }));
  return await getEventCategoryById(dbContext, categoryId);
};

export const deleteEventCategory = async (dbContext, categoryId) => {
  validatePreconditions(['dbContext', 'categoryId'], { dbContext, categoryId });
  await eventCategoryRepo.deleteEventCategory(dbContext, categoryId);
};


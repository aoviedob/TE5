import * as eventRepo from '../dal/event-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import UnitOfWork from '../database/unit_of_work.js';

export const getEvents = async (dbContext, limit) => { 
  validatePreconditions(['dbContext'], { dbContext });
  const limitResults = limit ? parseInt(limit) : '';
  return (await eventRepo.getEvents(dbContext, limitResults)).map(event => mapRepoEntity(event));
};

export const getEventsByIds = async (dbContext, eventIds) => { 
  validatePreconditions(['dbContext', 'eventIds'], { dbContext, eventIds });
  return (await eventRepo.getEventsByIds(dbContext, eventIds)).map(event => mapRepoEntity(event));
};

export const getEventById = async (dbContext, eventId) => {
  validatePreconditions(['dbContext', 'eventId'], { dbContext, eventId });
  return mapRepoEntity((await eventRepo.getEventById(dbContext, eventId)));
};

export const getEventsByCategoryId = async (dbContext, categoryId, limit) => {
  validatePreconditions(['dbContext', 'categoryId'], { dbContext, categoryId });
  const limitResults = limit ? parseInt(limit) : '';
  return (await eventRepo.getEventsByCategoryId(dbContext, categoryId, limitResults)).map(event => mapRepoEntity(event));
};

export const getEventsByOrganizerId = async (dbContext, organizerId, limit) => {
  validatePreconditions(['dbContext', 'organizerId'], { dbContext, organizerId });
  const limitResults = limit ? parseInt(limit) : '';
  return (await eventRepo.getEventsByOrganizerId(dbContext, organizerId, limitResults)).map(event => mapRepoEntity(event));
};

export const getEventsByName = async (dbContext, { name, categoryId, organizerId, limit }) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return (await eventRepo.getEventsByName(dbContext, { name, categoryId, organizerId, limit: (limit ? parseInt(limit) : null) })).map(event => mapRepoEntity(event));
};

export const updateEvent = async (dbContext, eventId, event, userId) => { 
  validatePreconditions(['dbContext', 'eventId', 'event', 'userId'], { dbContext, eventId, event, userId });

  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {

      const auditColumns = { updatedBy: userId };
      await eventRepo.updateEvent(dbContext,{ eventId, event: mapParams({ ...event, ...auditColumns }), trx });
      const { salesTarget } = event;
      if (salesTarget) {
        await eventRepo.upsertSalesTarget(dbContext, { salesTarget: mapParams({ ...salesTarget, eventId, ...auditColumns }), trx });
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};

export const createEvent = async (dbContext, event, userId) => {
  validatePreconditions(['dbContext', 'eventCategoryId', 'eventOrganizerId', 'name', 'tags', 'coverImageUrl', 'startDate', 'endDate', 'status', 'country', 'addressLine1', 'addressLine2', 'latitude', 'longitude', 'userId' ], { dbContext, ...event, userId });
 
  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {

      const auditColumns = { updatedBy: userId, createdBy: userId };
      const { id: eventId } = await eventRepo.createEvent(dbContext, { event: mapParams({ ...event, ...auditColumns }), trx });
      const { salesTarget } = event;
      if (salesTarget) {
        await eventRepo.upsertSalesTarget(dbContext, { salesTarget: mapParams({ ...salesTarget, eventId, ...auditColumns }), trx });
      }
      resolve(await getEventById(dbContext, eventId));
    } catch (error) {
      reject(error);
    }
  }));
};

export const deleteEvent = async (dbContext, eventId) => {
  validatePreconditions(['dbContext', 'eventId'], { dbContext, eventId });
  
  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      await eventRepo.deleteEvent(dbContext, { eventId, trx });
      
      await eventRepo.deleteSalesTargetByEventId(dbContext, { eventId, trx })<
      
      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};

export const getSalesTargetByEventId = async (dbContext, eventId) => {
  validatePreconditions(['dbContext', 'eventId'], { dbContext, eventId });
  return mapRepoEntity((await eventRepo.getSalesTargetByEventId(dbContext, eventId)));
};

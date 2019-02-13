import * as eventOrganizerRepo from '../dal/event-organizer-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import UnitOfWork from '../database/unit_of_work.js';

export const getEventOrganizers = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await eventOrganizerRepo.getEventOrganizers(dbContext)).map(organizer => mapRepoEntity(organizer));
};

export const getEventOrganizerById = async (dbContext, organizerId) => {
  validatePreconditions(['dbContext', 'organizerId'], { dbContext, organizerId });
  return mapRepoEntity((await eventOrganizerRepo.getEventOrganizerById(dbContext, organizerId)));
};

export const getEventOrganizersByIdentification = async (dbContext, identification) => {
  validatePreconditions(['dbContext', 'identification'], { dbContext, identification });
  return (await eventOrganizerRepo.getEventOrganizersByIdentification(dbContext, identification)).map(organizer => mapRepoEntity(organizer));
};

export const getEventOrganizersByName = async (dbContext, name) => {
  validatePreconditions(['dbContext', 'name'], { dbContext, name });
  return (await eventOrganizerRepo.getEventOrganizersByName(dbContext, name)).map(organizer => mapRepoEntity(organizer));
};

export const updateEventOrganizer = async (dbContext, eventId, event, userId) => { 
  validatePreconditions(['dbContext', 'eventId', 'event', 'userId'], { dbContext, eventId, event, userId });

  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {

      const auditColumns = { updatedBy: userId };
      await eventOrganizerRepo.updateEventOrganizer(dbContext,{ eventId, event: mapParams({ ...event, ...auditColumns }), trx });
      const { salesTarget } = event;
      if (salesTarget) {
        await eventOrganizerRepo.upsertSalesTarget(dbContext, { salesTarget: mapParams({ ...salesTarget, eventId }), trx });
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

      const { id: eventId } = await eventOrganizerRepo.createEvent(dbContext, { event: mapParams({ ...event, updatedBy: userId, createdBy: userId }), trx });
      const { salesTarget } = event;
      if (salesTarget) {
        await eventOrganizerRepo.upsertSalesTarget(dbContext, { salesTarget: mapParams({ ...salesTarget, eventId }), trx });
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
      await eventOrganizerRepo.deleteEvent(dbContext, { eventId, trx });
      
      await eventOrganizerRepo.deleteSalesTargetByEventId(dbContext, { eventId, trx })<
      
      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};

export const getSalesTargetByEventId = async (dbContext, eventId) => {
  validatePreconditions(['dbContext', 'eventId'], { dbContext, eventId });
  return mapRepoEntity((await eventOrganizerRepo.getSalesTargetByEventId(dbContext, eventId)));
};

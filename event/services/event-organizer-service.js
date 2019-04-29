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

export const updateEventOrganizer = async (dbContext, organizerId, organizer, userId) => { 
  validatePreconditions(['dbContext', 'organizerId', 'organizer', 'userId'], { dbContext, organizerId, organizer, userId });

  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {

      const auditColumns = { updatedBy: userId };
      await eventOrganizerRepo.updateEventOrganizer(dbContext, { organizerId, organizer: mapParams({ ...organizer, ...auditColumns }), trx });
      const { usersByOrganizer = [] } = organizer;
      if (usersByOrganizer.length) {
        await Promise.all(usersByOrganizer.map(async user => await eventOrganizerRepo.upsertUsersByOrganizer(dbContext, { usersByOrganizer: mapParams({ ...user, organizerId, ...auditColumns }), trx })));
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};

export const createEventOrganizer = async (dbContext, organizer, userId) => {
  validatePreconditions(['dbContext', 'name', 'identification', 'type', 'email', 'phone', 'userId' ], { dbContext, ...organizer, userId });
 
  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {

      const auditColumns = { updatedBy: userId, createdBy: userId };
      const { id: organizerId } = await eventOrganizerRepo.createEventOrganizer(dbContext, { organizer: mapParams({ ...organizer, ...auditColumns }), trx });
      const { usersByOrganizer = [] } = organizer;
      if (usersByOrganizer.length) {
        await Promise.all(usersByOrganizer.map(async user => await eventOrganizerRepo.upsertUsersByOrganizer(dbContext, { usersByOrganizer: mapParams({ ...user, organizerId, ...auditColumns }), trx })));
      }
      resolve(await getEventOrganizerById(dbContext, organizerId));
    } catch (error) {
      reject(error);
    }
  }));
};

export const deleteEventOrganizer = async (dbContext, organizerId) => {
  validatePreconditions(['dbContext', 'organizerId'], { dbContext, organizerId });
  
  await ((new UnitOfWork(dbContext)).transact(async (trx, resolve, reject) => {
    try {
      await eventOrganizerRepo.deleteEventOrganizer(dbContext, { organizerId, trx });
      
      await eventOrganizerRepo.deleteUsersByOrganizerByOrganizerId(dbContext, { organizerId, trx })<
      
      resolve(true);
    } catch (error) {
      reject(error);
    }
  }));
};

export const getUsersByOrganizerId = async (dbContext, organizerId) => {
  validatePreconditions(['dbContext', 'organizerId'], { dbContext, organizerId });
  return mapRepoEntity((await eventOrganizerRepo.getUsersByOrganizerId(dbContext, organizerId)));
};

export const getOrganizersByUserId = async (dbContext, userId) => {
  validatePreconditions(['dbContext', 'userId'], { dbContext, userId });
  return (await eventOrganizerRepo.getOrganizersByUserId(dbContext, userId)).map(organizer => mapRepoEntity(organizer));
};


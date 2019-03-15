import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const EVENT_ORGANIZER_TABLE = 'event_organizer';
export const USERS_BY_ORGANIZER_TABLE = 'users_by_organizer';

const EVENT_ORGANIZER_TABLE_COLUMNS = [
  'id',
  'name',
  'identification',
  'type',
  'email',
  'phone',
  'image_url',
  'web_url',
  'country',
  'addressLine1',
  'addressLine2',
  'metadata',
  'settings',
  'updated_by',
  'created_by',
  'created_at',
  'updated_at'
];

const USERS_BY_ORGANIZER_TABLE_COLUMNS = [
  'id',
  'external_user_id',
  'event_organizer_id',
  'updated_by',
  'created_by',
  'created_at',
  'updated_at'
];

export const getEventOrganizerById = async (dbContext, organizerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: EVENT_ORGANIZER_TABLE, 
    columns: EVENT_ORGANIZER_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('id = :organizerId', { organizerId })
  });
};

export const getEventOrganizers = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
    tableName: EVENT_ORGANIZER_TABLE, 
    columns: EVENT_ORGANIZER_TABLE_COLUMNS 
  }));


export const getEventOrganizersByIdentification = async (dbContext, identification) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: EVENT_ORGANIZER_TABLE, 
    columns: EVENT_ORGANIZER_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('identification LIKE :identification', { identification: `%${identification}%` })
  });
};

export const getEventOrganizersByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: EVENT_ORGANIZER_TABLE, 
    columns: EVENT_ORGANIZER_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('name LIKE :name', { name: `%${name}%` })
  });
};


export const updateEventOrganizer = async (dbContext, { organizerId, organizer, trx }) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
    tableName: EVENT_ORGANIZER_TABLE, 
    columns: EVENT_ORGANIZER_TABLE_COLUMNS,
    entity: organizer,
    where: unitOfWork.dbConnection.raw('id = :organizerId', { organizerId }),
    trx
  });
};

export const deleteEventOrganizer = async (dbContext, { organizerId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: EVENT_ORGANIZER_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :organizerId', { organizerId }),
    trx
  });
};

export const createEventOrganizer = async (dbContext, { organizer, trx }) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: EVENT_ORGANIZER_TABLE, 
    columns: EVENT_ORGANIZER_TABLE_COLUMNS,
    entity: organizer,
    trx
  }));
  
  return (result.length && result[0]) || {};
};

export const upsertUsersByOrganizer = async (dbContext, { usersByOrganizer, trx }) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.create(schema, { 
    tableName: USERS_BY_ORGANIZER_TABLE, 
    columns: USERS_BY_ORGANIZER_TABLE_COLUMNS,
    entity: usersByOrganizer,
    onConflict: unitOfWork.dbConnection.raw(`ON CONFLICT (event_organizer_id, external_user_id) DO UPDATE SET ${unitOfWork.formatSetValues(USERS_BY_ORGANIZER_TABLE_COLUMNS, usersByOrganizer)}`),
    trx,
  });
};

export const deleteUsersByOrganizerByOrganizerId = async (dbContext, { organizerId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
    tableName: USERS_BY_ORGANIZER_TABLE, 
    where: unitOfWork.dbConnection.raw('event_organizer_id = :organizerId', { organizerId }),
    trx
  });
};

export const getUsersByOrganizerId = async (dbContext, organizerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: USERS_BY_ORGANIZER_TABLE, 
    columns: USERS_BY_ORGANIZER_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('event_organizer_id = :organizerId', { organizerId })
  });
};


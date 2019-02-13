import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const EVENT_TABLE = 'event';
export const SALES_TARGET_TABLE = 'sales_target';
const EVENT_TABLE_COLUMNS = [
  'id',
  'event_category_id',
  'event_organizer_id',
  'name',
  'tags',
  'web_url',
  'cover_image_url',
  'metadata',
  'settings',
  'start_date',
  'end_date',
  'status',
  'country',
  'addressLine1',
  'addressLine2',
  'latitude',
  'longitude',
  'updated_by',
  'created_by',
  'created_at',
  'updated_at'
];

const SALES_TARGET_TABLE_COLUMNS = [
  'id',
  'event_id',
  'tickets_target',
  'earnings_target',
  'updated_by',
  'created_by',
  'created_at',
  'updated_at'
];

export const getEvents = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: EVENT_TABLE, 
  	columns: EVENT_TABLE_COLUMNS 
  }));

export const getEventById = async (dbContext, eventId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: EVENT_TABLE, 
  	columns: EVENT_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :eventId', { eventId })
  });
};

export const getEventsByCategoryId = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: EVENT_TABLE_i 
  	columns: EVENT_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('event_category_id = :categoryId', { categoryId })
  });
};

export const getEventsByOrganizerId = async (dbContext, organizerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: EVENT_TABLE_i 
    columns: EVENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('event_organizer_id = :organizerId', { organizerId })
  });
};

export const getEventsByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: EVENT_TABLE, 
    columns: EVENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('name LIKE :name', { name: `%${name}%` })
  });
};

export const updateEvent = async (dbContext, { eventId, event, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: EVENT_TABLE, 
  	columns: EVENT_TABLE_COLUMNS,
  	entity: event,
  	where: unitOfWork.dbConnection.raw('id = :eventId', { eventId }),
    trx
  });
};

export const deleteEvent = async (dbContext, { eventId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: EVENT_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :eventId', { eventId }),
    trx
  });
};

export const createEvent = async (dbContext, { event, trx }) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: EVENT_TABLE, 
    columns: EVENT_TABLE_COLUMNS,
    entity: event,
    trx
  }));
  
  return (result.length && result[0]) || {};
};

export const upsertSalesTarget = async (dbContext, { salesTarget, trx }) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.create(schema, { 
    tableName: SALES_TARGET_TABLE, 
    columns: SALES_TARGET_TABLE_COLUMNS,
    entity: salesTarget,
    onConflict: unitOfWork.dbConnection.raw(`ON CONFLICT (event_id) DO UPDATE SET ${unitOfWork.formatSetValues(SALES_TARGET_TABLE_COLUMNS, salesTarget)}`),
    trx,
  });
};

export const deleteSalesTargetByEventId = async (dbContext, { eventId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
    tableName: SALES_TARGET_TABLE, 
    where: unitOfWork.dbConnection.raw('event_id = :eventId', { eventId }),
    trx,
  });
};

export const getSalesTargetByEventId = async (dbContext, eventId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: SALES_TARGET_TABLE, 
    columns: SALES_TARGET_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('event_id = :eventId', { eventId })
  });
};


import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const COUPON_TABLE = 'coupon';
const COUPON_TABLE_COLUMNS = [
  'id',
  'code',
  'name',
  'quantity',
  'available',
  'discount',
  'is_percentage',
  'state',
  'start_date',
  'end_date',
  'external_customer_id',
  'external_organizer_id',
  'external_event_id',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at'
];

export const getCoupons = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS 
  }));

export const getTicketCategoryById = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId })
  });
};

export const getTicketCategoriesByEventId = async (dbContext, eventId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('event_id LIKE :eventId', { eventId })
  });
};

export const getTicketCategoriesByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('name LIKE :name', { name: `%${name}%` })
  });
};

export const getTicketCategoriesByOrganizerId = async (dbContext, organizerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('organizer_id = :organizerId', { organizerId })
  });
};

export const updateTicketCategory = async (dbContext, categoryId, category) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    entity: category,
    where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId })
  });
};

export const deleteTicketCategory = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
    tableName: COUPON_TABLE, 
    where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId })
  });
};

export const createTicketCategory = async (dbContext, category) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    entity: category,
  }));
  
  return (result.length && result[0]) || {};
};

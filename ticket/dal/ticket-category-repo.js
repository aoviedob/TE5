import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const TICKET_CATEGORY_TABLE = 'ticket_category';
const TICKET_CATEGORY_TABLE_COLUMNS = [
  'id',
  'name',
  'external_event_id',
  'external_organizer_id',
  'quantity',
  'available',
  'price',
  'settings',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at',
];

export const getTicketCategories = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: TICKET_CATEGORY_TABLE, 
  	columns: TICKET_CATEGORY_TABLE_COLUMNS 
  }));

export const getTicketCategoryById = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: TICKET_CATEGORY_TABLE, 
  	columns: TICKET_CATEGORY_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId })
  });
};

export const getTicketCategoriesByEventId = async (dbContext, eventId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: TICKET_CATEGORY_TABLE, 
  	columns: TICKET_CATEGORY_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('external_event_id = :eventId', { eventId })
  });
};

export const getTicketCategoriesByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: TICKET_CATEGORY_TABLE, 
    columns: TICKET_CATEGORY_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('name LIKE :name', { name: `%${name}%` })
  });
};

export const getTicketCategoriesByOrganizerId = async (dbContext, organizerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: TICKET_CATEGORY_TABLE, 
    columns: TICKET_CATEGORY_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('external_organizer_id = :organizerId', { organizerId })
  });
};

export const updateTicketCategory = async (dbContext, categoryId, category, trx) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: TICKET_CATEGORY_TABLE, 
  	columns: TICKET_CATEGORY_TABLE_COLUMNS,
  	entity: category,
  	where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId }),
    trx,
  });
};

export const deleteTicketCategory = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: TICKET_CATEGORY_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId })
  });
};

export const createTicketCategory = async (dbContext, category) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: TICKET_CATEGORY_TABLE, 
    columns: TICKET_CATEGORY_TABLE_COLUMNS,
    entity: category,
  }));
  
  return (result.length && result[0]) || {};
};

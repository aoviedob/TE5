import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const EVENT_CATEGORY_TABLE = 'event_category';

const EVENT_CATEGORY_TABLE_COLUMNS = [
  'id',
  'name',
  'metadata',
  'settings',
  'updated_by',
  'created_by',
  'created_at',
  'updated_at',
];

export const getEventCategories = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
    tableName: EVENT_CATEGORY_TABLE, 
    columns: EVENT_CATEGORY_TABLE_COLUMNS 
  }));

export const getEventCategoryById = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: EVENT_CATEGORY_TABLE, 
    columns: EVENT_CATEGORY_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId })
  });
};

export const getEventCategoriesByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: EVENT_CATEGORY_TABLE, 
    columns: EVENT_CATEGORY_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('name LIKE :name', { name: `%${name}%` })
  });
};
export const updateEventCategory = async (dbContext, categoryId, category) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
    tableName: EVENT_CATEGORY_TABLE, 
    columns: EVENT_CATEGORY_TABLE_COLUMNS,
    entity: category,
    where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId })
  });
};

export const deleteEventCategory = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
    tableName: EVENT_CATEGORY_TABLE, 
    where: unitOfWork.dbConnection.raw('id = :categoryId', { categoryId }),
    trx
  });
};

export const createEventCategory = async (dbContext, category) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: EVENT_CATEGORY_TABLE, 
    columns: EVENT_CATEGORY_TABLE_COLUMNS,
    entity: category,
  }));
  
  return (result.length && result[0]) || {};
};
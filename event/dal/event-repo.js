import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const EVENT_TABLE = 'event';
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

export const getEvents = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: EVENT_TABLE, 
  	columns: EVENT_TABLE_COLUMNS 
  }));

export const getCustomerById = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: EVENT_TABLE, 
  	columns: EVENT_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const getCustomerByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: EVENT_TABLE, 
    columns: EVENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('email = :email', { email })
  });
};


export const getCustomersByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: EVENT_TABLE, 
  	columns: EVENT_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('fullname LIKE :name', { name: `%${name}%` })
  });
};

export const getCustomersByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: EVENT_TABLE, 
    columns: EVENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('email LIKE :email', { email: `%${email}%` })
  });
};


export const updateCustomer = async (dbContext, customerId, customer) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: EVENT_TABLE, 
  	columns: EVENT_TABLE_COLUMNS,
  	entity: customer,
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const deleteCustomer = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: EVENT_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const createCustomer = async (dbContext, customer) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: EVENT_TABLE, 
    columns: EVENT_TABLE_COLUMNS,
    entity: customer,
  }));
  
  return (result.length && result[0]) || {};
};

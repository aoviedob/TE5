import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';
import moment from 'moment';

export const CUSTOMER_TABLE = 'role';
const CUSTOMER_TABLE_COLUMNS = [
  'id',
  'email',
  'phone',
  'external_user_id',
  'fullname',
  'alias',
  'preferences',
  'created_at',
  'updated_at'
];

export const getCustomers = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: CUSTOMER_TABLE, 
  	columns: CUSTOMER_TABLE_COLUMNS 
  }));

export const getCustomerById = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: CUSTOMER_TABLE, 
  	columns: CUSTOMER_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const getCustomerByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: CUSTOMER_TABLE, 
    columns: CUSTOMER_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('id = :email', { email })
  });
};


export const getCustomersByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: CUSTOMER_TABLE, 
  	columns: CUSTOMER_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('name LIKE :name', { name: `%${name}%` })
  });
};

export const getCustomersByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: CUSTOMER_TABLE, 
    columns: CUSTOMER_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('email LIKE :email', { email: `%${email}%` })
  });
};


export const updateCustomer = async (dbContext, customerId, customer) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: CUSTOMER_TABLE, 
  	columns: CUSTOMER_TABLE_COLUMNS,
  	entity: customer,
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const deleteCustomer = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: CUSTOMER_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const createCustomer = async (dbContext, customer) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: CUSTOMER_TABLE, 
    columns: CUSTOMER_TABLE_COLUMNS,
    entity: customer,
  }));
  
  return (result.length && result[0]) || {};
};

import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const PAYMENT_TABLE = 'payment_request';
const PAYMENT_TABLE_COLUMNS = [
  'id',
  'client_id',
  'external_invoice_id',
  'external_customer_id',
  'amount',
  'card_number',
  'card_holder',
  'metadata',
  'created_at'
];

export const getCustomersByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: PAYMENT_TABLE, 
    columns: PAYMENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('fullname LIKE :name', { name: `%${name}%` })
  });
};

export const getCustomers = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: PAYMENT_TABLE, 
  	columns: PAYMENT_TABLE_COLUMNS 
  }));

export const getCustomerById = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: PAYMENT_TABLE, 
  	columns: PAYMENT_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const getCustomerByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: PAYMENT_TABLE, 
    columns: PAYMENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('email = :email', { email })
  });
};


export const getCustomersByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: PAYMENT_TABLE, 
  	columns: PAYMENT_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('fullname LIKE :name', { name: `%${name}%` })
  });
};

export const getCustomersByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: PAYMENT_TABLE, 
    columns: PAYMENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('email LIKE :email', { email: `%${email}%` })
  });
};


export const updateCustomer = async (dbContext, customerId, customer) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: PAYMENT_TABLE, 
  	columns: PAYMENT_TABLE_COLUMNS,
  	entity: customer,
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const deleteCustomer = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: PAYMENT_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :customerId', { customerId })
  });
};

export const createCustomer = async (dbContext, customer) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: PAYMENT_TABLE, 
    columns: PAYMENT_TABLE_COLUMNS,
    entity: customer,
  }));
  
  return (result.length && result[0]) || {};
};

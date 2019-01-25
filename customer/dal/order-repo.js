import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';
import moment from 'moment';

export const ORDER_TABLE = 'order';
export const ORDER_LINE_TABLE = 'order_line';

const ORDER_TABLE_COLUMNS = [
  'id',
  'customer_id',
  'total_amount',
  'status',
  'created_at',
  'updated_at'
];

const ORDER_LINE_TABLE_COLUMNS = [
  'id',
  'order_id',
  'external_product_name',
  'external_product_id',
  'quantity',
  'created_at',
  'updated_at'
];

export const getOrderById = async (dbContext, orderId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: ORDER_TABLE, 
  	columns: ORDER_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :orderId', { orderId })
  });
};

export const getOrdersByCustomerId = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: ORDER_TABLE, 
  	columns: ORDER_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('customer_id = :customerId', { customerId })
  });
};

export const updateOrder = async (dbContext, orderId, order) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: ORDER_TABLE, 
  	columns: ORDER_TABLE_COLUMNS,
  	entity: order,
  	where: unitOfWork.dbConnection.raw('id = :orderId', { orderId })
  });
};

export const deleteOrder = async (dbContext, orderId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: ORDER_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :orderId', { orderId })
  });
};

export const createOrder= async (dbContext, order) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: ORDER_TABLE, 
    columns: ORDER_TABLE_COLUMNS,
    entity: order,
  }));
  
  return (result.length && result[0]) || {};
};

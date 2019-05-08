import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';
import moment from 'moment';
import { formatDBColumns } from '../helpers/formatter';

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
  'external_product_category_id',
  'quantity',
  'created_at',
  'updated_at'
];

export const getOrderById = async (dbContext, { orderId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  const order = await unitOfWork.getOneWhere(schema, { 
  	tableName: ORDER_TABLE, 
  	columns: [...formatDBColumns(ORDER_TABLE, ORDER_TABLE_COLUMNS), `json_agg("${ORDER_LINE_TABLE}".*) as "orderLines"`],
    join: unitOfWork.dbConnection.raw('LEFT JOIN :schema:.:ORDER_LINE_TABLE: ON :ORDER_TABLE:.id = :ORDER_LINE_TABLE:.order_id', { ORDER_LINE_TABLE, ORDER_TABLE, schema }),
  	where: unitOfWork.dbConnection.raw(':ORDER_TABLE:.id = :orderId', { orderId, ORDER_TABLE }),
    groupBy: unitOfWork.dbConnection.raw(':ORDER_TABLE:.id', { ORDER_TABLE }),
    trx,
  });
  const { orderLines, id } = order;
  if(!id) return {};

  return { ...order, orderLines: (orderLines ? orderLines.filter(ol => ol) : []) };
};


export const getOrderByStatus = async (dbContext, { status, customerId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  const order = await unitOfWork.getOneWhere(schema, { 
    tableName: ORDER_TABLE, 
    columns: [...formatDBColumns(ORDER_TABLE, ORDER_TABLE_COLUMNS), `json_agg("${ORDER_LINE_TABLE}".*) as "orderLines"`],
    join: unitOfWork.dbConnection.raw('LEFT JOIN :schema:.:ORDER_LINE_TABLE: ON :ORDER_TABLE:.id = :ORDER_LINE_TABLE:.order_id', { ORDER_LINE_TABLE, ORDER_TABLE, schema }),
    where: unitOfWork.dbConnection.raw(':ORDER_TABLE:.customer_id = :customerId AND :ORDER_TABLE:.status = status', { customerId, status, ORDER_TABLE }),
    groupBy: unitOfWork.dbConnection.raw(':ORDER_TABLE:.id', { ORDER_TABLE }),
    trx,
  });
  const { orderLines, id } = order;
  if(!id) return {};

  return { ...order, orderLines: (orderLines ? orderLines.filter(ol => ol) : []) };
};


export const getOrdersByCustomerId = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return (await unitOfWork.getAllWhere(schema, { 
  	tableName: ORDER_TABLE, 
  	columns: [...formatDBColumns(ORDER_TABLE, ORDER_TABLE_COLUMNS), `json_agg("${ORDER_LINE_TABLE}".*) as "orderLines"`],
    join: unitOfWork.dbConnection.raw('LEFT JOIN :schema:.:ORDER_LINE_TABLE: ON :ORDER_TABLE:.id = :ORDER_LINE_TABLE:.order_id', { ORDER_LINE_TABLE, ORDER_TABLE, schema }),
  	where: unitOfWork.dbConnection.raw('customer_id = :customerId', { customerId }),
    groupBy: unitOfWork.dbConnection.raw(':ORDER_TABLE:.id', { ORDER_TABLE }),
  })).map(order => ({ ...order, orderLines: order.orderLines.filter(ol => ol) }));
};

export const updateOrderLine = async (dbContext, { orderId, externalProductId, orderLine, trx }) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
    tableName: ORDER_LINE_TABLE, 
    columns: ORDER_LINE_TABLE_COLUMNS,
    entity: orderLine,
    where: unitOfWork.dbConnection.raw('order_id = :orderId AND external_product_id = :externalProductId', { orderId, externalProductId }),
    trx,
  });
};

export const upsertOrderLine = async (dbContext, { orderId, externalProductId, orderLine, trx }) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.create(schema, { 
    tableName: ORDER_LINE_TABLE, 
    columns: ORDER_LINE_TABLE_COLUMNS,
    entity: orderLine,
    onConflict: unitOfWork.dbConnection.raw(`ON CONFLICT (order_id, external_product_Id) DO UPDATE SET ${unitOfWork.formatSetValues(ORDER_LINE_TABLE_COLUMNS, orderLine)}`),
    trx,
  });
};

export const updateOrder = async (dbContext, { orderId, order, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: ORDER_TABLE, 
  	columns: ORDER_TABLE_COLUMNS,
  	entity: order,
  	where: unitOfWork.dbConnection.raw('id = :orderId', { orderId }),
    trx,
  });
};

export const deleteOrderLine = async (dbContext, { orderId, externalProductId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
    tableName: ORDER_LINE_TABLE, 
    where: unitOfWork.dbConnection.raw('order_id = :orderId AND external_product_id = :externalProductId', { orderId, externalProductId }),
    trx,
  });
};

export const deleteOrder = async (dbContext, { orderId, trx }) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: ORDER_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :orderId', { orderId }),
    trx
  });
};

export const createOrderLine = async (dbContext, { orderLine, trx }) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: ORDER_LINE_TABLE, 
    columns: ORDER_LINE_TABLE_COLUMNS,
    entity: orderLine,
    trx,
  }));
  
  return (result.length && result[0]) || {};
};

export const createOrder = async (dbContext, { order, trx }) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: ORDER_TABLE, 
    columns: ORDER_TABLE_COLUMNS,
    entity: order,
    trx,
  }));
  
  return (result.length && result[0]) || {};
};

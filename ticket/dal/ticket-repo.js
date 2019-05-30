import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const TICKET_TABLE = 'ticket';
const CANCELED_TICKET_TABLE = 'canceled_ticket';

const TICKET_TABLE_COLUMNS = [
  'id',
  'invoice_id',
  'ticket_category_id',
  'external_customer_id',
  'coupon_id',
  'final_price',
  'external_order_id',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at'
];

const CANCELED_TICKET_TABLE_COLUMNS = [
  'id',
  'ticket_id',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at'
];

export const getTickets = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: TICKET_TABLE, 
  	columns: TICKET_TABLE_COLUMNS 
  }));

export const getTicketById = async (dbContext, ticketId, trx) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: TICKET_TABLE, 
  	columns: TICKET_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :ticketId', { ticketId }),
    trx
  });
};

export const getCanceledTicketById = async (dbContext, ticketId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: CANCELED_TICKET_TABLE, 
    columns: CANCELED_TICKET_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('ticket_id = :ticketId', { ticketId })
  });
};

export const getTicketByInvoiceId = async (dbContext, invoiceId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: TICKET_TABLE, 
    columns: TICKET_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('invoice_id = :invoiceId', { invoiceId })
  });
};

export const getTicketsByCategoryId = async (dbContext, categoryId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: TICKET_TABLE, 
  	columns: TICKET_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('ticket_category_id = :categoryId', { categoryId })
  });
};

export const getTicketsByCustomerId = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: TICKET_TABLE, 
    columns: TICKET_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('external_customer_id = :customerId', { customerId })
  });
};

export const getTicketsByCouponId = async (dbContext, couponId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: TICKET_TABLE, 
    columns: TICKET_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('coupon_id = :couponId', { couponId })
  });
};

export const cancelTicket = async (dbContext, ticket) =>
  await (new UnitOfWork(dbContext).create(schema, { 
    tableName: CANCELED_TICKET_TABLE,
    columns: CANCELED_TICKET_TABLE_COLUMNS,
    entity: ticket,
  }));

export const createTicket = async (dbContext, ticket, trx) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: TICKET_TABLE, 
    columns: TICKET_TABLE_COLUMNS,
    entity: ticket,
    trx,
  }));
  
  return (result.length && result[0]) || {};
};

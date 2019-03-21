import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const PAYMENT_REQUEST_TABLE = 'payment_request';
const PAYMENT_REQUEST_TABLE_COLUMNS = [
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

export const PAYMENT_RESPONSE_TABLE = 'payment_response';
const PAYMENT_RESPONSE_TABLE_COLUMNS = [
  'id',
  'payment_request_id',
  'transaction',
  'status',
  'details',
  'created_at'
];

export const TRANSACTION_TABLE = 'transaction';
const TRANSACTION_TABLE_COLUMNS = [
  'id',
  'payment_request_id',
  'transaction',
  'details',
  'created_at'
];

export const CLIENT_TABLE = 'client';
const CLIENT_TABLE_COLUMNS = [
  'id',
  'legal_name',
  'identification',
  'account',
  'private_key',
  'webhook_url',
  'phone',
  'email',
  'address',
  'created_at',
  'updated_at'
];

export const getPaymentRequestsByClientId = async (dbContext, clientId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: PAYMENT_REQUEST_TABLE, 
    columns: PAYMENT_REQUEST_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('client_id = :clientId', { clientId })
  });
};

export const getPaymentRequestByInvoiceId = async (dbContext, clientId, invoiceId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: PAYMENT_REQUEST_TABLE, 
    columns: PAYMENT_REQUEST_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('client_id = :clientId AND external_invoice_id = :invoiceId', { clientId, invoiceId })
  });
};

export const getPaymentRequestsByCustomerId = async (dbContext, clientId, customerId) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: PAYMENT_REQUEST_TABLE, 
    columns: PAYMENT_REQUEST_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('client_id = :clientId AND external_customer_id = :customerId', { clientId, customerId })
  });
};

export const createPaymentRequest = async (dbContext, request) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: PAYMENT_REQUEST_TABLE, 
    columns: PAYMENT_REQUEST_TABLE_COLUMNS,
    entity: request,
  }));
  
  return (result.length && result[0]) || {};
};

export const createPaymentRequest = async (dbContext, request) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: PAYMENT_REQUEST_TABLE, 
    columns: PAYMENT_REQUEST_TABLE_COLUMNS,
    entity: request,
  }));
  
  return (result.length && result[0]) || {};
};

export const getPaymentResponsesByCliendId = async (dbContext, clientId) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: PAYMENT_RESPONSE_TABLE, 
    columns: PAYMENT_RESPONSE_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('client_id = :clientId', { clientId })
  });
};

export const getPaymentResponseByRequestId = async (dbContext, requestId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: PAYMENT_RESPONSE_TABLE, 
    columns: PAYMENT_RESPONSE_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('payment_request_id = :requestId', { requestId })
  });
};

export const createPaymentResponse = async (dbContext, response) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: PAYMENT_RESPONSE_TABLE, 
    columns: PAYMENT_RESPONSE_TABLE_COLUMNS,
    entity: response,
  }));
  
  return (result.length && result[0]) || {};
};

export const createTransaction = async (dbContext, transaction) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: TRANSACTION_TABLE, 
    columns: TRANSACTION_TABLE_COLUMNS,
    entity: transaction,
  }));
  
  return (result.length && result[0]) || {};
};

export const getClientById = async (dbContext, clientId) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: CLIENT_TABLE, 
    columns: CLIENT_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('id = :clientId', { clientId })
  });
};
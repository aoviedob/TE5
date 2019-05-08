import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import bunyan from 'bunyan';
import { pgTestDbConnection } from './connections/pg_test_db_connection';
import { pgDbConnection } from './connections/pg_db_connection';
import moment from 'moment';

const logger = bunyan.createLogger({ name: 'UnitOfWork'} );

export default class UnitOfWork {
  dbConnectionMap = {
    [UnitOfWorkContext.POSTGRES_TEST_CONTEXT]: pgTestDbConnection, 
    [UnitOfWorkContext.POSTGRES_CONTEXT]: pgDbConnection,
  };

  constructor(context) {
    this.context = context;
    logger.info({ context }, 'UnitOfWork started!');
    this.dbConnection = this.dbConnectionMap[context];

    if (!this.dbConnection){
      logger.error({ context }, 'No DB Connection for the given context!');
    }
  }
  
  executeTransaction = async ({ func, trx }) => {
    const transact = async transaction =>
        await func()
        .transacting(transaction)
        .catch(error => {
          logger.error(error, 'Transaction Failed');
          transaction.rollback();
          throw error;
        });
  
    const result = await (trx ? 
      transact(trx) :
      new Promise((resolve, reject) => {
      return this.dbConnection.transaction(async transaction => {
         const response = await transact(transaction);
         resolve(response);
      });
    }));
      
    return result.rows || result;
  };

  _getAll = (schema, { tableName, columns, trx }) =>
    this.dbConnection.raw(`
      SELECT ${columns.join(',')}
      FROM :schema:.:tableName:
    `, { schema, tableName });

  getAll = async (schema, { tableName, columns, trx }) => 
    await this.executeTransaction({ 
      func: () => this._getAll(schema, { tableName, columns }),
      trx
    });

  _getOneWhere = (schema, { tableName, columns, join = '', where = '', groupBy = null }) =>
    this.dbConnection.raw(`
      SELECT ${columns.join(',')}
      FROM :schema:.:tableName:
      ${join}
      WHERE ${where}
      ${(groupBy ? `GROUP BY (${groupBy})`: '')}
      LIMIT 1
    `, { schema, tableName });

  getOneWhere = async (schema, { tableName, columns, join, where, groupBy, trx }) => {
    const result = await this.executeTransaction({ 
      func: () => this._getOneWhere(schema, { tableName, columns, join, where, groupBy }),
      trx
    });
    return result.length ? result[0] : {};
  };

  _getAllWhere = (schema, { tableName, columns, join = '', where = '', groupBy = null }) =>
    this.dbConnection.raw(`
      SELECT ${columns.join(',')}
      FROM :schema:.:tableName:
      ${join}
      WHERE ${where}
      ${(groupBy ? `GROUP BY (${groupBy})`: '')}
    `, { schema, tableName });

  getAllWhere = async (schema, { tableName, columns, join, where, groupBy, trx }) => 
    await this.executeTransaction({ 
      func: () => this._getAllWhere(schema, { tableName, columns, join, where, groupBy }),
      trx
    });
  
  addAuditValues = (entity = {}) => {
    const now = moment().format();
    entity.created_at = now;
    entity.updated_at = now;
  };

  formatSetValues = (columns, entity) => 
    columns.reduce((acc, column) => { 
      const value = entity[column];
      if (value == null) return acc;
      
      const valueStatement = this.dbConnection.raw(`${column} = :${column}`, { [column]: value } ).toString();
      acc.push(valueStatement);
      return acc;
    }, []).join(',');

  _update = (schema, { tableName, columns, entity, where = '' }) =>
    this.dbConnection.raw(`
      UPDATE :schema:.:tableName: 
        SET ${this.formatSetValues(columns, entity)}
      WHERE ${where}
    `, { schema, tableName });

  update = async (schema, { tableName, columns = [], entity, where, trx }) => {
    this.addAuditValues(entity);
    return await this.executeTransaction({ 
      func: () => this._update(schema, { tableName, columns, entity, where }),
      trx
    });
  };
  
  _delete = (schema, { tableName, where }) =>
    this.dbConnection.raw(`
      DELETE
      FROM :schema:.:tableName:
      WHERE ${where}
    `, { schema, tableName });
  
  delete = async (schema, { tableName, where, trx }) => 
    await this.executeTransaction({ 
      func: () => this._delete(schema, { tableName, where }),
      trx
    });

  formatInsertColumns = (columns, entity) =>
    Object.keys(entity).reduce((acc, key, index) => {
      if (!columns.includes(key)) return acc;

      const bindingName = `${key}${index}`;
      acc.push(this.dbConnection.raw(`:${bindingName}:`, { [bindingName]: key }));
      return acc;
    }, []).join(',');

  formatInsertValues = (columns, entity, encryptPassword) =>
    Object.keys(entity).reduce((acc, key) => {
      if (!columns.includes(key)) return acc;

      const bindingName = encryptPassword && key === 'password' ? `MD5(:${key})` : `:${key}`;
      acc.push(this.dbConnection.raw(bindingName, { [key]: entity[key] }));
      return acc;
    }, []).join(',');

  _create = (schema, { tableName, columns, entity, rawValues, encryptPassword, onConflict = '' }) =>
    this.dbConnection.raw(`
      INSERT INTO :schema:.:tableName: (${this.formatInsertColumns(columns, entity)})
        VALUES (${rawValues || this.formatInsertValues(columns, entity, encryptPassword)})
      ${onConflict}   
      RETURNING id
    `, { schema, tableName });

  create = async (schema, { tableName, columns, entity, rawValues, encryptPassword, onConflict, trx }) => {
    this.addAuditValues(entity);
    return await this.executeTransaction({ 
      func: () => this._create(schema, { tableName, columns: columns.filter(column => column !== 'id'), entity, rawValues, encryptPassword, onConflict }),
      trx
    });
  };

  transact = async procedure =>
    await (new Promise((resolve, reject) => { 
      return this.dbConnection.transaction(async trx => {
        await procedure(trx, resolve, reject);
      });
    }));

}
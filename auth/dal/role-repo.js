import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';
import moment from 'moment';

export const ROLE_TABLE = 'role';
const ROLE_TABLE_COLUMNS = [
  'id',
  'name',
  'display_name',
  'rights',
  'created_at',
  'updated_at'
];

export const getRoles = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: ROLE_TABLE, 
  	columns: ROLE_TABLE_COLUMNS 
  }));

export const getRoleById = async (dbContext, roleId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: ROLE_TABLE, 
  	columns: ROLE_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :roleId', { roleId })
  });
};

export const getRoleByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: ROLE_TABLE, 
    columns: ROLE_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('name = :name', { name })
  });
};

export const getRolesByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: ROLE_TABLE, 
  	columns: ROLE_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('name LIKE :name OR display_name LIKE :name', { name: `%${name}%` })
  });
};

export const updateRole = async (dbContext, roleId, role) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: ROLE_TABLE, 
  	columns: ROLE_TABLE_COLUMNS,
  	entity: role,
  	where: unitOfWork.dbConnection.raw('id = :roleId', { roleId })
  });
};

export const deleteRole = async (dbContext, roleId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: ROLE_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :roleId', { roleId })
  });
};

export const createRole = async (dbContext, role) => {
  const unitOfWork = new UnitOfWork(dbContext);
  const now = moment().format();
  const { rights } = role;
  const rightsValueStatement = rights.length ? `array[${rights.join(',')}]` : `'{}'`;

  const result = await unitOfWork.create(schema, { 
    tableName: ROLE_TABLE, 
    columns: ROLE_TABLE_COLUMNS,
    entity: role,
    rawValues: unitOfWork.dbConnection.raw(`:name, :display_name, ${rightsValueStatement}, :created_at, :updated_at`, { ...role, created_at: now, updated_at: now }),
  });
  
  return (result.length && result[0]) || {};
};

import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const USER_TYPE_TABLE = 'user_type';
const USER_TYPE_TABLE_COLUMNS = [
  'id',
  'name',
  'display_name',
  'default_roles',
  'created_at',
  'updated_at'
];

export const getUserTypes = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: USER_TYPE_TABLE, 
  	columns: USER_TYPE_TABLE_COLUMNS 
  }));

export const getUserTypeById = async (dbContext, userTypeId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: USER_TYPE_TABLE, 
  	columns: USER_TYPE_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :userTypeId', { userTypeId })
  });
};

export const getUserTypeByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: USER_TYPE_TABLE, 
    columns: USER_TYPE_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('name = :name', { name })
  });
};

export const getUserTypesByName = async (dbContext, name) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: USER_TYPE_TABLE, 
  	columns: USER_TYPE_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('name LIKE :name OR display_name LIKE :name', { name: `%${name}%` })
  });
};

export const updateUserType = async (dbContext, userTypeId, userType) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: USER_TYPE_TABLE, 
  	columns: USER_TYPE_TABLE_COLUMNS,
  	entity: userType,
  	where: unitOfWork.dbConnection.raw('id = :userTypeId', { userTypeId })
  });
};

export const deleteUserType = async (dbContext, userTypeId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
  	tableName: USER_TYPE_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :userTypeId', { userTypeId })
  });
};

export const createUserType = async (dbContext, userType) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: USER_TYPE_TABLE, 
    columns: USER_TYPE_TABLE_COLUMNS,
    entity: userType
  }));

  return (result.length && result[0]) || {};
}

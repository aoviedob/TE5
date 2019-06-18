import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';
import { ROLE_TABLE } from './role-repo';
import { USER_TYPE_TABLE } from './user-type-repo';

const USER_TABLE = 'user';
const ROLE_BY_USER_TABLE = 'role_by_user';

const ROLE_BY_USER_TABLE_COLUMNS = [
  'id',
  'role_id',
  'user_id',
  'created_at',
  'updated_at'
];

const USER_TABLE_COLUMNS = [
  'id',
  'user_type_id',
  'fullname',
  'alias',
  'email',
  'phone',
  'password',
  'login_attempts',
  'last_login_attempt',
  'metadata',
  'created_at',
  'updated_at'
];

export const getUsers = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
  	tableName: USER_TABLE, 
  	columns: USER_TABLE_COLUMNS 
  }));

export const getUserById = async (dbContext, userId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: USER_TABLE, 
  	columns: USER_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('id = :userId', { userId })
  });
};

export const getUserByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
  	tableName: USER_TABLE, 
  	columns: USER_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('email = :email', { email })
  });
};

export const getExtendedUserByEmail = async (dbContext, email) => { 
  const result = await (new UnitOfWork(dbContext).dbConnection.raw(`
    SELECT 
      json_agg(u.*) AS user,
      json_agg(r.*) AS role,
      json_agg(t.*) AS "userType"
    FROM :schema:.:userTable: u
    INNER JOIN :schema:.:roleByUserTable: rbu ON rbu.user_id = u.id
    INNER JOIN :schema:.:roleTable: r ON r.id = rbu.role_id
    INNER JOIN :schema:.:userTypeTable: t ON t.id = u.user_type_id
    WHERE email = :email
  `, { schema, userTable: USER_TABLE, roleByUserTable: ROLE_BY_USER_TABLE, roleTable: ROLE_TABLE, userTypeTable: USER_TYPE_TABLE, email }));

  if (!result.rows) return {};

  const row = result.rows[0];
  if (!row.user) return {};

  return { user: row.user[0], role: row.role[0], userType: row.userType[0] };
};


export const getUsersByEmail = async (dbContext, email) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
  	tableName: USER_TABLE, 
  	columns: USER_TABLE_COLUMNS,
  	where: unitOfWork.dbConnection.raw('email LIKE :email', { email: `%${email}%` })
  });
};

export const updateUser = async (dbContext, userId, user) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
  	tableName: USER_TABLE, 
  	columns: USER_TABLE_COLUMNS,
  	entity: user,
  	where: unitOfWork.dbConnection.raw('id = :userId', { userId })
  });
};

export const deleteUser = async (dbContext, userId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  await unitOfWork.delete(schema, { 
    tableName: ROLE_BY_USER_TABLE, 
    where: unitOfWork.dbConnection.raw('user_id = :userId', { userId }),
  });
  return await unitOfWork.delete(schema, { 
  	tableName: USER_TABLE, 
  	where: unitOfWork.dbConnection.raw('id = :userId', { userId }),
  });
};

export const createUser = async (dbContext, user) => {
  const unitOfWork = new UnitOfWork(dbContext);
  return await (new Promise((resolve, reject) => { 
    return unitOfWork.dbConnection.transaction(async trx => {
      const result = await unitOfWork.create(schema, { 
        tableName: USER_TABLE, 
        columns: USER_TABLE_COLUMNS,
        entity: user,
        encryptPassword: true,
        trx,
      });

      const { id: userId } = result[0];
      await unitOfWork.create(schema, { 
        tableName: ROLE_BY_USER_TABLE, 
        columns: ROLE_BY_USER_TABLE_COLUMNS,
        entity: { role_id: user.role_id, user_id: userId  },
        trx,
      });
      resolve(userId);
    });
  }));
}

export const login = async (dbContext, user) => {
  const result = await (new UnitOfWork(dbContext).dbConnection.raw(`
    SELECT 
      json_agg(u.*) AS user,
      json_agg(r.*) AS role,
      json_agg(t.*) AS "userType"
    FROM :schema:.:userTable: u
    INNER JOIN :schema:.:roleByUserTable: rbu ON rbu.user_id = u.id
    INNER JOIN :schema:.:roleTable: r ON r.id = rbu.role_id
    INNER JOIN :schema:.:userTypeTable: t ON t.id = u.user_type_id
    WHERE email = :email AND password = MD5(:password)
  `, { schema, userTable: USER_TABLE, roleByUserTable: ROLE_BY_USER_TABLE, roleTable: ROLE_TABLE, userTypeTable: USER_TYPE_TABLE, email: user.email, password: user.password }));

  if (!result.rows) return {};

  const row = result.rows[0];
  if (!row.user) return {};

  return { user: row.user[0], role: row.role[0], userType: row.userType[0] };
};
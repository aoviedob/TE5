const { schema, defaultLoginCredentials, managerDefaultLoginCredentials } = require('../../config');
const { PredefinedUserType, PredefinedRole } = require('../../helpers/enums/dal-types');
import { createHash } from '../../services/crypto-service';

exports.up = async dbConnection => {
  await dbConnection.raw(`
    INSERT INTO :schema:.user_type(name, display_name, created_at, updated_at)
      VALUES(:userType, 'EventManager', NOW(), NOW());
  `,
  { schema,
  	userType: PredefinedUserType.EVENT_MANAGER, 
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role(name, display_name, rights, created_at, updated_at)
      VALUES(:role, 'EventManager', '{}', NOW(), NOW());
  `,
  { schema, 
    role: PredefinedRole.EVENT_MANAGER,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user(user_type_id, fullname, email, password, login_attempts, created_at, updated_at)
      VALUES((SELECT id from :schema:.user_type where name = :userType)::UUID, 'EventManager', :user, MD5(:password), 0, NOW(), NOW());
  `,
  { schema, 
    userType: PredefinedUserType.EVENT_MANAGER,
    user: defaultLoginCredentials.user,
    password: createHash(defaultLoginCredentials.password),
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role_by_user(user_id, role_id, created_at, updated_at)
      VALUES((SELECT id from :schema:.user where email = :user)::UUID, 
      (SELECT id from :schema:.role where name = :role)::UUID, NOW(), NOW());`,
  { schema, 
    role: PredefinedRole.EVENT_MANAGER,
    user: defaultLoginCredentials.user,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user_type(name, display_name, created_at, updated_at)
      VALUES(:userType, 'Agent', NOW(), NOW());
  `,
  { schema,
  	userType: PredefinedUserType.AGENT, 
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role(name, display_name, rights, created_at, updated_at)
      VALUES(:role, 'Agent', '{}', NOW(), NOW());
  `,
  { schema, 
    role: PredefinedRole.AGENT,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user(user_type_id, fullname, email, password, login_attempts, created_at, updated_at)
      VALUES((SELECT id from :schema:.user_type where name = :userType)::UUID, 'Agent', :user, MD5(:password), 0, NOW(), NOW());
  `,
  { schema, 
    userType: PredefinedUserType.AGENT,
    user: managerDefaultLoginCredentials.user,
    password: createHash(managerDefaultLoginCredentials.password),
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role_by_user(user_id, role_id, created_at, updated_at)
      VALUES((SELECT id from :schema:.user where email = :user)::UUID, 
      (SELECT id from :schema:.role where name = :role)::UUID, NOW(), NOW());`,
  { schema, 
    role: PredefinedRole.AGENT,
    user: managerDefaultLoginCredentials.user,
  });
}

exports.down = dbConnection => {};
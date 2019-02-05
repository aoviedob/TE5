const { schema, authSystemLoginCredentials } = require('../../config');
const { PredefinedUserType, PredefinedRole } = require('../../helpers/enums/dal-types');
import { createHash } from '../../services/crypto-service';

exports.up = async dbConnection => {
  await dbConnection.raw(`
    INSERT INTO :schema:.user_type(name, display_name, created_at, updated_at)
      VALUES(:systemUserType, 'System', NOW(), NOW());
  `,
  { schema,
  	systemUserType: PredefinedUserType.SYSTEM, 
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role(name, display_name, rights, created_at, updated_at)
      VALUES(:systemRole, 'System', '{}', NOW(), NOW());
  `,
  { schema, 
    systemRole: PredefinedRole.SYSTEM,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user(user_type_id, fullname, email, password, login_attempts, created_at, updated_at)
      VALUES((SELECT id from :schema:.user_type where name = :systemUserType)::UUID, 'System', :user, MD5(:password), 0, NOW(), NOW());
  `,
  { schema, 
    systemUserType: PredefinedUserType.SYSTEM,
    user: authSystemLoginCredentials.user,
    password: createHash(authSystemLoginCredentials.password),
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role_by_user(user_id, role_id, created_at, updated_at)
      VALUES((SELECT id from :schema:.user where email = :user)::UUID, 
      (SELECT id from :schema:.role where name = :systemRole)::UUID, NOW(), NOW());`,
  { schema, 
    systemRole: PredefinedRole.SYSTEM,
    user: authSystemLoginCredentials.user,
  });

}

exports.down = dbConnection => {};
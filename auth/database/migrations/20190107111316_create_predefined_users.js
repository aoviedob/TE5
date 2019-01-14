const { schema, authAdminLoginCredentials, authExternalLoginCredentials } = require('../../config');
const { PredefinedUserType, PredefinedRole } = require('../../helpers/enums/dal-types');

exports.up = async dbConnection => {
  await dbConnection.raw(`
    INSERT INTO :schema:.user_type(name, display_name, created_at, updated_at)
      VALUES(:adminUserType, 'Admin', NOW(), NOW());
  `,
  { schema, 
  	adminUserType: PredefinedUserType.ADMIN, 
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user_type(name, display_name, created_at, updated_at)
      VALUES(:customerUserType, 'Customer', NOW(), NOW());
  `,
  { schema, 
    customerUserType: PredefinedUserType.CUSTOMER, 
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user_type(name, display_name, created_at, updated_at)
      VALUES(:externalUserType, 'External', NOW(), NOW());
  `,
  { schema, 
    externalUserType: PredefinedUserType.EXTERNAL, 
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role(name, display_name, rights, created_at, updated_at)
      VALUES(:adminRole, 'Admin', '{}', NOW(), NOW());
  `,
  { schema, 
    adminRole: PredefinedRole.ADMIN,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role(name, display_name, rights, created_at, updated_at)
      VALUES(:customerRole, 'Customer', '{}', NOW(), NOW());
  `,
  { schema, 
    customerRole: PredefinedRole.CUSTOMER,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role(name, display_name, rights, created_at, updated_at)
      VALUES(:externalRole, 'External', array['externalLogin'], NOW(), NOW());
  `,
  { schema, 
    externalRole: PredefinedRole.EXTERNAL,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user(user_type_id, fullname, email, password, login_attempts, created_at, updated_at)
      VALUES((SELECT id from :schema:.user_type where name = :adminUserType)::UUID, 'Admin', :user, :password, 0, NOW(), NOW());
  `,
  { schema, 
    adminUserType: PredefinedUserType.ADMIN,
    user: authAdminLoginCredentials.user,
    password: authAdminLoginCredentials.password,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.user(user_type_id, fullname, email, password, login_attempts, created_at, updated_at)
      VALUES((SELECT id from :schema:.user_type where name = :externalUserType)::UUID, 'External', :user, :password, 0, NOW(), NOW());
  `,
  { schema, 
    externalUserType: PredefinedUserType.EXTERNAL,
    user: authExternalLoginCredentials.user,
    password: authExternalLoginCredentials.password,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role_by_user(user_id, role_id, created_at, updated_at)
      VALUES((SELECT id from :schema:.user where email = :user)::UUID, 
      (SELECT id from :schema:.role where name = :adminRole)::UUID, NOW(), NOW());`,
  { schema, 
    adminRole: PredefinedRole.ADMIN,
    user: authAdminLoginCredentials.user,
  });

  await dbConnection.raw(`
    INSERT INTO :schema:.role_by_user(user_id, role_id, created_at, updated_at)
      VALUES((SELECT id from :schema:.user where email = :user)::UUID, 
      (SELECT id from :schema:.role where name = :externalRole)::UUID, NOW(), NOW());
  `,
  { schema, 
    externalRole: PredefinedRole.EXTERNAL,
    user: authExternalLoginCredentials.user,
  });
}

exports.down = dbConnection => {};
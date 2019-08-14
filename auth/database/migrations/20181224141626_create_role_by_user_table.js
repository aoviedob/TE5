const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE IF NOT EXISTS :schema:.role_by_user(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid not null,
      role_id uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null,
      UNIQUE (user_id, role_Id)
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.role_by_user', { schema });

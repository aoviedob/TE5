const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.customer(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email varchar(500) UNIQUE not null,
      phone varchar(500),
      external_user_id uuid not null,
      fullname varchar(500) not null,
      alias varchar(500),
      preferences jsonb DEFAULT '{}',
      created_at timestamp,
      updated_at timestamp
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.customer', { schema });

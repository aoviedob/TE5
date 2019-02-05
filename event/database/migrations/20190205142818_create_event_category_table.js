const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.event_category(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(500) UNIQUE not null,
      metadata jsonb DEFAULT '{}' not null,
      settings jsonb DEFAULT '{}' not null,
      updated_by uuid not null,
      created_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.event_category', { schema });

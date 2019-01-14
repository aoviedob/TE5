const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE IF NOT EXISTS :schema:.user_type(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(500) UNIQUE not null,
      display_name  varchar(500) not null,
      default_roles text[] DEFAULT '{}' not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.user_type', { schema });

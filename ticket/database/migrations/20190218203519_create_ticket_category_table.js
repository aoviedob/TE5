const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.ticket_category(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(500) UNIQUE not null,
      external_event_id uuid not null,
      quantity int not null,
      available int not null,
      price numeric(7,2) not null,
      settings jsonb DEFAULT '{}' not null,
      created_by uuid not null,
      updated_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.ticket_category', { schema });

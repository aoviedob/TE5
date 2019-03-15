const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.event_organizer(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(500) not null,
      identification varchar(300) UNIQUE not null,
      type text not null,
      email varchar(500) UNIQUE not null,
      phone varchar(500) UNIQUE not null,
      image_url text,
      web_url text,
      country varchar(300),
      addressLine1 text,
      addressLine2 text,
      metadata jsonb DEFAULT '{}' not null,
      settings jsonb DEFAULT '{}' not null,
      updated_by uuid not null,
      created_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.event_organizer', { schema });

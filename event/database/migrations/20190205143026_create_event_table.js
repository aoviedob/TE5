const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.event(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      event_category_id UUID  REFERENCES :schema:.event_category(id) not null,
      event_organizer_id UUID  REFERENCES :schema:.event_organizer(id) not null,
      name varchar(500) UNIQUE not null,
      tags text[] not null,
      web_url text,
      cover_image_url text not null,
      metadata jsonb DEFAULT '{}' not null,
      settings jsonb DEFAULT '{}' not null,
      start_date timestamp not null,
      end_date timestamp not null,
      status text not null,
      country varchar(300) not null,
      address_line1 text not null,
      address_line2 text not null,
      latitude float,
      longitude float,
      updated_by uuid not null,
      created_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.event', { schema });

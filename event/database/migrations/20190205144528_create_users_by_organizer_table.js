const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.users_by_organizer(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      external_user_id UUID not null,
      event_organizer_id UUID  REFERENCES :schema:.event_organizer(id) not null,
      updated_by uuid not null,
      created_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.users_by_organizer', { schema });

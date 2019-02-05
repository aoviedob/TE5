const { schema } = require('../../config');

exports.up = async dbConnection => {
  await dbConnection.raw(`
    CREATE TABLE :schema:.users_by_organizer(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID  REFERENCES :schema:.event(id) not null,
      tickets_target bigint,
      earnings_target numeric(7,2),
      updated_by uuid not null,
      created_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

  await dbConnection.raw('ALTER TABLE :schema:.users_by_organizer ADD CONSTRAINT at_least_one_target_defined CHECK ((tickets_target IS NULL) != (earnings_target IS NULL));', { schema });
};

exports.down = async dbConnection => { 
  await dbConnection.raw('DROP TABLE :schema:.users_by_organizer', { schema });
  await dbConnection.raw('ALTER TABLE :schema:.users_by_organizer DROP CONSTRAINT IF EXISTS at_least_one_target_defined;', { schema });
};

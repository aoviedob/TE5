const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.coupon(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      code varchar(500) UNIQUE not null,
      name varchar(500),
      quantity int not null,
      available int not null,
      discount numeric(7,2) not null,
      is_percentage boolean not null,
      state text not null,
      start_date timestamp,
      end_date timestamp,
      external_customer_id uuid,
      external_organizer_id uuid not null,
      external_event_id,
      created_by uuid not null,
      updated_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.coupon', { schema });

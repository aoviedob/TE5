const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.order(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID  REFERENCES :schema:.customer(id),
      total_amount numeric(7,2) not null,
      status text not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.order', { schema });

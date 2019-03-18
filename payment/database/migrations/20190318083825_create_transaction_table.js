const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.transaction(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      payment_request_id UUID REFERENCES :schema:.payment_request(id) not null,
      transaction serial unique not null,
      details jsonb DEFAULT '{}',
      created_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.transaction', { schema });

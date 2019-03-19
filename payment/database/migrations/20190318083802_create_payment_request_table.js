const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.payment_request(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID REFERENCES :schema:.client(id) not null,
      external_invoice_id text not null,
      external_customer_id text not null,
      amount numeric(7,2) not null CHECK(amount > 0),
      card_number text not null,
      card_holder text not null,
      metadata jsonb DEFAULT '{}',
      created_at timestamp not null,
      UNIQUE (client_id, external_invoice_id)
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.payment_request', { schema });

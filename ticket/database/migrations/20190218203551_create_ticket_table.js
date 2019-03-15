const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.ticket(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id serial UNIQUE not null,
      ticket_category_id uuid REFERENCES :schema:.ticket_category(id) not null,
      external_customer_id uuid NOT NULL,
      coupon_id uuid REFERENCES :schema:.coupon(id),
      final_price numeric(7,2) not null,
      created_by uuid not null,
      updated_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.ticket', { schema });

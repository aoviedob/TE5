const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.order_line(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID  REFERENCES :schema:.order(id),
      external_product_name varchar(500) not null,
      external_product_id uuid not null,
      quantity int not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.order_line', { schema });

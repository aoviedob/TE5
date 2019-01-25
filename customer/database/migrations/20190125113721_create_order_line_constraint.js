const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw('ALTER TABLE :schema:.order_line ADD CONSTRAINT order_line_id_product_id UNIQUE (id, external_product_id)', { schema });

exports.down = async dbConnection => await dbConnection.raw('ALTER TABLE :schema:.order_line DROP CONSTRAINT order_line_id_product_id', { schema });

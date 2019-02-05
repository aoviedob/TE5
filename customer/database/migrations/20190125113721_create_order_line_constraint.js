const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw('ALTER TABLE :schema:.order_line ADD CONSTRAINT order_id_product_id UNIQUE (order_id, external_product_id)', { schema });

exports.down = async dbConnection => await dbConnection.raw('ALTER TABLE :schema:.order_line DROP CONSTRAINT order_id_product_id', { schema });

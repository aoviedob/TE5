const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    ALTER TABLE :schema:.ticket ADD COLUMN external_order_id TEXT
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('ALTER TABLE :schema:.ticket DROP COLUMN external_order_id', { schema });

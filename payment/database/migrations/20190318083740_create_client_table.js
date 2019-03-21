const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.client(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      legal_name varchar(500) UNIQUE not null,
      identification varchar(500) UNIQUE not null,
      account text not null,
      private_key text not null,
      webhook_url text not null,
      phone varchar(500),
      email varchar(500),
      address varchar(500),
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.client', { schema });

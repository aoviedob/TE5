const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE :schema:.canceled_ticket(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_id uuid REFERENCES :schema:.ticket(id) not null,
      created_by uuid not null,
      updated_by uuid not null,
      created_at timestamp not null,
      updated_at timestamp not null
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.canceled_ticket', { schema });

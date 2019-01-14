const { schema } = require('../../config');

exports.up = async dbConnection => 
  await dbConnection.raw(`
    CREATE TABLE IF NOT EXISTS :schema:.user(
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_type_id uuid REFERENCES :schema:.user_type(id),
      fullname varchar(500) not null,
      alias varchar(200),
      email varchar(500) UNIQUE not null,
      phone varchar(500),
      password text not null,
      metadata jsonb DEFAULT '{}',
      login_attempts int DEFAULT 0 not null,
      last_login_attempt timestamp,
      created_at timestamp,
      updated_at timestamp
    )
  `, { schema });

exports.down = async dbConnection => await dbConnection.raw('DROP TABLE :schema:.user', { schema });

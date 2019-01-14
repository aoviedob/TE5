CREATE EXTENSION IF NOT EXISTS dblink;
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT                       
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'auth_user') THEN

      CREATE ROLE auth_user LOGIN PASSWORD 'mb|33_<C<kl&A*df.c8%*';
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'auth_test') THEN
       PERFORM dblink_exec('dbname=' || current_database()   -- current db
                     , 'CREATE DATABASE ' || quote_ident('auth_test'));

   END IF;

END
$do$;

CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION auth_user;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

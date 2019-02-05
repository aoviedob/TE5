CREATE EXTENSION IF NOT EXISTS dblink;
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT                       
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'customer_user') THEN

      CREATE ROLE customer_user LOGIN PASSWORD '&&//a)(=fgg??<*df.ff%*';
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'customer_test') THEN
       PERFORM dblink_exec('dbname=' || current_database() 
                     , 'CREATE DATABASE ' || quote_ident('customer_test'));

   END IF;

END
$do$;

CREATE SCHEMA IF NOT EXISTS customer AUTHORIZATION customer_user;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

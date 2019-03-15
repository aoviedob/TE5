CREATE EXTENSION IF NOT EXISTS dblink;
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT                       
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'ticket_user') THEN

      CREATE ROLE ticket_user LOGIN PASSWORD 'aob/$a)))66!==5df.ff=*';
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'ticket_test') THEN
       PERFORM dblink_exec('dbname=' || current_database() 
                     , 'CREATE DATABASE ' || quote_ident('ticket_test'));

   END IF;

END
$do$;

CREATE SCHEMA IF NOT EXISTS ticket AUTHORIZATION ticket_user;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

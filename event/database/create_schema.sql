CREATE EXTENSION IF NOT EXISTS dblink;
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT                       
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'event_user') THEN

      CREATE ROLE event_user LOGIN PASSWORD '()/>aWD=&&g??<*df.f?@@*';
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'event_test') THEN
       PERFORM dblink_exec('dbname=' || current_database() 
                     , 'CREATE DATABASE ' || quote_ident('event_test'));

   END IF;

END
$do$;

CREATE SCHEMA IF NOT EXISTS event AUTHORIZATION event_user;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

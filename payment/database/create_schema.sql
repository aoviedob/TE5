CREATE EXTENSION IF NOT EXISTS dblink;
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT                       
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'payment_user') THEN

      CREATE ROLE payment_user LOGIN PASSWORD '//$$(..)@a?fgh?<*#$^ghk%__';
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'payment_test') THEN
       PERFORM dblink_exec('dbname=' || current_database() 
                     , 'CREATE DATABASE ' || quote_ident('payment_test'));

   END IF;

END
$do$;

CREATE SCHEMA IF NOT EXISTS payment AUTHORIZATION payment_user;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO
$do$
BEGIN
PERFORM dblink_exec('dbname=' || quote_ident('customer_test')
                     , 'CREATE SCHEMA IF NOT EXISTS customer AUTHORIZATION customer_user; CREATE EXTENSION IF NOT EXISTS pgcrypto;');
END
$do$;
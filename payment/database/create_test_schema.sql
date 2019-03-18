DO
$do$
BEGIN
PERFORM dblink_exec('dbname=' || quote_ident('payment_test')
                     , 'CREATE SCHEMA IF NOT EXISTS payment AUTHORIZATION payment_user; CREATE EXTENSION IF NOT EXISTS pgcrypto;');
END
$do$;
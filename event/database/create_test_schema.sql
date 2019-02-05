DO
$do$
BEGIN
PERFORM dblink_exec('dbname=' || quote_ident('event_test')
                     , 'CREATE SCHEMA IF NOT EXISTS event AUTHORIZATION event_user; CREATE EXTENSION IF NOT EXISTS pgcrypto;');
END
$do$;
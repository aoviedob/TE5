DO
$do$
BEGIN
PERFORM dblink_exec('dbname=' || quote_ident('auth_test')
                     , 'CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION auth_user; CREATE EXTENSION IF NOT EXISTS pgcrypto;');
END
$do$;
const { schema } = require('../../config');

exports.up = async dbConnection => {
  await dbConnection.raw(`
	CREATE OR REPLACE FUNCTION :schema:.should_forbid_change_on_client()
	  RETURNS trigger AS $should_forbid_change_on_client$
	  DECLARE transaction_exists BOOLEAN;
	BEGIN
	  
	  SELECT 1 INTO transaction_exists
        FROM :schema:.transaction t
        INNER JOIN :schema:.payment_request pr ON t.payment_request_id = pr.id
        WHERE pr.client_id = OLD.id;

	  IF NEW.account <> OLD.account AND transaction_exists IS TRUE THEN
	  	RAISE EXCEPTION 'Account can not be updated';
	  END IF;
	 
	  RETURN NEW;
	END;
	$should_forbid_change_on_client$ LANGUAGE plpgsql;
  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_update_on_client_trigger BEFORE UPDATE
    ON :schema:.client
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.should_forbid_change_on_client();

  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_delete_on_client_trigger BEFORE DELETE
    ON :schema:.client
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.should_forbid_change_on_client();

  `, { schema });

  await dbConnection.raw(`
	CREATE OR REPLACE FUNCTION :schema:.forbid_change_on_payment()
	  RETURNS trigger AS  $forbid_change_on_payment$
	BEGIN

   	  RAISE EXCEPTION 'Payment tables can not be modified';
	 
	  RETURN NEW;
	END;
	
	$forbid_change_on_payment$ LANGUAGE plpgsql;
  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_delete_on_request_trigger BEFORE DELETE
    ON :schema:.payment_request
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.forbid_change_on_payment();
  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_update_on_request_trigger BEFORE UPDATE
    ON :schema:.payment_request
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.forbid_change_on_payment();
  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_delete_on_response_trigger BEFORE DELETE
    ON :schema:.payment_response
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.forbid_change_on_payment();
  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_update_on_response_trigger BEFORE UPDATE
    ON :schema:.payment_response
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.forbid_change_on_payment();
  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_delete_on_transaction_trigger BEFORE DELETE
    ON :schema:.transaction
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.forbid_change_on_payment();
  `, { schema });

  await dbConnection.raw(`
    CREATE TRIGGER handle_update_on_transaction_trigger BEFORE UPDATE
    ON :schema:.transaction
	FOR EACH ROW
    EXECUTE PROCEDURE :schema:.forbid_change_on_payment();
  `, { schema });

};

exports.down = async dbConnection => await dbConnection.raw(`
	DROP TRIGGER IF EXISTS handle_update_on_client_trigger;
	DROP TRIGGER IF EXISTS handle_delete_on_client_trigger;

	DROP FUNCTION IF EXISTS :schema:.should_forbid_change_on_client;

	DROP TRIGGER IF EXISTS handle_delete_on_request_trigger;
	DROP TRIGGER IF EXISTS handle_update_on_request_trigger;
	DROP TRIGGER IF EXISTS handle_delete_on_response_trigger;
	DROP TRIGGER IF EXISTS handle_update_on_response_trigger;
	DROP TRIGGER IF EXISTS handle_delete_on_transaction_trigger;
	DROP TRIGGER IF EXISTS handle_update_on_transaction_trigger;

	DROP FUNCTION IF EXISTS :schema:.should_forbid_change_on_client;

  `, { schema });

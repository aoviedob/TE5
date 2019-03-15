import { UnitOfWorkContext } from '../../helpers/enums/unit_of_work';
import UnitOfWork from '../../database/unit_of_work.js';
import { schema } from '../../config';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'Integrations Index'});

const { POSTGRES_TEST_CONTEXT } = UnitOfWorkContext;

const truncateTables = async() => {
  logger.info('About to execute Truncate Tables Statement');

  const unitOfWork = new UnitOfWork(POSTGRES_TEST_CONTEXT);
  await unitOfWork.dbConnection.raw(`
	DO
	$do$
	BEGIN
	  EXECUTE
	   ((SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
	    FROM   pg_class
	    WHERE  relkind = 'r'  -- only tables
	    AND    relnamespace = '${schema}'::regnamespace
	   ));
	END
	$do$;`);

  logger.info('Truncate Tables Statement executed successfully');
};

beforeEach(async() => {
  logger.info('Started beforeEach');
  await truncateTables();
  logger.info('Finished beforeEach');
});

afterEach(async() => {
  logger.info('Started afterEach');
  await truncateTables();
  logger.info('Finished afterEach');
});

jest.setTimeout(60000);
require('./customer-service-test');
require('./order-service-test');
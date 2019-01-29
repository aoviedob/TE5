import newUuid from 'uuid/v4';
import { UnitOfWorkContext } from '../../helpers/enums/unit_of_work';
const { POSTGRES_TEST_CONTEXT } = UnitOfWorkContext;

jest.unmock('../customer-service');

const externalService = require('../external-service');
externalService.createUser = jest.fn(() => newUuid());

const { createCustomer, getCustomers, getCustomerById, getCustomersByName, getCustomerByEmail, updateCustomer, deleteCustomer } = require('../customer-service');


describe('Customer Service', () => {
  describe('When "createCustomer" function gets called', () => {
  	describe('And valid params are passed', () => {
      test('It should save the customer successfully', async() => {

        const fullname = 'Test Customer';
        const result = await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname, password: '12345678' });
      	expect(result.fullname).toBe(fullname);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createCustomer(POSTGRES_TEST_CONTEXT, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  const customers = [
    'Test Customer',
    'Test Customer 2'
  ];

  describe('When "getCustomers" function gets called', () => {
  	beforeEach(async() => {
      await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname: customers[0], password: '12345678' });
      await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test2@gmail.com', fullname: customers[1], password: '12345678' });
  	});

  	describe('And valid params are passed', () => {
      test('It should return the list of customers', async() => {
      	const result = await getCustomers(POSTGRES_TEST_CONTEXT);

        expect(result.length).toBe(customers.length);
        expect(result.map(({ fullname }) => fullname)).toEqual(customers);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getCustomers(); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
  	  });
  	});
  });

  describe('When "getCustomerById" function gets called', () => {

  	let customerId;
  	beforeEach(async() => {
  	  const result = await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname: customers[0], password: '12345678' });
      customerId = result.id;
  	});

  	describe('And valid params are passed', () => {
      test('It should return the customer by id', async() => {
      	const result = await getCustomerById(POSTGRES_TEST_CONTEXT, customerId);

        expect(result.id).toEqual(customerId);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getCustomerById(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  describe('When "getCustomerByEmail" function gets called', () => {
  	
    let customerId;
    const email = 'test@gmail.com';
    beforeEach(async() => {
      const result = await createCustomer(POSTGRES_TEST_CONTEXT, { email, fullname: customers[0], password: '12345678' });
      customerId = result.id;
    });

  	describe('And valid params are passed', () => {
      test('It should return the customer by email', async() => {
      	const result = await getCustomerByEmail(POSTGRES_TEST_CONTEXT, email);

        expect(result.id).toEqual(customerId);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getCustomerByEmail(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  describe('When "getCustomersByName" function gets called', () => {
  	
    beforeEach(async() => {
      await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname: customers[0], password: '12345678' });
      await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test2@gmail.com', fullname: customers[1], password: '12345678' });
    });

  	describe('And valid params are passed', () => {
      test('It should return the list of customers with similar name', async() => {
      	const result = await getCustomersByName(POSTGRES_TEST_CONTEXT, 'Test');

        expect(result.length).toBe(customers.length);
        expect(result.map(({ fullname }) => fullname)).toEqual(customers);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getCustomersByName(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  describe('When "updateCustomer" function gets called', () => {
  	
  	let customerId;
    beforeEach(async() => {
      const result = await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname: customers[0], password: '12345678' });
      customerId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should update the customer successfully', async() => {
        const newName = 'TEST3';
        await updateCustomer(POSTGRES_TEST_CONTEXT, customerId, { fullname: newName });
        const result = await getCustomerById(POSTGRES_TEST_CONTEXT, customerId);

        expect(result.fullname).toBe(newName);
  	  });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await updateCustomer(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
  	  });
  	});


  });

  describe('When "deleteCustomer" function gets called', () => {
    
    let customerId;
    beforeEach(async() => {
      const result = await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname: customers[0], password: '12345678' });
      customerId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should delete the customer successfully', async() => {
        await deleteCustomer(POSTGRES_TEST_CONTEXT, customerId);
        const result = await getCustomerById(POSTGRES_TEST_CONTEXT, customerId);

        expect(result).toEqual({});
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await deleteCustomer(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

});

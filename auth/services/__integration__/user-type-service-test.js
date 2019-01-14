import { createUserType, getUserTypes, getUserTypeById, getUserTypeByName, getUserTypesByName, updateUserType, deleteUserType } from '../user-type-service';
import { UnitOfWorkContext } from '../../helpers/enums/unit_of_work';
const { POSTGRES_TEST_CONTEXT } = UnitOfWorkContext;

describe('User Type Service', () => {
  describe('When "createUserType" function gets called', () => {
  	describe('And valid params are passed', () => {
      test('It should save the user type successfully', async() => {

        const name = 'Test User Type';
      	const result = await createUserType(POSTGRES_TEST_CONTEXT, { name, displayName: name });
      	expect(result.name).toBe(name);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createUserType(POSTGRES_TEST_CONTEXT, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  const userTypes = [
    'Test User Type',
    'Test User Type 2'
  ];

  describe('When "getUserTypes" function gets called', () => {
  	beforeEach(async() => {
      await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[0], displayName: userTypes[0] });
      await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[1], displayName: userTypes[1] });
  	});

  	describe('And valid params are passed', () => {
      test('It should return the list of user types', async() => {
      	const result = await getUserTypes(POSTGRES_TEST_CONTEXT);

        expect(result.length).toBe(userTypes.length);
        expect(result.map(({ name }) => name)).toEqual(userTypes);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUserTypes(); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getUserTypeById" function gets called', () => {

  	let userTypeId;
  	beforeEach(async() => {
  	  const result = await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[0], displayName: userTypes[0] });
      userTypeId = result.id;
  	});

  	describe('And valid params are passed', () => {
      test('It should return the user type by id', async() => {
      	const result = await getUserTypeById(POSTGRES_TEST_CONTEXT, userTypeId);

        expect(result.id).toEqual(userTypeId);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUserTypeById(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getUserTypeByName" function gets called', () => {
  	
    let userTypeId;
    beforeEach(async() => {
      const result = await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[0], displayName: userTypes[0] });
      userTypeId = result.id;
    });

  	describe('And valid params are passed', () => {
      test('It should return the user type by name', async() => {
      	const result = await getUserTypeByName(POSTGRES_TEST_CONTEXT, userTypes[0]);

        expect(result.id).toEqual(userTypeId);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUserTypeByName(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "getUserTypesByName" function gets called', () => {
  	
    beforeEach(async() => {
      await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[0], displayName: userTypes[0] });
      await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[1], displayName: userTypes[1] });
    });

  	describe('And valid params are passed', () => {
      test('It should return the list of user types with similar name', async() => {
      	const result = await getUserTypesByName(POSTGRES_TEST_CONTEXT, 'Test');

        expect(result.length).toBe(userTypes.length);
        expect(result.map(({ name }) => name)).toEqual(userTypes);
	  });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getUserTypesByName(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	  });
  	});
  });

  describe('When "updateUserType" function gets called', () => {
  	
  	let userTypeId;
    beforeEach(async() => {
      const result = await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[0], displayName: userTypes[0] });
      userTypeId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should update the user type successfully', async() => {
        const newName = 'TEST3';
        await updateUserType(POSTGRES_TEST_CONTEXT, userTypeId, { displayName: newName });
        const result = await getUserTypeById(POSTGRES_TEST_CONTEXT, userTypeId);

        expect(result.displayName).toBe(newName);
  	  });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await updateUserType(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
  	  });
  	});


  });

  describe('When "deleteUserType" function gets called', () => {
    
    let userTypeId;
    beforeEach(async() => {
      const result = await createUserType(POSTGRES_TEST_CONTEXT, { name: userTypes[0], displayName: userTypes[0] });
      userTypeId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should delete the user type successfully', async() => {
        await deleteUserType(POSTGRES_TEST_CONTEXT, userTypeId);
        const result = await getUserTypeById(POSTGRES_TEST_CONTEXT, userTypeId);

        expect(result).toEqual({});
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await deleteUserType(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

});
